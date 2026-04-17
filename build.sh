#!/usr/bin/env bash
#
# build.sh - Bundle an app
#
# Usage: ./build.sh <path>

set -euo pipefail

readonly SCRIPT_NAME="${0##*/}"

usage() {
    cat <<EOF
Usage: ${SCRIPT_NAME} <path>

Bundle an app.

Arguments:
  path    Path to check for existence

Options:
  -h, --help    Show this help message
EOF
}

log() {
    printf '[%s] %s\n' "${SCRIPT_NAME}" "$*" >&2
}

err() {
    printf '[%s] ERROR: %s\n' "${SCRIPT_NAME}" "$*" >&2
}

check_path() {
    local path="$1"

    if [[ -d "${path}" ]]; then
        return 0
    else
        return 1
    fi
}

build() {
    local path="$1"

    log "Building to: ${path}"
    ags bundle app.tsx "${path}/ndvr-shell" -g4
}

main() {
    if [[ $# -eq 0 ]]; then
        err "missing required argument: <path>"
        usage >&2
        exit 2
    fi

    case "$1" in
        -h|--help)
            usage
            exit 0
            ;;
    esac

    if [[ $# -ne 1 ]]; then
        err "expected exactly 1 argument, got $#"
        usage >&2
        exit 2
    fi

    local path="$1"

    if check_path "${path}"; then
        build "${path}"
    else
        err "path does not exist: ${path}"
        exit 1
    fi
}

main "$@"
