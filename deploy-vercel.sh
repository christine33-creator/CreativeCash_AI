#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Check if web-build directory exists
if [ ! -d "web-build" ]; then
  echo "Error: web-build directory not found. Run build:web first."
  exit 1
fi

# Deploy using npx vercel
echo "Deploying to Vercel..."
npx vercel web-build --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi 