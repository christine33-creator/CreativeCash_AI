/**
 * AI Insights Service
 * Provides AI-powered financial insights and recommendations for freelancers
 */

// Mock data for income trends
const mockIncomeData = {
  monthly: [
    { month: 'Jan', amount: 4200 },
    { month: 'Feb', amount: 3800 },
    { month: 'Mar', amount: 5100 },
    { month: 'Apr', amount: 4700 },
    { month: 'May', amount: 5300 },
    { month: 'Jun', amount: 6200 },
  ],
  categories: [
    { name: 'Web Development', amount: 12000 },
    { name: 'Design Work', amount: 8500 },
    { name: 'Consulting', amount: 5800 },
    { name: 'Content Creation', amount: 3000 },
  ],
  clients: [
    { name: 'Client A', amount: 8500 },
    { name: 'Client B', amount: 7200 },
    { name: 'Client C', amount: 6300 },
    { name: 'Client D', amount: 4100 },
    { name: 'Others', amount: 3400 },
  ]
};

/**
 * Generate income insights based on user data
 * @returns {Promise<Object>} Income insights
 */
export async function getIncomeInsights() {
  // In a real app, this would analyze actual user data
  // For now, we'll return mock insights
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const totalIncome = mockIncomeData.monthly.reduce((sum, month) => sum + month.amount, 0);
  const averageMonthly = totalIncome / mockIncomeData.monthly.length;
  
  // Find highest and lowest months
  const sortedMonths = [...mockIncomeData.monthly].sort((a, b) => b.amount - a.amount);
  const highestMonth = sortedMonths[0];
  const lowestMonth = sortedMonths[sortedMonths.length - 1];
  
  // Calculate month-over-month growth
  const lastMonth = mockIncomeData.monthly[mockIncomeData.monthly.length - 1];
  const previousMonth = mockIncomeData.monthly[mockIncomeData.monthly.length - 2];
  const monthlyGrowth = ((lastMonth.amount - previousMonth.amount) / previousMonth.amount) * 100;
  
  // Find top income source
  const topCategory = [...mockIncomeData.categories].sort((a, b) => b.amount - a.amount)[0];
  
  // Find top client
  const topClient = [...mockIncomeData.clients].sort((a, b) => b.amount - a.amount)[0];
  
  // Calculate client concentration risk
  const clientConcentration = (topClient.amount / totalIncome) * 100;
  
  return {
    summary: {
      totalIncome,
      averageMonthly,
      monthlyGrowth,
      highestMonth,
      lowestMonth
    },
    trends: mockIncomeData.monthly,
    diversification: {
      categories: mockIncomeData.categories,
      clients: mockIncomeData.clients,
      topCategory,
      topClient,
      clientConcentration
    },
    insights: [
      {
        id: '1',
        type: 'trend',
        title: 'Income Trend',
        description: monthlyGrowth > 0 
          ? `Your income has grown by ${monthlyGrowth.toFixed(1)}% from ${previousMonth.month} to ${lastMonth.month}.`
          : `Your income has decreased by ${Math.abs(monthlyGrowth).toFixed(1)}% from ${previousMonth.month} to ${lastMonth.month}.`,
        recommendation: monthlyGrowth > 0
          ? 'Keep up the good work! Consider investing some of the additional income.'
          : 'Look for opportunities to increase your income through new clients or services.'
      },
      {
        id: '2',
        type: 'diversification',
        title: 'Income Diversification',
        description: `${topCategory.name} represents ${((topCategory.amount / totalIncome) * 100).toFixed(1)}% of your total income.`,
        recommendation: ((topCategory.amount / totalIncome) * 100) > 50
          ? 'Consider diversifying your income sources to reduce risk.'
          : 'You have a good balance of income sources.'
      },
      {
        id: '3',
        type: 'client',
        title: 'Client Concentration',
        description: `${topClient.name} represents ${clientConcentration.toFixed(1)}% of your total income.`,
        recommendation: clientConcentration > 30
          ? 'High client concentration increases risk. Consider finding additional clients.'
          : 'You have a healthy distribution of clients.'
      },
      {
        id: '4',
        type: 'seasonal',
        title: 'Seasonal Patterns',
        description: `Your highest earning month was ${highestMonth.month} (${highestMonth.amount.toFixed(2)}), and your lowest was ${lowestMonth.month} (${lowestMonth.amount.toFixed(2)}).`,
        recommendation: 'Plan for seasonal fluctuations by building a reserve fund.'
      }
    ],
    recommendations: [
      {
        id: '1',
        title: 'Increase Emergency Fund',
        description: 'Aim to save 3-6 months of expenses in an easily accessible account.',
        priority: 'High',
        category: 'Savings'
      },
      {
        id: '2',
        title: 'Set Aside Tax Money',
        description: 'Remember to set aside approximately 25-30% of your income for taxes.',
        priority: 'High',
        category: 'Taxes'
      },
      {
        id: '3',
        title: 'Diversify Income Sources',
        description: 'Look for opportunities to add new service offerings or client types.',
        priority: 'Medium',
        category: 'Income'
      },
      {
        id: '4',
        title: 'Consider Retirement Contributions',
        description: 'Maximize tax advantages by contributing to a SEP IRA or Solo 401(k).',
        priority: 'Medium',
        category: 'Retirement'
      },
      {
        id: '5',
        title: 'Review Pricing Strategy',
        description: 'Analyze if your current rates align with market value and your expertise.',
        priority: 'Medium',
        category: 'Income'
      }
    ]
  };
}

/**
 * Generate expense insights based on user data
 * @returns {Promise<Object>} Expense insights
 */
export async function getExpenseInsights() {
  // In a real app, this would analyze actual user expense data
  // For now, we'll return mock insights
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    summary: {
      totalExpenses: 12500,
      largestCategory: 'Software Subscriptions',
      potentialSavings: 1850
    },
    insights: [
      {
        id: '1',
        title: 'Subscription Audit',
        description: 'You have 8 active software subscriptions totaling $250/month.',
        recommendation: 'Review your subscriptions and consider consolidating or canceling unused services.'
      },
      {
        id: '2',
        title: 'Tax Deductions',
        description: 'You may be missing potential tax deductions for your home office expenses.',
        recommendation: 'Track and document your home office space and related expenses.'
      },
      {
        id: '3',
        title: 'Business vs. Personal',
        description: 'Some expenses appear to mix business and personal use.',
        recommendation: 'Consider maintaining separate accounts for business and personal expenses.'
      }
    ],
    recommendations: [
      {
        id: '1',
        title: 'Audit Software Subscriptions',
        description: 'Review all subscriptions and cancel unused services.',
        potentialSavings: 600,
        priority: 'High'
      },
      {
        id: '2',
        title: 'Track Home Office Expenses',
        description: 'Document and claim home office deductions.',
        potentialSavings: 1200,
        priority: 'High'
      },
      {
        id: '3',
        title: 'Separate Business & Personal',
        description: 'Use dedicated business accounts and cards.',
        potentialSavings: 0,
        priority: 'Medium'
      }
    ]
  };
}

/**
 * Generate financial health score and insights
 * @returns {Promise<Object>} Financial health assessment
 */
export async function getFinancialHealthAssessment() {
  // In a real app, this would analyze actual user financial data
  // For now, we'll return mock assessment
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    overallScore: 72, // 0-100 scale
    categories: [
      { name: 'Income Stability', score: 65, maxScore: 100 },
      { name: 'Expense Management', score: 78, maxScore: 100 },
      { name: 'Tax Preparation', score: 82, maxScore: 100 },
      { name: 'Retirement Planning', score: 45, maxScore: 100 },
      { name: 'Emergency Fund', score: 90, maxScore: 100 }
    ],
    insights: [
      {
        id: '1',
        title: 'Income Stability',
        description: 'Your income shows moderate month-to-month variation.',
        recommendation: 'Consider strategies to create more consistent income streams.'
      },
      {
        id: '2',
        title: 'Retirement Planning',
        description: 'Your retirement contributions are below recommended levels.',
        recommendation: 'Increase contributions to your SEP IRA or Solo 401(k).'
      },
      {
        id: '3',
        title: 'Emergency Fund',
        description: 'Your emergency fund covers approximately 5 months of expenses.',
        recommendation: 'You have a strong emergency fund. Consider investing additional savings.'
      }
    ]
  };
}

/**
 * Generate personalized financial action plan
 * @returns {Promise<Object>} Action plan
 */
export async function getFinancialActionPlan() {
  // In a real app, this would generate a personalized plan based on user data
  // For now, we'll return a mock plan
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    shortTerm: [
      {
        id: '1',
        title: 'Review and Optimize Expenses',
        description: 'Audit your subscriptions and recurring expenses.',
        timeframe: '1-2 weeks',
        impact: 'Medium',
        completed: false
      },
      {
        id: '2',
        title: 'Set Up Quarterly Tax Payments',
        description: 'Establish a system for making estimated quarterly tax payments.',
        timeframe: 'Immediate',
        impact: 'High',
        completed: true
      },
      {
        id: '3',
        title: 'Separate Business and Personal Finances',
        description: 'Open dedicated business accounts if you haven\'t already.',
        timeframe: '2-4 weeks',
        impact: 'High',
        completed: false
      }
    ],
    mediumTerm: [
      {
        id: '4',
        title: 'Increase Retirement Contributions',
        description: 'Boost your retirement savings by 5% of income.',
        timeframe: '1-3 months',
        impact: 'High',
        completed: false
      },
      {
        id: '5',
        title: 'Diversify Income Sources',
        description: 'Develop a plan to add at least one new income stream.',
        timeframe: '3-6 months',
        impact: 'Medium',
        completed: false
      }
    ],
    longTerm: [
      {
        id: '6',
        title: 'Create a Business Growth Plan',
        description: 'Develop a strategy for scaling your freelance business.',
        timeframe: '6-12 months',
        impact: 'High',
        completed: false
      },
      {
        id: '7',
        title: 'Review and Adjust Financial Strategy',
        description: 'Conduct a comprehensive review of your financial plan.',
        timeframe: 'Annually',
        impact: 'Medium',
        completed: false
      }
    ]
  };
} 