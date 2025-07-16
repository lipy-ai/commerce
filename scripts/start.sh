#!/bin/bash

# Exit on any error
set -e

# Always run relative to the script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load .env from parent/root directory
if [ -f ../.env ]; then
  echo "Loading env vars from ../.env"
  set -a
  source ../.env
  set +a

  # Debug: Show loaded vars (filtering only your app-specific ones)
  echo "Loaded env vars:"
  grep -vE '^\s*#|^\s*$' ../.env | cut -d '=' -f 1 | while read -r var; do
    echo "$var=${!var}"
  done
else
  echo "No .env file found at ../.env"
fi

# Start www on port 3000
echo "Starting apps/www on PORT=3000..."
(
  cd ../apps/www || { echo "Directory apps/www not found"; exit 1; }
  PORT=3000 node .output/server/index.mjs &
)

# Start merchant on port 3001
echo "Starting apps/merchant on PORT=3001..."
(
  cd ../apps/merchant || { echo "Directory apps/merchant not found"; exit 1; }
  PORT=3001 node .output/server/index.mjs &
)

# Start server with Bun (foreground)
echo "Starting apps/server with Bun..."
(
  cd ../apps/server || { echo "Directory apps/server not found"; exit 1; }
  bun run dev
)
