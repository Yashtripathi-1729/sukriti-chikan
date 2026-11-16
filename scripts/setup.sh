#!/bin/bash
# Setup script for Sukriti Chikan website
# Run this from the sukriti-chikan/ directory

set -e

echo "=== Installing dependencies ==="
npm install

echo ""
echo "=== Setup .env.local ==="
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "Created .env.local from example. Please edit it with your values:"
  echo "  1. Supabase URL & keys (create project at https://supabase.com)"
  echo "  2. Gemini API key (get free at https://aistudio.google.com/apikey)"
  echo "  3. Admin password (choose any password)"
  echo "  4. WhatsApp number (with country code)"
else
  echo ".env.local already exists"
fi

echo ""
echo "=== Done! ==="
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your credentials"
echo "  2. Run the Supabase setup: bash scripts/supabase-setup.sh"
echo "  3. Start dev server: npm run dev"
echo "  4. Open http://localhost:3000 (store) and http://localhost:3000/admin (admin panel)"
