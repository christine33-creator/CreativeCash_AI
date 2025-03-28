#!/bin/bash

# Exit on error
set -e

# Build the app
echo "Building the app..."
npm run build

# Run tests
echo "Running tests..."
npm test

# Build Docker image
echo "Building Docker image..."
docker build -t creativecash-web .

# Push to Docker registry (if configured)
if [ -n "$DOCKER_REGISTRY" ]; then
  echo "Pushing to Docker registry..."
  docker tag creativecash-web $DOCKER_REGISTRY/creativecash-web:latest
  docker push $DOCKER_REGISTRY/creativecash-web:latest
fi

# Deploy using docker-compose
echo "Deploying with docker-compose..."
docker-compose up -d

echo "Deployment complete!" 