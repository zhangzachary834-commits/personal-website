#!/bin/bash

# Navigate to the personal-website directory regardless of where it's launched from
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================="
echo "   Dimension of Thought — Server Restart  "
echo "=========================================="

# 1. Stop ONLY the process listening on port 8000 (does not affect any other terminal/processes)
SERVER_PID=$(lsof -ti :8000)

if [ -n "$SERVER_PID" ]; then
    echo "Stopping existing server on port 8000 (PID: $SERVER_PID)..."
    kill -9 $SERVER_PID 2>/dev/null
    sleep 1
    echo "Previous server stopped."
else
    echo "No active server on port 8000 found."
fi

# 2. Open browser to the local server
echo "Opening http://localhost:8000 in default browser..."
open "http://localhost:8000"

# 3. Start the server in this directory
echo "Starting server at http://localhost:8000"
echo "Press Ctrl + C in this terminal window to stop."
echo "=========================================="
python3 -m http.server 8000
