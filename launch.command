#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================="
echo "   Dimension of Thought — Local Server    "
echo "=========================================="

SERVER_PID=$(lsof -ti :8000)

if [ -n "$SERVER_PID" ]; then
    echo "Stopping existing server on port 8000 (PID: $SERVER_PID)..."
    kill -9 $SERVER_PID 2>/dev/null
    sleep 1
fi

echo "Opening http://localhost:8000 in browser..."
open "http://localhost:8000"

echo "Starting server on port 8000 (directory: $DIR)..."
echo "Press Ctrl + C to stop."
echo "=========================================="
python3 -m http.server 8000
