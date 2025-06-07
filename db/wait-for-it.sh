#!/bin/sh

set -e

hostport="$1"
shift
cmd="$@"

host=$(echo "$hostport" | cut -d: -f1)
port=$(echo "$hostport" | cut -d: -f2)

until nc -z "$host" "$port"; do
  echo "Waiting for $hostport..."
  sleep 1
done

echo "$hostport is available. Running command..."

exec $cmd