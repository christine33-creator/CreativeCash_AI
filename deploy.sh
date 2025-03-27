#!/bin/bash

# Build the web app
npm run build:web

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful, deploying..."
  
  # Navigate to web-build directory
  cd web-build
  
  # Deploy to Vercel
  vercel --prod
  
  # Return to project root
  cd ..
else
  echo "Build failed, not deploying."
  exit 1
fi 