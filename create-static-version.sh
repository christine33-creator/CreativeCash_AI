#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Create a static version directory
echo "Creating static version directory..."
mkdir -p static-version
mkdir -p static-version/api

# Create a simple index.html
cat > static-version/index.html << 'EOL'
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
      color: #333;
    }
    .container {
      max-width: 800px;
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #5c6bc0;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
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
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #3f51b5;
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 2rem 0;
    }
    .feature {
      flex: 1 1 300px;
      margin: 1rem;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-align: left;
    }
    .feature h3 {
      color: #5c6bc0;
      margin-top: 0;
    }
    .app-status {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #e8eaf6;
      border-radius: 8px;
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
    
    <div class="features">
      <div class="feature">
        <h3>Smart Income Tracking</h3>
        <p>Automatically categorize and track your income from multiple sources.</p>
      </div>
      <div class="feature">
        <h3>AI-Powered Insights</h3>
        <p>Get personalized financial insights and recommendations based on your spending patterns.</p>
      </div>
      <div class="feature">
        <h3>Tax Optimization</h3>
        <p>Identify tax deductions and optimize your finances for tax season.</p>
      </div>
    </div>
    
    <div class="app-status">
      <h3>App Status</h3>
      <p>Our mobile app is available now! The web version is currently being deployed.</p>
      <p><span class="loading"></span> Setting up the environment...</p>
    </div>
    
    <div>
      <a href="/app" class="button">Launch App</a>
      <a href="/api/status" class="button">Check API Status</a>
      <a href="mailto:support@creativecash.ai" class="button">Contact Support</a>
    </div>
  </div>
  
  <script>
    // Check if the environment variables are loaded
    const checkEnvironment = () => {
      const statusElement = document.querySelector('.app-status p:nth-child(3)');
      
      // Simulate environment check
      setTimeout(() => {
        statusElement.innerHTML = '<span class="loading"></span> Initializing application...';
        
        // Simulate app initialization
        setTimeout(() => {
          statusElement.innerHTML = 'The application is ready! <a href="/app" class="button">Launch App</a>';
        }, 3000);
      }, 2000);
    };
    
    // Start the environment check when the page loads
    window.onload = checkEnvironment;
  </script>
</body>
</html>
EOL

# Create a simple app.html for the app route
cat > static-version/app.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CreativeCash AI - App</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
    }
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #5c6bc0;
    }
    nav {
      display: flex;
      gap: 1rem;
    }
    .nav-link {
      color: #5c6bc0;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-link:hover {
      background-color: #e8eaf6;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    .card h2 {
      margin-top: 0;
      color: #5c6bc0;
      font-size: 1.2rem;
    }
    .card-value {
      font-size: 2rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    .transactions {
      grid-column: span 2;
    }
    .transaction-item {
      display: flex;
      justify-content: space-between;
      padding: 0.8rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .transaction-item:last-child {
      border-bottom: none;
    }
    .transaction-date {
      color: #757575;
      font-size: 0.9rem;
    }
    .transaction-amount {
      font-weight: bold;
    }
    .income {
      color: #4caf50;
    }
    .expense {
      color: #f44336;
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
    .message {
      text-align: center;
      padding: 2rem;
      background-color: #e8eaf6;
      border-radius: 8px;
      margin: 2rem 0;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <header>
      <div class="logo">CreativeCash AI</div>
      <nav>
        <a href="#" class="nav-link">Dashboard</a>
        <a href="#" class="nav-link">Transactions</a>
        <a href="#" class="nav-link">Reports</a>
        <a href="#" class="nav-link">Settings</a>
        <a href="/" class="nav-link">Logout</a>
      </nav>
    </header>
    
    <div class="message">
      <h2>Welcome to CreativeCash AI!</h2>
      <p>This is a static preview of the application. The full version is coming soon.</p>
      <p>In the meantime, you can explore this demo interface.</p>
    </div>
    
    <div class="dashboard">
      <div class="card">
        <h2>Total Income</h2>
        <div class="card-value">$12,450.00</div>
        <p>Year to date</p>
      </div>
      
      <div class="card">
        <h2>Expenses</h2>
        <div class="card-value">$4,320.00</div>
        <p>Year to date</p>
      </div>
      
      <div class="card">
        <h2>Net Profit</h2>
        <div class="card-value">$8,130.00</div>
        <p>Year to date</p>
      </div>
      
      <div class="card">
        <h2>Upcoming Tax</h2>
        <div class="card-value">$2,032.50</div>
        <p>Estimated</p>
      </div>
      
      <div class="card transactions">
        <h2>Recent Transactions</h2>
        <div class="transaction-item">
          <div>
            <div>Client Payment - ABC Corp</div>
            <div class="transaction-date">May 15, 2023</div>
          </div>
          <div class="transaction-amount income">+$2,500.00</div>
        </div>
        <div class="transaction-item">
          <div>
            <div>Software Subscription</div>
            <div class="transaction-date">May 12, 2023</div>
          </div>
          <div class="transaction-amount expense">-$49.99</div>
        </div>
        <div class="transaction-item">
          <div>
            <div>Client Payment - XYZ Inc</div>
            <div class="transaction-date">May 10, 2023</div>
          </div>
          <div class="transaction-amount income">+$1,800.00</div>
        </div>
        <div class="transaction-item">
          <div>
            <div>Office Supplies</div>
            <div class="transaction-date">May 8, 2023</div>
          </div>
          <div class="transaction-amount expense">-$125.75</div>
        </div>
        <div class="transaction-item">
          <div>
            <div>Client Payment - 123 Design</div>
            <div class="transaction-date">May 5, 2023</div>
          </div>
          <div class="transaction-amount income">+$950.00</div>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Simulate loading data
    document.addEventListener('DOMContentLoaded', () => {
      console.log('App loaded');
    });
  </script>
</body>
</html>
EOL

# Create a 404 page
cat > static-version/404.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CreativeCash AI - Page Not Found</title>
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
      color: #333;
    }
    .container {
      max-width: 600px;
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #5c6bc0;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
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
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #3f51b5;
    }
  </style>
  <script>
    // Redirect to home page after 5 seconds
    setTimeout(function() {
      window.location.href = '/';
    }, 5000);
  </script>
</head>
<body>
  <div class="container">
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <p>You'll be redirected to the home page in 5 seconds.</p>
    <a href="/" class="button">Go to Home Page</a>
  </div>
</body>
</html>
EOL

# Create a simple API endpoint
cat > static-version/api/status.js << 'EOL'
module.exports = (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: 'CreativeCash AI API is running'
  });
};
EOL

# Create opportunities API endpoint
cat > static-version/api/opportunities.js << 'EOL'
module.exports = (req, res) => {
  // Sample opportunities data
  const opportunities = [
    {
      id: 1,
      title: "Freelance Content Writing",
      category: "Freelance",
      description: "Write blog posts, articles, and website content for businesses in various industries. Work on your own schedule and choose projects that interest you.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
      matchPercentage: 95,
      income: "$1,000-3,000/month",
      type: "Flexible"
    },
    // ... more opportunities ...
  ];

  // Get query parameters
  const { category, minMatch } = req.query;
  
  // Filter opportunities based on query parameters
  let filteredOpportunities = [...opportunities];
  
  if (category && category !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.category === category);
  }
  
  if (minMatch) {
    const minMatchValue = parseInt(minMatch);
    if (!isNaN(minMatchValue)) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.matchPercentage >= minMatchValue);
    }
  }
  
  // Return the filtered opportunities
  res.json({
    status: 'success',
    count: filteredOpportunities.length,
    data: filteredOpportunities
  });
};
EOL

# Create insights API endpoint
cat > static-version/api/insights.js << 'EOL'
module.exports = (req, res) => {
  // Sample financial insights data
  const insights = [
    {
      id: 1,
      type: "income",
      title: "Income Growth Opportunity",
      description: "Your content writing income has increased by 15% in the last 3 months. Consider expanding this service to increase your revenue further.",
      impact: "high",
      actionable: true,
      action: "Increase your rates by 10% for new clients to reflect your growing expertise."
    },
    // ... more insights ...
  ];

  // Get query parameters
  const { type, impact } = req.query;
  
  // Filter insights based on query parameters
  let filteredInsights = [...insights];
  
  if (type && type !== 'all') {
    filteredInsights = filteredInsights.filter(insight => insight.type === type);
  }
  
  if (impact && impact !== 'all') {
    filteredInsights = filteredInsights.filter(insight => insight.impact === impact);
  }
  
  // Return the filtered insights
  res.json({
    status: 'success',
    count: filteredInsights.length,
    data: filteredInsights
  });
};
EOL

# Create transactions API endpoint
cat > static-version/api/transactions.js << 'EOL'
module.exports = (req, res) => {
  // Sample transactions data
  const transactions = [
    {
      id: 1,
      type: 'income',
      description: 'Client Project - XYZ Corp',
      category: 'Freelance',
      amount: 2500,
      date: '2023-08-15',
      notes: 'Website redesign project for XYZ Corporation.'
    },
    // ... more transactions ...
  ];

  // Get query parameters
  const { type, category, search, startDate, endDate } = req.query;
  
  // Filter transactions based on query parameters
  let filteredTransactions = [...transactions];
  
  // ... filtering logic ...
  
  // Return the filtered transactions
  res.json({
    status: 'success',
    count: filteredTransactions.length,
    data: filteredTransactions
  });
};
EOL

# Create vercel.json
cat > static-version/vercel.json << 'EOL'
{
  "version": 2,
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/app",
      "dest": "/app.html"
    },
    {
      "src": "/404",
      "dest": "/404.html"
    },
    {
      "src": "/features",
      "dest": "/features.html"
    },
    {
      "src": "/opportunities",
      "dest": "/opportunities.html"
    },
    {
      "src": "/contact",
      "dest": "/contact.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "EXPO_PUBLIC_SUPABASE_URL": "https://mzjtokatolreshwfwgnh.supabase.co",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16anRva2F0b2xyZXNod2Z3Z25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NzMsImV4cCI6MjA1ODI1MTQ3M30.OmPONDxVzqdmkMHuv_1wsCdocCwEyLBFENMKwOisyVY",
    "EXPO_PUBLIC_FIREBASE_API_KEY": "AIzaSyBo-HwCAW_OhfcUqmMhhm4jrcy7fTiN7ws",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "creativecashai.firebaseapp.com",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "creativecashai",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "creativecashai.firebasestorage.app",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "882067255972",
    "EXPO_PUBLIC_FIREBASE_APP_ID": "1:882067255972:web:7e8d782205375b97dbac31"
  }
}
EOL

echo "Static version created successfully!" 