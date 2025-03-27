#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Create the static version
./create-static-version.sh

# Check if the static version was created successfully
if [ $? -eq 0 ]; then
  echo "Static version created successfully!"
  
  # Deploy the static version to Vercel
  echo "Deploying to Vercel..."
  cd static-version
  npx vercel --prod
  
  # Check if the deployment was successful
  if [ $? -eq 0 ]; then
    echo "Deployment successful!"
  else
    echo "Deployment failed."
    exit 1
  fi
else
  echo "Failed to create static version."
  exit 1
fi 