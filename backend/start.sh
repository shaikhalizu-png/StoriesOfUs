#!/bin/bash
# ─────────────────────────────────────────────
#  StoriesOfUs — Start Script
#  Requirements: Node.js (https://nodejs.org)
#                MongoDB running locally
# ─────────────────────────────────────────────

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║       StoriesOfUs  🚀            ║"
echo "  ╚══════════════════════════════════╝"
echo ""

# ── 1. Check Node.js ──────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found."
  echo "    Download it from: https://nodejs.org  (LTS version)"
  exit 1
fi
echo "✅  Node.js $(node -v) found"

# ── 2. Check MongoDB ──────────────────────────
if command -v mongod &>/dev/null; then
  if ! pgrep -x mongod &>/dev/null; then
    echo "⚠️   MongoDB is installed but not running."
    echo "    Start it with:  brew services start mongodb-community"
    echo "    Or:             mongod --dbpath /usr/local/var/mongodb"
    echo ""
    echo "    Trying to continue anyway (MongoDB might be running as a service)..."
  else
    echo "✅  MongoDB is running"
  fi
else
  echo "⚠️   Could not detect MongoDB. Make sure it is running on port 27017."
  echo "    Download: https://www.mongodb.com/try/download/community"
fi

echo ""

# ── 3. Install dependencies if needed ─────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d "node_modules" ]; then
  echo "📦  Installing dependencies (first run only)..."
  npm install
  echo ""
fi

# ── 4. Start the server ───────────────────────
echo "🌐  Starting server on http://localhost:5001"
echo "    Press Ctrl+C to stop."
echo ""
node server.js

