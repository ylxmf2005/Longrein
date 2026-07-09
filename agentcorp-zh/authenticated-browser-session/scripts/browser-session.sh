#!/usr/bin/env bash
set -euo pipefail

PROFILE_DIR="${AGENTCORP_BROWSER_PROFILE:-${CHROME_COOKIE_JS_PROFILE:-$HOME/.agentcorp/browser-session-profile}}"
HOST="${AGENTCORP_BROWSER_HOST:-${CHROME_COOKIE_JS_HOST:-127.0.0.1}}"
PORT="${AGENTCORP_BROWSER_PORT:-${CHROME_COOKIE_JS_PORT:-9222}}"
URL="${1:-about:blank}"

usage() {
  cat <<EOF
用法：
  $0 [url]

环境变量：
  AGENTCORP_BROWSER_PROFILE   配置文件目录，默认 \$HOME/.agentcorp/browser-session-profile
  AGENTCORP_BROWSER_HOST      调试主机，默认 127.0.0.1
  AGENTCORP_BROWSER_PORT      调试端口，默认 9222
  AGENTCORP_BROWSER_BIN       覆盖浏览器可执行文件/应用

旧版兼容变量 CHROME_COOKIE_JS_PROFILE/HOST/PORT 同样被接受。
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 2 "http://$HOST:$PORT/json/version" >/dev/null 2>&1; then
  if ps ax -o command= 2>/dev/null | grep -v grep | grep -F -- "--remote-debugging-port=$PORT" | grep -qF -- "--user-data-dir=$PROFILE_DIR"; then
    echo "Browser CDP 已在 http://$HOST:$PORT 可用（专用配置：$PROFILE_DIR）"
    exit 0
  fi
  echo "http://$HOST:$PORT 上已有一个 CDP 端点正在监听，但它不是专用配置（$PROFILE_DIR）。" >&2
  echo "拒绝附加到另一个浏览器会话（可能是用户的日常浏览器）。" >&2
  echo "请改用 AGENTCORP_BROWSER_PORT 换一个端口。" >&2
  exit 1
fi

if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "端口 $PORT 正在监听，但未暴露 Chrome CDP /json/version。" >&2
  echo "请使用 AGENTCORP_BROWSER_PORT 换一个端口，或停止冲突进程。" >&2
  exit 1
fi

mkdir -p "$PROFILE_DIR"

start_macos() {
  local app_name
  if [[ -n "${AGENTCORP_BROWSER_BIN:-}" ]]; then
    open -na "$AGENTCORP_BROWSER_BIN" --args "$@"
    return
  fi
  for app_name in "Google Chrome" "Chromium" "Microsoft Edge"; do
    if [[ -d "/Applications/$app_name.app" || -d "$HOME/Applications/$app_name.app" ]]; then
      open -na "$app_name" --args "$@"
      return
    fi
  done
  echo "未找到支持的 Chrome/Chromium 浏览器应用。请设置 AGENTCORP_BROWSER_BIN。" >&2
  exit 1
}

start_posix() {
  local bin
  if [[ -n "${AGENTCORP_BROWSER_BIN:-}" ]]; then
    "$AGENTCORP_BROWSER_BIN" "$@" >/dev/null 2>&1 &
    return
  fi
  for bin in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
    if command -v "$bin" >/dev/null 2>&1; then
      "$bin" "$@" >/dev/null 2>&1 &
      return
    fi
  done
  echo "未找到支持的 Chrome/Chromium 浏览器二进制文件。请设置 AGENTCORP_BROWSER_BIN。" >&2
  exit 1
}

ARGS=(
  "--user-data-dir=$PROFILE_DIR"
  "--remote-debugging-address=$HOST"
  "--remote-debugging-port=$PORT"
  "--no-first-run"
  "--new-window"
  "$URL"
)

case "$(uname -s)" in
  Darwin) start_macos "${ARGS[@]}" ;;
  *) start_posix "${ARGS[@]}" ;;
esac

for _ in $(seq 1 30); do
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "http://$HOST:$PORT/json/version" >/dev/null 2>&1; then
    echo "浏览器 CDP 已就绪，地址 http://$HOST:$PORT"
    echo "配置目录：$PROFILE_DIR"
    exit 0
  fi
  sleep 0.5
done

echo "浏览器已启动，但 CDP 未在 http://$HOST:$PORT 就绪" >&2
exit 1
