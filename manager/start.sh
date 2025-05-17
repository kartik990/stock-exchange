#!/bin/bash

REPOS=(
  "./../api"
  "./../frontend"
  "./../ws"
)

# Get the absolute path of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Log and PID directories
LOG_DIR="$SCRIPT_DIR/dev-logs"
PID_FILE="$LOG_DIR/dev-pids.txt"

mkdir -p "$LOG_DIR"
> "$PID_FILE"  # Clear PID file

for REPO in "${REPOS[@]}"; do
  (
    # Resolve full path to the repo
    REPO_PATH="$SCRIPT_DIR/$REPO"
    cd "$REPO_PATH" || { echo "Failed to cd into $REPO_PATH"; exit 1; }

    echo "Starting dev mode for $REPO..."

    # Sanitize log file names (remove ./ and /)
    SAFE_REPO_NAME=$(basename "$REPO_PATH")

    # Start tsc --watch and store its PID
    > "$LOG_DIR/${SAFE_REPO_NAME}-tsc.log" 
    npx tsc --watch > "$LOG_DIR/${SAFE_REPO_NAME}-tsc.log" 2>&1 &
    echo $! >> "$PID_FILE"

    # Start npm run dev and store its PID
    > "$LOG_DIR/${SAFE_REPO_NAME}-dev.log"
    npm run dev > "$LOG_DIR/${SAFE_REPO_NAME}-dev.log" 2>&1 &
    echo $! >> "$PID_FILE"
  )
done

echo "All services started. Logs in $LOG_DIR, PIDs in $PID_FILE"
