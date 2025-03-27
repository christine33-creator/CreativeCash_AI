import { getIncomeEntries } from './incomeService';

// Generate a CSV export of income data
export const generateCSVExport = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await getIncomeEntries(userId);
    
    if (error) throw error;
    
    // Filter by date range if provided
    const filteredData = startDate && endDate 
      ? data.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        })
      : data;
    
    // Create CSV header
    let csv = 'Date,Amount,Source,Description,Tax Category,Payment Method\n';
    
    // Add data rows
    filteredData.forEach(entry => {
      const row = [
        entry.date,
        entry.amount,
        `"${entry.source}"`,
        `"${entry.description.replace(/"/g, '""')}"`,
        `"${entry.tax_category}"`,
        `"${entry.payment_method}"`
      ].join(',');
      
      csv += row + '\n';
    });
    
    return { csv };
  } catch (error) {
    return { error };
  }
};

// Generate a JSON export of income data
export const generateJSONExport = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await getIncomeEntries(userId);
    
    if (error) throw error;
    
    // Filter by date range if provided
    const filteredData = startDate && endDate 
      ? data.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        })
      : data;
    
    return { json: JSON.stringify(filteredData, null, 2) };
  } catch (error) {
    return { error };
  }
};

// Generate monthly income report
export const generateMonthlyReport = async (userId, year) => {
  try {
    const { data, error } = await getIncomeEntries(userId);
    
    if (error) throw error;
    
    // Filter by year if provided
    const filteredData = year
      ? data.filter(entry => new Date(entry.date).getFullYear() === parseInt(year))
      : data;
    
    // Group by month
    const monthlyData = filteredData.reduce((acc, entry) => {
      const month = new Date(entry.date).getMonth();
      acc[month] = (acc[month] || 0) + entry.amount;
      return acc;
    }, {});
    
    // Format the report
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const report = monthNames.map((name, index) => ({
      month: name,
      amount: monthlyData[index] || 0
    }));
    
    return { report };
  } catch (error) {
    return { error };
  }
}; 