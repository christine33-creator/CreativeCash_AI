import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ButtonGroup } from 'react-native-elements';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../../hooks/useAuth';
import { incomeService } from '../../services/income.service';
import { formatCurrency } from '../../utils/formatters';

const screenWidth = Dimensions.get('window').width;

export const IncomeVisualizationScreen = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(0); // 0: Month, 1: Quarter, 2: Year
  const [chartType, setChartType] = useState(0); // 0: Line, 1: Bar, 2: Pie
  const [incomeData, setIncomeData] = useState({
    byMonth: {},
    bySource: {},
    byTaxCategory: {}
  });

  useEffect(() => {
    loadVisualizationData();
  }, [timeRange]);

  const loadVisualizationData = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on selected time range
      const endDate = new Date();
      let startDate;
      
      if (timeRange === 0) { // Month
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeRange === 1) { // Quarter
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
      } else { // Year
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
      
      // Get all income within the date range
      const incomes = await incomeService.getIncomes(user.id, { startDate, endDate });
      
      // Process data for charts
      const byMonth = processIncomeByMonth(incomes);
      const bySource = processIncomeBySource(incomes);
      const byTaxCategory = processIncomeByTaxCategory(incomes);
      
      setIncomeData({
        byMonth,
        bySource,
        byTaxCategory
      });
    } catch (error) {
      console.error('Error loading visualization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processIncomeByMonth = (incomes) => {
    const monthlyData = {};
    
    // Initialize all months in the range
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 0; i < (timeRange === 0 ? 1 : timeRange === 1 ? 3 : 12); i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyData[months[monthIndex]] = 0;
    }
    
    // Sum income by month
    incomes.forEach(income => {
      const date = new Date(income.transactionDate);
      const month = months[date.getMonth()];
      if (monthlyData[month] !== undefined) {
        monthlyData[month] += income.amount;
      }
    });
    
    return monthlyData;
  };

  const processIncomeBySource = (incomes) => {
    const sourceData = {};
    
    // Sum income by source
    incomes.forEach(income => {
      if (!sourceData[income.incomeSource]) {
        sourceData[income.incomeSource] = 0;
      }
      sourceData[income.incomeSource] += income.amount;
    });
    
    return sourceData;
  };

  const processIncomeByTaxCategory = (incomes) => {
    const taxData = {};
    
    // Sum income by tax category
    incomes.forEach(income => {
      if (!taxData[income.taxCategory]) {
        taxData[income.taxCategory] = 0;
      }
      taxData[income.taxCategory] += income.amount;
    });
    
    return taxData;
  };

  const renderTimeRangeSelector = () => {
    const buttons = ['Month', 'Quarter', 'Year'];
    return (
      <ButtonGroup
        onPress={setTimeRange}
        selectedIndex={timeRange}
        buttons={buttons}
        containerStyle={styles.buttonGroup}
      />
    );
  };

  const renderChartTypeSelector = () => {
    const buttons = ['Line', 'Bar', 'Pie'];
    return (
      <ButtonGroup
        onPress={setChartType}
        selectedIndex={chartType}
        buttons={buttons}
        containerStyle={styles.buttonGroup}
      />
    );
  };

  const renderLineChart = () => {
    const months = Object.keys(incomeData.byMonth).reverse();
    const values = months.map(month => incomeData.byMonth[month]);
    
    const data = {
      labels: months,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['Income']
    };
    
    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#2ecc71'
      }
    };
    
    return (
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderBarChart = () => {
    const sources = Object.keys(incomeData.bySource);
    const values = sources.map(source => incomeData.bySource[source]);
    
    const data = {
      labels: sources,
      datasets: [
        {
          data: values
        }
      ]
    };
    
    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      barPercentage: 0.5
    };
    
    return (
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisLabel="$"
        verticalLabelRotation={30}
      />
    );
  };

  const renderPieChart = () => {
    const categories = Object.keys(incomeData.byTaxCategory);
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c'];
    
    const data = categories.map((category, index) => ({
      name: category,
      amount: incomeData.byTaxCategory[category],
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
    
    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    };
    
    return (
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderCurrentChart = () => {
    if (isLoading) {
      return <Text style={styles.loadingText}>Loading chart data...</Text>;
    }
    
    switch (chartType) {
      case 0:
        return renderLineChart();
      case 1:
        return renderBarChart();
      case 2:
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>Income Visualization</Text>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Time Range</Card.Title>
        {renderTimeRangeSelector()}
      </Card>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Chart Type</Card.Title>
        {renderChartTypeSelector()}
      </Card>
      
      <Card containerStyle={styles.chartCard}>
        <Card.Title>
          {chartType === 0 ? 'Income Trend' : 
           chartType === 1 ? 'Income by Source' : 
           'Income by Tax Category'}
        </Card.Title>
        {renderCurrentChart()}
      </Card>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Income Summary</Card.Title>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(
                Object.values(incomeData.byMonth).reduce((sum, val) => sum + val, 0)
              )}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Top Income Source</Text>
            <Text style={styles.summaryValue}>
              {Object.entries(incomeData.bySource)
                .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Average Monthly</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(
                Object.values(incomeData.byMonth).reduce((sum, val) => sum + val, 0) / 
                Math.max(1, Object.keys(incomeData.byMonth).length)
              )}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  chartCard: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
  },
  buttonGroup: {
    marginBottom: 10,
    borderRadius: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IncomeVisualizationScreen; 