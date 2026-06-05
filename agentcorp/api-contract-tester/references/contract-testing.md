# Local Contract Testing Reference

Use this when executing API, JSON-RPC, A2A, CLI, SDK, or exported interface contract checks.

## Contract Surfaces

- HTTP routes: method, path, status code, headers, request body, response body, auth.
- JSON-RPC/A2A: method name, params, result/error shape, streaming behavior, extensions.
- CLI: flags, arguments, exit code, stdout/stderr shape, machine-readable output.
- SDK/exported types: function signatures, schemas, backward-compatible optional fields.
- Error contracts: status/code, body shape, retryability, user-visible message.

## Execution Rules

- Run real requests or commands when an environment is available.
- Exercise happy paths and contract-relevant error paths.
- Compare actual responses with TestPlan, docs, schemas, or previous contract expectations.
- Preserve durable data unless the TestPlan authorizes mutation or the environment is disposable.
- Record untested surfaces explicitly with reason.

## Output Evidence

For each check, record:

- Surface and version, if any.
- Request or command.
- Expected status/shape/output.
- Actual status/shape/output.
- Pass/fail.
- Artifact path or inline redacted sample when useful.

Do not expose secrets in payloads, logs, screenshots, or reports.
