import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function VisualizationScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('month'); // month, quarter, year
  const [chartData, setChartData] = useState({
    incomeBySource: [],
    incomeByMonth: [],
    incomeByTaxCategory: []
  });

  // Sample data
  const mockData = {
    incomeBySource: [
      { name: 'Freelance', amount: 3500, color: '#4A6FA5' },
      { name: 'Contract Work', amount: 2800, color: '#6B8DBF' },
      { name: 'Consulting', amount: 1200, color: '#9BB1D0' },
      { name: 'Teaching', amount: 800, color: '#CBD5E1' },
      { name: 'Product Sales', amount: 350, color: '#E67E22' }
    ],
    incomeByMonth: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [1200, 1800, 1500, 2200, 1700, 2500],
          color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
          strokeWidth: 2
        }
      ]
    },
    incomeByTaxCategory: [
      { name: 'Business Income', amount: 5200, color: '#27AE60' },
      { name: 'Self-Employment', amount: 2100, color: '#2ECC71' },
      { name: 'Royalties', amount: 350, color: '#82E0AA' },
      { name: 'Commission', amount: 1000, color: '#C3E6CB' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChartData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const chartConfig = {
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Income by Source</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData.incomeBySource.map(item => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: colors.text,
            legendFontSize: 12
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <Text style={styles.sectionTitle}>Income Trend</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData.incomeByMonth}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Income Summary</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(chartData.incomeBySource.reduce((sum, item) => sum + item.amount, 0))}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Average Monthly</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(chartData.incomeByMonth.datasets[0].data.reduce((sum, val) => sum + val, 0) / 
              chartData.incomeByMonth.datasets[0].data.length)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Highest Source</Text>
          <Text style={styles.summaryValue}>
            {chartData.incomeBySource.sort((a, b) => b.amount - a.amount)[0].name}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSourcesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Income by Source</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData.incomeBySource.map(item => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: colors.text,
            legendFontSize: 12
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <Text style={styles.sectionTitle}>Source Breakdown</Text>
      <View style={styles.breakdownContainer}>
        {chartData.incomeBySource.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text style={styles.breakdownName}>{item.name}</Text>
              <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View 
                style={[
                  styles.breakdownFill, 
                  { 
                    width: `${(item.amount / chartData.incomeBySource.reduce((sum, src) => sum + src.amount, 0)) * 100}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTaxTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Income by Tax Category</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData.incomeByTaxCategory.map(item => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: colors.text,
            legendFontSize: 12
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <Text style={styles.sectionTitle}>Tax Category Breakdown</Text>
      <View style={styles.breakdownContainer}>
        {chartData.incomeByTaxCategory.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text style={styles.breakdownName}>{item.name}</Text>
              <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View 
                style={[
                  styles.breakdownFill, 
                  { 
                    width: `${(item.amount / chartData.incomeByTaxCategory.reduce((sum, cat) => sum + cat.amount, 0)) * 100}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.taxInfoContainer}>
        <Text style={styles.taxInfoTitle}>Tax Information</Text>
        <Text style={styles.taxInfoText}>
          This breakdown can help you understand your income sources for tax purposes. 
          Remember to consult with a tax professional for specific advice related to your situation.
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income Analytics</Text>
      </View>

      <View style={styles.timeFrameSelector}>
        <TouchableOpacity 
          style={[styles.timeFrameButton, timeFrame === 'month' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('month')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'month' && styles.activeTimeFrameText]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeFrameButton, timeFrame === 'quarter' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('quarter')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'quarter' && styles.activeTimeFrameText]}>Quarter</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeFrameButton, timeFrame === 'year' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('year')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'year' && styles.activeTimeFrameText]}>Year</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="pie-chart" 
            size={20} 
            color={activeTab === 'overview' ? colors.primary : colors.textLight} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sources' && styles.activeTab]}
          onPress={() => setActiveTab('sources')}
        >
          <Ionicons 
            name="briefcase" 
            size={20} 
            color={activeTab === 'sources' ? colors.primary : colors.textLight} 
          />
          <Text style={[styles.tabText, activeTab === 'sources' && styles.activeTabText]}>Sources</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'tax' && styles.activeTab]}
          onPress={() => setActiveTab('tax')}
        >
          <Ionicons 
            name="receipt" 
            size={20} 
            color={activeTab === 'tax' ? colors.primary : colors.textLight} 
          />
          <Text style={[styles.tabText, activeTab === 'tax' && styles.activeTabText]}>Tax</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'sources' && renderSourcesTab()}
        {activeTab === 'tax' && renderTaxTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 10,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTimeFrame: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  timeFrameText: {
    color: colors.textLight,
    fontWeight: '500',
  },
  activeTimeFrameText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textLight,
    marginLeft: 5,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  breakdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  breakdownItem: {
    marginBottom: 15,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  breakdownName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  taxInfoContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  taxInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  taxInfoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
}); 