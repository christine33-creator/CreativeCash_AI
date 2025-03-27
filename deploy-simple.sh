#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Create a simple web-build directory
echo "Creating simple web-build directory..."
mkdir -p web-build-simple

# Create a simple index.html
cat > web-build-simple/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CreativeCash AI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f7fa;
    }
    .container {
      max-width: 800px;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #5c6bc0;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
      color: #333;
      margin-bottom: 2rem;
    }
    .button {
      background-color: #5c6bc0;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      margin: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>CreativeCash AI</h1>
    <p>Financial management for freelancers and creative professionals</p>
    <div>
      <a href="#" class="button">Sign Up</a>
      <a href="#" class="button">Learn More</a>
    </div>
  </div>
</body>
</html>
EOL

# Create a simple vercel.json
cat > web-build-simple/vercel.json << 'EOL'
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOL

# Deploy the simple web-build directory
echo "Deploying simple web-build to Vercel..."
cd web-build-simple
npx vercel --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi 