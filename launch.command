#!/bin/bash

set -u

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR" || exit 1

PORT=8000
URL="http://localhost:${PORT}"

echo "=========================================="
echo "   Dimension of Thought — Local Server    "
echo "=========================================="

SERVER_PIDS="$(lsof -ti tcp:${PORT} 2>/dev/null || true)"
if [ -n "$SERVER_PIDS" ]; then
    echo "Stopping existing server(s) on port ${PORT}: $SERVER_PIDS"
    kill $SERVER_PIDS 2>/dev/null || true

    for _ in 1 2 3 4 5; do
        sleep 0.2
        REMAINING="$(lsof -ti tcp:${PORT} 2>/dev/null || true)"
        [ -z "$REMAINING" ] && break
    done

    REMAINING="$(lsof -ti tcp:${PORT} 2>/dev/null || true)"
    if [ -n "$REMAINING" ]; then
        echo "Server did not stop gracefully; forcing shutdown for PID(s): $REMAINING"
        kill -9 $REMAINING 2>/dev/null || true
    fi
fi

echo "Starting server on port ${PORT} (directory: $DIR)..."
python3 -m http.server "$PORT" &
SERVER_PID=$!

cleanup() {
    if kill -0 "$SERVER_PID" 2>/dev/null; then
        kill "$SERVER_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT INT TERM

sleep 0.4
if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Server failed to start."
    exit 1
fi

echo "Opening $URL in browser..."
open "$URL"
echo "Server PID: $SERVER_PID"
echo "Press Ctrl + C to stop."
echo "=========================================="

wait "$SERVER_PID"
