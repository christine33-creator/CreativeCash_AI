# CreativeCash Tracker - App Flow & Features

## Overview
CreativeCash Tracker is a financial management app designed specifically for creatives, including freelancers, artists, and consultants. It helps users track income, generate financial reports, estimate taxes, visualize income streams, and budget effectively.

## App Flow

### 1. **Welcome Screen**
- The app opens with a welcome screen introducing the app's core functionalities.
- Users can choose to **Sign Up** or **Log In**.

### 2. **User Authentication**
- Users can sign up using their **email and password**.
- Existing users can log in with **email and password**.
- Password reset functionality is available.

### 3. **Main Dashboard** (Landing Screen)
Upon successful login, the user lands on the **Main Dashboard**, which provides an overview of:
- **Total Income** from various projects
- **Upcoming Tax Estimations**
- **Budget Summary**
- **Recent Transactions**
- **Income Stream Visualization** (Graph/Chart)

Users can navigate to different sections using a bottom navigation bar or a sidebar menu.

## Features & Screens

### 1. **Income Tracking**
- Add new income entries by specifying:
  - Project name
  - Income source (Freelance, Art Sales, Consulting, etc.)
  - Amount received
  - Payment method
  - Date of transaction
  - Notes (optional)
- View a **list of income entries** sorted by date/project.
- Edit or delete past income entries.

### 2. **Financial Reports**
- Generate financial reports based on:
  - Time period (Monthly, Quarterly, Yearly)
  - Income source
  - Project-based breakdown
- Export reports as **PDF/CSV**.

### 3. **Tax Estimation & Categorization**
- Automatically categorize income types for tax purposes.
- Estimate taxable income based on location and tax brackets.
- Provide a **tax deduction guide** for creative professionals.

### 4. **Income Visualization & Growth Analysis**
- Display a **graphical representation** of income trends.
- Compare income across different months/years.
- Forecast potential earnings based on historical data.

### 5. **Budgeting Tools**
- Set a **monthly/quarterly budget**.
- Track expenses related to creative work (tools, software, supplies, marketing, etc.).
- Monitor spending vs. income.

### 6. **Settings & Profile Management**
- Update user profile (Name, Email, Currency Preference, etc.).
- Set tax preferences (Country, State, Freelance Tax Status, etc.).
- Enable notifications for **payment reminders, tax deadlines, and budget alerts**.

## Database Schema

### Users
users {
user_id: string (primary key)
email: string
password_hash: string
first_name: string
last_name: string
created_at: timestamp
updated_at: timestamp
currency_preference: string
tax_country: string
tax_state: string
freelance_status: string
notification_preferences: {
payment_reminders: boolean
tax_deadlines: boolean
budget_alerts: boolean
}
}


### Income
income {
income_id: string (primary key)
user_id: string (foreign key)
project_name: string
income_source: string
amount: number
payment_method: string
transaction_date: timestamp
notes: string
created_at: timestamp
updated_at: timestamp
tax_category: string
}


### Projects
projects {
project_id: string (primary key)
user_id: string (foreign key)
name: string
description: string
client: string
start_date: timestamp
end_date: timestamp
status: string
created_at: timestamp
updated_at: timestamp
}


### Expenses
expenses {
expense_id: string (primary key)
user_id: string (foreign key)
project_id: string (foreign key, optional)
category: string
amount: number
date: timestamp
description: string
receipt_url: string
tax_deductible: boolean
created_at: timestamp
updated_at: timestamp
}


### Budgets
budgets {
budget_id: string (primary key)
user_id: string (foreign key)
name: string
period_type: string (monthly, quarterly, yearly)
start_date: timestamp
end_date: timestamp
total_amount: number
created_at: timestamp
updated_at: timestamp
}


### Budget_Categories
budget_categories {
category_id: string (primary key)
budget_id: string (foreign key)
name: string
allocated_amount: number
created_at: timestamp
updated_at: timestamp
}


### Tax_Rates
tax_rates {
rate_id: string (primary key)
country: string
state: string (optional)
income_bracket_min: number
income_bracket_max: number
rate_percentage: number
tax_year: number
created_at: timestamp
updated_at: timestamp
}


### Reports
reports {
report_id: string (primary key)
user_id: string (foreign key)
report_type: string
start_date: timestamp
end_date: timestamp
generated_at: timestamp
report_url: string
parameters: {
income_source: string[]
projects: string[]
categories: string[]
}
}


## Folder Structure
creativecash-ai/
│
├── client/ # Frontend application
│ ├── public/ # Static files
│ ├── src/
│ │ ├── assets/ # Images, fonts, etc.
│ │ ├── components/ # Reusable UI components
│ │ │ ├── common/ # Buttons, inputs, etc.
│ │ │ ├── dashboard/ # Dashboard-specific components
│ │ │ ├── income/ # Income tracking components
│ │ │ ├── reports/ # Report generation components
│ │ │ ├── tax/ # Tax estimation components
│ │ │ ├── visualization/ # Charts and graphs
│ │ │ └── budget/ # Budget management components
│ │ ├── contexts/ # React context providers
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page components
│ │ │ ├── auth/ # Login, signup, password reset
│ │ │ ├── dashboard/ # Main dashboard
│ │ │ ├── income/ # Income tracking
│ │ │ ├── reports/ # Financial reports
│ │ │ ├── tax/ # Tax estimation
│ │ │ ├── visualization/ # Income visualization
│ │ │ ├── budget/ # Budget management
│ │ │ └── settings/ # User settings
│ │ ├── services/ # API service functions
│ │ ├── utils/ # Utility functions
│ │ ├── App.js # Main app component
│ │ └── index.js # Entry point
│ ├── package.json
│ └── README.md
│
├── server/ # Backend application
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Express middleware
│ │ ├── models/ # Database models
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic
│ │ │ ├── auth/ # Authentication services
│ │ │ ├── income/ # Income tracking services
│ │ │ ├── reports/ # Report generation services
│ │ │ ├── tax/ # Tax calculation services
│ │ │ └── budget/ # Budget management services
│ │ ├── utils/ # Utility functions
│ │ └── app.js # Express app setup
│ ├── package.json
│ └── README.md
│
├── ai/ # AI components
│ ├── src/
│ │ ├── models/ # ML models
│ │ ├── data/ # Data processing scripts
│ │ ├── training/ # Model training scripts
│ │ ├── prediction/ # Prediction services
│ │ └── utils/ # AI utilities
│ ├── package.json
│ └── README.md
│
├── docs/ # Documentation
│ ├── api/ # API documentation
│ ├── architecture/ # Architecture diagrams
│ ├── database/ # Database schemas
│ ├── CONTEXT.md # This file
│ └── README.md # Documentation overview
│
├── .github/ # GitHub configuration
│ └── workflows/ # CI/CD workflows
│
├── .gitignore
├── docker-compose.yml # Docker configuration
├── package.json # Root package.json for scripts
└── README.md # Project overview


## Development Considerations

### **Tech Stack Suggestions**
- **Frontend:** React Native (for cross-platform compatibility)
- **Backend:** Node.js with Express
- **Database:** Firebase Firestore / PostgreSQL
- **Authentication:** Firebase Auth / Auth0
- **Graphing & Reports:** Chart.js / D3.js
- **AI/ML:** TensorFlow.js for income prediction and categorization

### **API Endpoints (Example)**
- `POST /api/income` – Add income entry
- `GET /api/income` – Retrieve all income entries
- `DELETE /api/income/:id` – Remove income entry
- `GET /api/reports` – Fetch financial report
- `GET /api/tax` – Retrieve tax estimates
- `POST /api/budget` – Create budget
- `GET /api/visualization/income-trends` – Get income visualization data
- `GET /api/ai/income-prediction` – Get AI-powered income predictions

## Conclusion
CreativeCash Tracker is designed to empower creative professionals with a structured financial management tool. This document outlines the key app flow, features, database schema, and folder structure necessary for developers to implement the application efficiently.