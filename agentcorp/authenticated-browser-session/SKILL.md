---
name: authenticated-browser-session
description: "Use when a task needs a persistent authenticated browser session as a reusable AgentCorp behavior: set up a separate Chrome/Chromium profile with DevTools Protocol, ask the user to log in once, then run page-context JavaScript/fetch so cookies, SSO, CSRF, and same-origin behavior are real. Use for debugging, API probes, E2E or regression verification, internal web apps, authenticated smoke tests, and any task that needs real logged-in browser state without reading cookies."
---

# Authenticated Browser Session

This is a reusable AgentCorp action surface, not a tester role: E2E, API contract, regression, debugging, incident triage, and exploratory verification can all load it when a task needs real logged-in browser state.

You exist because of one failure mode: an agent hits a login wall and reaches for the credential itself — asking the user to paste a token, reading a cookie database, dumping `document.cookie` — or quietly degrades to an unauthenticated probe and presents the result as the real thing. Both break trust in ways the user cannot see. The third path is this skill: operate inside a real page in a dedicated browser profile and let the browser attach credentials naturally, so the evidence stays real and the credential never passes through you.

**Iron law: credentials stay in the browser — use the session, never extract from it.**

The law bans both directions of leakage. Never read on-disk credential artifacts: cookie databases, password stores, local storage dumps, or session files. Never export credentials through the live session either: no `document.cookie` dumps, no CDP cookie or storage APIs (`Network.getCookies` and kin), no copying a session token, cookie, or auth header out of a page-context response for reuse in curl or any other client. If a check seems to need the raw credential, the check is wrong — reshape it to run inside the page.

## What this proves

- Page-context `fetch` proves the behavior of same-origin authenticated requests from that browser session.
- DOM inspection or screenshots prove what the loaded page rendered.
- Console/network observations can support debugging when browser DevTools semantics matter.

State the limits every time they matter: API-only page-context checks do not prove UI layout, full user interaction, or external notifications unless those are separately observed.

## Setup

Use a dedicated profile that is separate from the user's daily browser. The profile persists across tasks, so the user usually logs in once per machine/account.

```bash
./scripts/browser-session.sh 'https://example.com'
```

If running from another directory, call the scripts (`browser-session.sh`, and likewise `page-js.mjs` below) by absolute path from this skill folder:

```bash
/path/to/authenticated-browser-session/scripts/browser-session.sh 'https://example.com'
```

The script adopts an already-listening CDP endpoint only after verifying the owning browser process was started with the dedicated profile (`--user-data-dir=$HOME/.agentcorp/browser-session-profile`); if another browser owns the port — including the user's daily Chrome started with `--remote-debugging-port` — it refuses and tells you to take a fresh port via `AGENTCORP_BROWSER_PORT`. Hold yourself to the same rule when you probe CDP by hand: never run page JS against an endpoint whose profile you have not verified (see Troubleshooting), because doing so operates inside the user's personal session and breaks the promise below.

If the site shows a login page, explain plainly:

> I opened a separate browser profile for agent work. Please log in there; I will not read your cookies or passwords. After you confirm the page is logged in, I can run page-local checks that use the browser session naturally.

Then continue only after the user confirms login.

Configuration knobs:

```bash
AGENTCORP_BROWSER_PROFILE="$HOME/.agentcorp/browser-session-profile"
AGENTCORP_BROWSER_HOST="127.0.0.1"
AGENTCORP_BROWSER_PORT="9222"
AGENTCORP_BROWSER_BIN="/Applications/Google Chrome.app"
```

Use a different port if one is occupied:

```bash
AGENTCORP_BROWSER_PORT=9333 ./scripts/browser-session.sh 'https://example.com'
```

The scripts also accept the legacy `CHROME_COOKIE_JS_PROFILE/HOST/PORT` variables as a fallback, for compatibility with older local setups only.

## Run page JavaScript

Use `page-js.mjs` to run JavaScript in the authenticated page:

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'document.title'
```

For larger checks, write a task-local script under the task workspace or `/tmp` and run it:

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --file /tmp/auth-check.js
```

Use async IIFEs for request probes:

```js
(async () => {
  const response = await fetch('/api/status', { credentials: 'include' });
  const text = await response.text();
  let body = text;
  try { body = JSON.parse(text); } catch {}
  return JSON.stringify({
    url: response.url,
    status: response.status,
    contentType: response.headers.get('content-type'),
    body,
  });
})();
```

## Safety protocol

Prefer a read-only probe first:

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'location.href'
```

Before any page JS that writes data, triggers workflow, sends notifications, starts jobs, or mutates remote state, announce:

- target environment and URL
- exact endpoint or action
- exact payload or human-readable diff
- expected result and evidence
- restore/cleanup plan, or why cleanup is unnecessary

Do not proceed with a write unless the user has clearly authorized that kind of action in the current task.

Never print secrets. Redact URL auth parameters, tokens, temporary credentials, cookies, and sensitive response fields before saving evidence.

## Evidence shape

For verification/debugging artifacts, record enough for replay:

- page URL, title, environment, account by reference
- command or script path used
- request method/path/body, with secrets redacted
- response status/content-type/body summary
- timestamps and trace/request IDs when available
- what the browser session cannot observe directly
- manual observation points, such as email/chat/push notifications

If the page-context request succeeds but the user-visible outcome is outside the browser, pause and ask for the missing observation instead of inferring success.

Before presenting evidence, self-check:

- The session you ran in is the dedicated profile — verified, not assumed.
- No credential material appears in any saved artifact.
- Every write you performed was announced and authorized first.
- The limits of what this evidence proves are stated next to the claim, not implied.

## Red flags — stop the moment one appears

| Thought | Reality |
| --- | --- |
| "A CDP endpoint is already up on this port — attaching saves a browser launch." | It may be the user's daily Chrome. Verify the process runs the dedicated profile before any page JS, or take a fresh port. |
| "`document.cookie` isn't a cookie database, so the rule doesn't cover it." | The iron law bans extraction, not just files on disk. Reading the credential through the session is the same breach with fewer steps. |
| "Copying the session token into curl once would be much faster than page-js." | The moment a token leaves the browser, the privacy promise is broken — and the result no longer proves browser-session behavior. Run the request in the page. |
| "The fetch returned 200, so the feature works." | A 200 proves the request path. UI rendering, notifications, and downstream jobs need their own observation — state what is unproven or go observe it. |
| "It's a tiny POST to a test endpoint; announcing is overhead." | Every remote mutation gets announce-and-authorize. Tiny writes against the wrong environment are how incidents start. |
| "The user has surely finished logging in by now." | Continue only after explicit confirmation. Probing a half-logged-in session produces evidence that is wrong in quiet ways. |

## Troubleshooting

Check whether CDP is available, against the host/port you actually launched with:

```bash
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/version"
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/list"
```

Common cases:

- `/json/version` fails: start the dedicated profile with `browser-session.sh`.
- CDP already available (the script reports it, or you found a listening endpoint yourself): confirm the endpoint belongs to the dedicated profile before running any page JS — the browser process command line must include `--user-data-dir=$HOME/.agentcorp/browser-session-profile` (check with `ps ax | grep -- "--remote-debugging-port=9222"`, substituting your port). If another browser owns the port, switch to a fresh port with `AGENTCORP_BROWSER_PORT` instead of attaching.
- Port is listening but `/json/version` is not Chrome CDP: choose another port.
- Login redirects or SSO appears: ask the user to complete login in the dedicated profile.
- Hash-routed SPA: pass the full URL including `#/route`.
- Browser warnings appear: capture them, but judge success from the requested behavior unless warnings block it.

## Role integration

- Test Planner: include this as an execution surface when a live system needs authenticated browser state. The plan must name the page URL, account/environment, allowed writes, restore plan, and evidence requirements.
- E2E Tester: use it when the TestPlan explicitly allows page-context API/JS as part of the user journey or fallback. State what UI behavior it does and does not prove.
- API Contract Tester: use it for same-origin authenticated API checks when ordinary HTTP clients cannot reproduce browser auth or CSRF behavior.
- Regression Tester and Debugging roles: use it to reproduce logged-in behavior, compare before/after, inspect console output, and capture request/response evidence.
