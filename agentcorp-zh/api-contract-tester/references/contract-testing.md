# Contract testing reference

在对 API、JSON-RPC、A2A、CLI、SDK 或其他外部 interface surface 做 contract verification 时使用。

## 每种 interface surface 要检查的 contract 要素

- **HTTP routes**：method、path、status code、headers、request body、response body、auth。
- **JSON-RPC / A2A**：method name、params、result/error shape、streaming behavior、protocol extensions。
- **CLI**：flags、arguments、exit codes、stdout/stderr shape、machine-readable output。
- **SDK / exported types**：function signatures、schemas、backward-compatible optional fields。
- **error contract**：status/code、body shape、retriability、user-visible message。

## 每种 surface 值得跑的负向探测

- **HTTP routes**：无凭证、过期或越权 token；缺失必填字段；错误的字段类型；对合法 path 使用不支持的 method；超大 body；格式错误的 JSON。
- **JSON-RPC / A2A**：未知 method；params 缺失或格式错误；成功和出错时的 `id` 回显；失败时的 error object shape；stream 在响应中途被打断时的行为。
- **CLI**：未知 flag；缺失必填参数；格式错误的 stdin；每类失败对应的 exit code；出错时 machine-readable output 是否仍可解析。
- **SDK / exported types**：省略可选字段的调用；已有调用方仍会发送的变更前形状的 payload；对返回对象做 schema 校验。

## 每次检查要留的证据

- interface surface 及其版本（如有）。
- 实际发出的 request 或执行的 command。
- 预期的 status / shape / output。
- 实际的 status / shape / output。
- pass / fail。
- 如有必要，附上 artifact path 或脱敏后的 inline sample。
