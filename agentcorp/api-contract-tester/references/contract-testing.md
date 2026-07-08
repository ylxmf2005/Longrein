# Contract testing reference

Use when performing contract verification on an API, JSON-RPC, A2A, CLI, SDK, or other external interface surface.

## Contract elements to check per interface surface

- **HTTP routes**: method, path, status code, headers, request body, response body, auth.
- **JSON-RPC / A2A**: method name, params, result/error shape, streaming behavior, protocol extensions.
- **CLI**: flags, arguments, exit codes, stdout/stderr shape, machine-readable output.
- **SDK / exported types**: function signatures, schemas, backward-compatible optional fields.
- **error contract**: status/code, body shape, retriability, user-visible message.

## Negative probes worth running per surface

- **HTTP routes**: no credentials, expired or out-of-scope token; missing required field; wrong field type; unsupported method on a valid path; oversized body; malformed JSON.
- **JSON-RPC / A2A**: unknown method; malformed or missing params; `id` echo on success and on error; error object shape on failure; behavior when a stream is interrupted mid-response.
- **CLI**: unknown flag; missing required argument; malformed stdin; exit code per failure class; whether machine-readable output stays parseable on error.
- **SDK / exported types**: calls omitting optional fields; payloads in the pre-change shape an existing caller would still send; schema validation of returned objects.

## Evidence to leave for each check

- The interface surface, and the version (if any).
- The request or command used.
- The expected status / shape / output.
- The actual status / shape / output.
- pass / fail.
- An artifact path when useful, or an inline redacted sample.
