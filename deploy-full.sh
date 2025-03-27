#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Build the web version
echo "Building web version..."
npm run build:web:webpack

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Create a proper vercel.json in the web-build directory
  echo "Creating vercel.json in web-build..."
  cat > web-build/vercel.json << 'EOL'
{
  "version": 2,
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/bundles/(.*)",
      "dest": "/bundles/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOL

  # Create a .env file in the web-build directory
  echo "Creating .env file in web-build..."
  cat > web-build/.env << 'EOL'
EXPO_PUBLIC_SUPABASE_URL=https://mzjtokatolreshwfwgnh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16anRva2F0b2xyZXNod2Z3Z25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NzMsImV4cCI6MjA1ODI1MTQ3M30.OmPONDxVzqdmkMHuv_1wsCdocCwEyLBFENMKwOisyVY
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBo-HwCAW_OhfcUqmMhhm4jrcy7fTiN7ws
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=creativecashai.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=creativecashai
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=creativecashai.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=882067255972
EXPO_PUBLIC_FIREBASE_APP_ID=1:882067255972:web:7e8d782205375b97dbac31
EOL

  # Deploy the web-build directory with environment variables
  echo "Deploying to Vercel..."
  cd web-build
  npx vercel --prod \
    -e EXPO_PUBLIC_SUPABASE_URL=https://mzjtokatolreshwfwgnh.supabase.co \
    -e EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16anRva2F0b2xyZXNod2Z3Z25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NzMsImV4cCI6MjA1ODI1MTQ3M30.OmPONDxVzqdmkMHuv_1wsCdocCwEyLBFENMKwOisyVY \
    -e EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBo-HwCAW_OhfcUqmMhhm4jrcy7fTiN7ws \
    -e EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=creativecashai.firebaseapp.com \
    -e EXPO_PUBLIC_FIREBASE_PROJECT_ID=creativecashai \
    -e EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=creativecashai.firebasestorage.app \
    -e EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=882067255972 \
    -e EXPO_PUBLIC_FIREBASE_APP_ID=1:882067255972:web:7e8d782205375b97dbac31
else
  echo "Build failed."
  exit 1
fi 