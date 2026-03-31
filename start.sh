#!/usr/bin/env bash
# ============================================================
#  StoriesOfUs — One-command build & run
#  Usage:  bash start.sh
#          bash start.sh --skip-build   (skip frontend build)
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"
PUBLIC_DIR="$BACKEND_DIR/public"

SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         📖  StoriesOfUs  Startup          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Install backend dependencies ────────────────────────
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --silent
echo "   ✅  Backend deps ready"

if [ "$SKIP_BUILD" = false ]; then
  # ── 2. Install frontend dependencies ─────────────────────
  echo ""
  echo "📦 Installing frontend dependencies..."
  cd "$FRONTEND_DIR"
  npm install --silent
  echo "   ✅  Frontend deps ready"

  # ── 3. Build the React frontend ───────────────────────────
  echo ""
  echo "🔨 Building React frontend (this may take ~30 s)..."
  npm run build
  echo "   ✅  Frontend build complete"

  # ── 4. Copy build → backend/public ───────────────────────
  echo ""
  echo "📂 Copying build to backend/public..."
  mkdir -p "$PUBLIC_DIR"
  # Remove old build files, keep any existing uploads untouched
  find "$PUBLIC_DIR" -maxdepth 1 ! -name 'public' -mindepth 1 -delete 2>/dev/null || true
  cp -r "$FRONTEND_DIR/build/." "$PUBLIC_DIR/"
  echo "   ✅  Build copied to backend/public"
else
  echo ""
  echo "⚡ Skipping frontend build (--skip-build flag set)"
fi

# ── 5. Start the backend server ───────────────────────────
echo ""
echo "🚀 Starting StoriesOfUs server..."
echo "   Open http://localhost:5001 in your browser"
echo "   📱 On mobile (same Wi-Fi): run 'ipconfig getifaddr en0' to find your IP, then open http://<your-ip>:5001"
echo "   ⚠️  Do NOT use port 5000 — macOS Monterey+ reserves it for AirPlay"
echo "   Press Ctrl+C to stop"
echo ""
cd "$BACKEND_DIR"
node server.js

