#!/usr/bin/env bash
# Cross-platform Python launcher for AI log hooks.
# Tries python3 → python → py -3 on PATH; on Windows, falls back to common
# Python install locations because Git Bash launched by some hooks gets a
# stripped PATH that omits the Windows Python directory.
# Designed to be sourced or called as: bash scripts/_pyrun.sh <script> [args...]
#
# Exits 0 silently if no Python is found — hooks must never block the AI tool.
set -u

# Returns true only if the candidate is a real Python, not the Windows Store stub.
_is_real_python() {
  local cmd="$1"
  local path
  path=$(command -v "$cmd" 2>/dev/null) || return 1
  # Windows Store stubs live under WindowsApps — skip them.
  case "$path" in *WindowsApps*) return 1 ;; esac
  "$cmd" --version >/dev/null 2>&1
}

if _is_real_python python3; then
  PY=python3
elif _is_real_python python; then
  PY=python
elif command -v py >/dev/null 2>&1 && py -3 --version >/dev/null 2>&1; then
  PY="py -3"
else
  # PATH lookup failed — probe standard Windows install locations.
  PY=""
  shopt -s nullglob 2>/dev/null || true
  for cand in \
    /c/Users/*/AppData/Local/Programs/Python/Python*/python.exe \
    "/c/Program Files/Python"*/python.exe \
    "/c/Program Files (x86)/Python"*/python.exe \
    /c/Python*/python.exe; do
    if [ -x "$cand" ]; then PY="$cand"; break; fi
  done
  shopt -u nullglob 2>/dev/null || true
  [ -n "$PY" ] || exit 0
fi

# shellcheck disable=SC2086
exec $PY "$@"
