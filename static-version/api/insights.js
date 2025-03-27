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
