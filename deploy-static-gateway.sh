#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Create a static gateway directory
echo "Creating static gateway directory..."
mkdir -p static-gateway

# Create a simple index.html that redirects to the full app
cat > static-gateway/index.html << 'EOL'
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
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(92, 107, 192, 0.3);
      border-radius: 50%;
      border-top-color: #5c6bc0;
      animation: spin 1s ease-in-out infinite;
      margin-right: 10px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>CreativeCash AI</h1>
    <p>Financial management for freelancers and creative professionals</p>
    <p><span class="loading"></span> Redirecting to the full application...</p>
    <div>
      <a href="https://creativecash-ai.vercel.app" class="button">Go to App</a>
      <a href="mailto:support@creativecash.ai" class="button">Contact Support</a>
    </div>
  </div>
  
  <script>
    // Redirect to the full app after 3 seconds
    setTimeout(function() {
      window.location.href = 'https://creativecash-ai.vercel.app';
    }, 3000);
  </script>
</body>
</html>
EOL

# Create a simple vercel.json
cat > static-gateway/vercel.json << 'EOL'
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

# Deploy the static gateway
echo "Deploying static gateway to Vercel..."
cd static-gateway
npx vercel --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi 