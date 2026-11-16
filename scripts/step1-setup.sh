#!/bin/bash
# Step 1: Install dependencies and prepare .env.local
# Run from: sukriti-chikan/ directory

set -e

echo "=== Step 1: Installing dependencies ==="
cd "$(dirname "$0")/.."
npm install

echo ""
echo "=== Creating .env.local ==="
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "Created .env.local"
else
  echo ".env.local already exists"
fi

echo ""
echo "=========================================="
echo "  Dependencies installed!"
echo "=========================================="
echo ""
echo "NOW DO THESE 2 THINGS (takes ~5 min):"
echo ""
echo "--- A) Get Supabase credentials ---"
echo "  1. Go to https://supabase.com → Sign up (free)"
echo "  2. Click 'New Project'"
echo "     - Name: sukriti-chikan"
echo "     - Password: (generate one, save it)"
echo "     - Region: pick nearest (e.g., Mumbai)"
echo "  3. Wait for project to spin up (~1 min)"
echo "  4. Go to Settings → API"
echo "     - Copy 'Project URL'           → paste as NEXT_PUBLIC_SUPABASE_URL"
echo "     - Copy 'anon public' key       → paste as NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "     - Copy 'service_role secret'   → paste as SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "--- B) Get Gemini API key ---"
echo "  1. Go to https://aistudio.google.com/apikey"
echo "  2. Click 'Create API Key'"
echo "  3. Copy the key → paste as GEMINI_API_KEY"
echo ""
echo "--- C) Set admin password ---"
echo "  Open .env.local and set ADMIN_PASSWORD to any password you want"
echo "  Also set NEXT_PUBLIC_WHATSAPP_NUMBER to the store's WhatsApp number"
echo ""
echo "Once done, run: bash scripts/step2-supabase-db.sh"
