#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Build the web version
echo "Building web version..."
npm run build:web

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Copy vercel.json to web-build if it doesn't exist
  if [ ! -f "web-build/vercel.json" ]; then
    echo "Copying vercel.json to web-build..."
    cp vercel.json web-build/
  fi
  
  # Deploy just the web-build directory
  echo "Deploying to Vercel..."
  cd web-build
  npx vercel --prod
else
  echo "Build failed."
  exit 1
fi 