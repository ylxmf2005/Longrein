---
name: authenticated-browser-session
description: "Use when a task needs real logged-in browser state: set up a dedicated Chrome/Chromium profile with DevTools Protocol, ask the user to log in once, then run page-context JavaScript/fetch so cookies, SSO, CSRF, and same-origin behavior are real. Use for debugging, API probes, E2E or regression verification, internal web apps, authenticated smoke tests — any check that would otherwise tempt an agent to ask for a token or read a cookie."
---

# Authenticated Browser Session

This is a reusable AgentCorp action surface, not a tester role: any role — E2E, API contract, regression, debugging, incident triage, exploratory verification — loads it when a task needs real logged-in browser state, and the owning plan or task names the page URL, account/environment, allowed writes, and evidence requirements.

You exist because of one failure mode: an agent hits a login wall and either reaches for the credential itself or quietly degrades to an unauthenticated probe presented as the real thing. Both break trust in ways the user cannot see. The third path is this skill: operate inside a real page in a dedicated browser profile and let the browser attach credentials naturally, so the evidence stays real and the credential never passes through you.

## The iron law

```
CREDENTIALS STAY IN THE BROWSER — USE THE SESSION, NEVER EXTRACT FROM IT.
```

The law bans both directions of leakage. Never read on-disk credential artifacts: cookie databases, password stores, local storage dumps, session files. Never export credentials through the live session either: no `document.cookie` dumps, no CDP cookie/storage APIs (`Network.getCookies` and kin), no copying a session token, cookie, or auth header out of a page-context response for reuse in curl or any other client. If a check seems to need the raw credential, the check is wrong — reshape it to run inside the page.

## What this proves

- Page-context `fetch` proves same-origin authenticated request behavior from that session.
- DOM inspection or screenshots prove what the loaded page rendered.
- Console/network observations support debugging when DevTools semantics matter.

State the limits whenever they matter: API-only page-context checks do not prove UI layout, full user interaction, or external notifications unless those are separately observed. When a page-context request succeeds but the user-visible outcome lives outside the browser (email, chat, push), pause and ask for the missing observation instead of inferring success.

## Setup

Use a dedicated profile, separate from the user's daily browser. The profile persists across tasks, so the user usually logs in once per machine/account.

```bash
./scripts/browser-session.sh 'https://example.com'
```

From another directory, call the scripts (`browser-session.sh`, and likewise `page-js.mjs` below) by absolute path from this skill folder.

The script adopts an already-listening CDP endpoint only after verifying the owning browser process was started with the dedicated profile (`--user-data-dir=$HOME/.agentcorp/browser-session-profile`); if another browser owns the port — including the user's daily Chrome started with `--remote-debugging-port` — it refuses and tells you to take a fresh port via `AGENTCORP_BROWSER_PORT`. Hold yourself to the same rule when probing CDP by hand: never run page JS against an endpoint whose profile you have not verified (see Troubleshooting).

If the site shows a login page, explain plainly:

> I opened a separate browser profile for agent work. Please log in there; I will not read your cookies or passwords. After you confirm the page is logged in, I can run page-local checks that use the browser session naturally.

Continue only after the user confirms login.

Configuration knobs (a different port: `AGENTCORP_BROWSER_PORT=9333 ./scripts/browser-session.sh ...`; the legacy `CHROME_COOKIE_JS_PROFILE/HOST/PORT` variables still work as a fallback for older local setups):

```bash
AGENTCORP_BROWSER_PROFILE="$HOME/.agentcorp/browser-session-profile"
AGENTCORP_BROWSER_HOST="127.0.0.1"
AGENTCORP_BROWSER_PORT="9222"
AGENTCORP_BROWSER_BIN="/Applications/Google Chrome.app"
```

## Run page JavaScript

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'document.title'
node ./scripts/page-js.mjs --url 'https://example.com/app' --file /tmp/auth-check.js   # larger checks: task-local script
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

Prefer a read-only probe first (`--eval 'location.href'`). Before any page JS that writes data, triggers workflow, sends notifications, starts jobs, or mutates remote state, announce: target environment and URL; exact endpoint or action; exact payload or human-readable diff; expected result and evidence; restore/cleanup plan (or why none is needed). Do not proceed with a write unless the user has clearly authorized that kind of action in the current task.

Never print secrets. Redact URL auth parameters, tokens, temporary credentials, cookies, and sensitive response fields before saving evidence.

## Evidence shape

Record enough for replay: page URL, title, environment, account by reference; command or script path; request method/path/body (secrets redacted); response status/content-type/body summary; timestamps and trace/request IDs when available; what the session cannot observe directly, plus manual observation points (email/chat/push).

Before presenting evidence, self-check: the session is the dedicated profile — verified, not assumed; no credential material in any saved artifact; every write was announced and authorized; the limits of what the evidence proves sit next to the claim.

## Red flags — stop when you catch yourself thinking

| Thought | Reality |
| --- | --- |
| "A CDP endpoint is already up on this port — attaching saves a launch." | It may be the user's daily Chrome. Verify the process runs the dedicated profile first, or take a fresh port. |
| "`document.cookie` isn't a cookie database, so the rule doesn't cover it." | The law bans extraction, not just files on disk. Reading the credential through the session is the same breach with fewer steps. |
| "Copying the token into curl once would be faster than page-js." | The moment a token leaves the browser, the promise is broken — and the result no longer proves browser-session behavior. |
| "The fetch returned 200, so the feature works." | A 200 proves the request path. UI rendering, notifications, and downstream jobs need their own observation. |
| "It's a tiny POST to a test endpoint; announcing is overhead." | Every remote mutation gets announce-and-authorize. Tiny writes against the wrong environment are how incidents start. |
| "The user has surely finished logging in by now." | Continue only after explicit confirmation. A half-logged-in session produces evidence that is wrong in quiet ways. |

## Troubleshooting

Check CDP availability against the host/port you actually launched with:

```bash
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/version"
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/list"
```

- `/json/version` fails: start the dedicated profile with `browser-session.sh`.
- CDP already available: confirm the endpoint belongs to the dedicated profile before any page JS — the browser process command line must include `--user-data-dir=$HOME/.agentcorp/browser-session-profile` (`ps ax | grep -- "--remote-debugging-port=9222"`, substituting your port). If another browser owns the port, switch ports instead of attaching.
- Port listening but not Chrome CDP: choose another port.
- Login redirects or SSO appears: ask the user to complete login in the dedicated profile.
- Hash-routed SPA: pass the full URL including `#/route`.
- Browser warnings: capture them, but judge success from the requested behavior unless they block it.
