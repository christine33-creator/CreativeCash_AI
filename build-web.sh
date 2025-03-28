#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Remove existing web-build directory
echo "Removing existing web-build directory..."
rm -rf web-build

# Build the web version
echo "Building web version..."
npx expo export --platform web

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Create the web-build directory if it doesn't exist
  mkdir -p web-build
  
  # Copy files from dist to web-build
  echo "Copying files from dist to web-build..."
  cp -r dist/* web-build/
  
  # List files in web-build directory
  echo "Files in web-build directory:"
  ls -la web-build
  
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
  
  echo "Build successful!"
else
  echo "Build failed."
  exit 1
fi 