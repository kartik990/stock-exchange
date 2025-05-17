#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/dev-logs/dev-pids.txt"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No PID file found. Are any dev processes running?"
  exit 1
fi

echo "Stopping all dev processes..."

while IFS= read -r pid; do
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" && echo "Killed PID $pid"
  else
    echo "PID $pid not running"
  fi
done < "$PID_FILE"

rm "$PID_FILE"
echo "All processes terminated."
