#!/bin/bash
# Step 3: Start the dev server

set -e
cd "$(dirname "$0")/.."

echo "=== Checking .env.local ==="
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local not found. Run step1 first."
  exit 1
fi

# Quick check that keys are set
if grep -q "your-" .env.local; then
  echo "WARNING: .env.local still has placeholder values (your-...)."
  echo "Please edit .env.local with your actual credentials first."
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "=== Starting dev server ==="
echo ""
echo "  Store:  http://localhost:3000"
echo "  Admin:  http://localhost:3000/admin"
echo ""
npm run dev
