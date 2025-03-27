#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Build the web version
echo "Building web version..."
npm run build:web

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Deploy the entire project (not just web-build)
  echo "Deploying to Vercel..."
  npx vercel --prod
else
  echo "Build failed."
  exit 1
fi 