#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Remove existing web-build directory if it exists
if [ -d "web-build" ]; then
  echo "Removing existing web-build directory..."
  rm -rf web-build
fi

# Create a fresh web-build directory
mkdir -p web-build

# Run the export command with the correct syntax for your Expo version
echo "Building web version..."
npx expo export --platform web

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # List files in the dist directory (Expo 48 outputs to dist)
  echo "Files in dist directory:"
  ls -la dist
  
  # Copy files from dist to web-build
  echo "Copying files from dist to web-build..."
  cp -r dist/* web-build/
  
  # List files in web-build directory
  echo "Files in web-build directory:"
  ls -la web-build
else
  echo "Build failed."
  exit 1
fi 