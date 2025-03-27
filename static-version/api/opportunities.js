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
