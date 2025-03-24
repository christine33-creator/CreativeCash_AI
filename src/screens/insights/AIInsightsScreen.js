import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { 
  getIncomeInsights, 
  getExpenseInsights, 
  getFinancialHealthAssessment,
  getFinancialActionPlan
} from '../../services/aiInsightsService';
import { formatCurrency } from '../../utils/formatters';

export default function AIInsightsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState({
    income: null,
    expenses: null,
    health: null,
    actionPlan: null
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // Load all insights in parallel
      const [incomeData, expenseData, healthData, actionPlanData] = await Promise.all([
        getIncomeInsights(),
        getExpenseInsights(),
        getFinancialHealthAssessment(),
        getFinancialActionPlan()
      ]);
      
      setInsights({
        income: incomeData,
        expenses: expenseData,
        health: healthData,
        actionPlan: actionPlanData
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabButton = (tabName, label, icon) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabName && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={activeTab === tabName ? colors.primary : colors.textLight} 
      />
      <Text 
        style={[
          styles.tabButtonText,
          activeTab === tabName && styles.activeTabButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInsightCard = (insight) => (
    <View style={styles.insightCard} key={insight.id}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <View style={[
          styles.insightTypeTag, 
          insight.type === 'trend' ? styles.trendTag : 
          insight.type === 'diversification' ? styles.diversificationTag : 
          insight.type === 'client' ? styles.clientTag : 
          styles.seasonalTag
        ]}>
          <Text style={styles.insightTypeText}>
            {insight.type === 'trend' ? 'Trend' : 
             insight.type === 'diversification' ? 'Diversity' : 
             insight.type === 'client' ? 'Client' : 
             'Seasonal'}
          </Text>
        </View>
      </View>
      <Text style={styles.insightDescription}>{insight.description}</Text>
      <View style={styles.recommendationContainer}>
        <Ionicons name="bulb-outline" size={18} color={colors.primary} style={styles.recommendationIcon} />
        <Text style={styles.recommendationText}>{insight.recommendation}</Text>
      </View>
    </View>
  );

  const renderRecommendationCard = (recommendation) => (
    <View style={styles.recommendationCard} key={recommendation.id}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
        <View style={[
          styles.priorityTag, 
          recommendation.priority === 'High' ? styles.highPriorityTag : 
          recommendation.priority === 'Medium' ? styles.mediumPriorityTag : 
          styles.lowPriorityTag
        ]}>
          <Text style={styles.priorityTagText}>{recommendation.priority}</Text>
        </View>
      </View>
      <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
      {recommendation.potentialSavings && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsLabel}>Potential Savings:</Text>
          <Text style={styles.savingsAmount}>{formatCurrency(recommendation.potentialSavings)}</Text>
        </View>
      )}
    </View>
  );

  const renderActionItem = (action, index, section) => (
    <View style={styles.actionItem} key={action.id}>
      <View style={styles.actionCheckbox}>
        {action.completed ? (
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color={colors.textLight} />
        )}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
        <View style={styles.actionMeta}>
          <View style={styles.actionTimeframe}>
            <Ionicons name="time-outline" size={14} color={colors.textLight} />
            <Text style={styles.actionMetaText}>{action.timeframe}</Text>
          </View>
          <View style={styles.actionImpact}>
            <Ionicons name="trending-up-outline" size={14} color={colors.textLight} />
            <Text style={styles.actionMetaText}>{action.impact} Impact</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHealthScore = () => {
    if (!insights.health) return null;
    
    const { overallScore, categories } = insights.health;
    
    return (
      <View style={styles.healthScoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{overallScore}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        
        <View style={styles.categoryScores}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryScoreItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryScoreText}>{category.score}/{category.maxScore}</Text>
              </View>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreBarFill, 
                    { 
                      width: `${(category.score / category.maxScore) * 100}%`,
                      backgroundColor: category.score < 50 ? colors.error : 
                                      category.score < 70 ? colors.warning : 
                                      colors.success
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderOverviewTab = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your financial data...</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Financial Health Score</Text>
        {renderHealthScore()}
        
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {insights.income?.insights.slice(0, 2).map(renderInsightCard)}
        {insights.expenses?.insights.slice(0, 1).map(renderInsightCard)}
        
        <Text style={styles.sectionTitle}>Top Recommendations</Text>
        {insights.income?.recommendations.slice(0, 2).map(renderRecommendationCard)}
        {insights.expenses?.recommendations.slice(0, 1).map(renderRecommendationCard)}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('ActionPlan')}
        >
          <Text style={styles.viewAllButtonText}>View Full Action Plan</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderIncomeTab = () => {
    if (isLoading || !insights.income) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your income data...</Text>
        </View>
      );
    }

    const { summary, insights: incomeInsights, recommendations } = insights.income;

    return (
      <View style={styles.tabContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.totalIncome)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Avg</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.averageMonthly)}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Growth</Text>
              <Text style={[
                styles.summaryValue, 
                summary.monthlyGrowth >= 0 ? styles.positiveValue : styles.negativeValue
              ]}>
                {summary.monthlyGrowth >= 0 ? '+' : ''}{summary.monthlyGrowth.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Best Month</Text>
              <Text style={styles.summaryValue}>{summary.highestMonth.month}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Income Insights</Text>
        {incomeInsights.map(renderInsightCard)}
        
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map(renderRecommendationCard)}
      </View>
    );
  };

  const renderExpensesTab = () => {
    if (isLoading || !insights.expenses) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your expense data...</Text>
        </View>
      );
    }

    const { summary, insights: expenseInsights, recommendations } = insights.expenses;

    return (
      <View style={styles.tabContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.totalExpenses)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Largest Category</Text>
              <Text style={styles.summaryValue}>{summary.largestCategory}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Potential Savings</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.potentialSavings)}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Expense Insights</Text>
        {expenseInsights.map(renderInsightCard)}
        
        <Text style={styles.sectionTitle}>Savings Opportunities</Text>
        {recommendations.map(renderRecommendationCard)}
      </View>
    );
  };

  const renderActionPlanTab = () => {
    if (isLoading || !insights.actionPlan) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Generating your action plan...</Text>
        </View>
      );
    }

    const { shortTerm, mediumTerm, longTerm } = insights.actionPlan;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Short-Term Actions (Next 30 Days)</Text>
        {shortTerm.map((action, index) => renderActionItem(action, index, 'shortTerm'))}
        
        <Text style={styles.sectionTitle}>Medium-Term Actions (1-6 Months)</Text>
        {mediumTerm.map((action, index) => renderActionItem(action, index, 'mediumTerm'))}
        
        <Text style={styles.sectionTitle}>Long-Term Actions (6+ Months)</Text>
        {longTerm.map((action, index) => renderActionItem(action, index, 'longTerm'))}
        
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={18} color={colors.white} />
          <Text style={styles.exportButtonText}>Export Action Plan</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Financial Insights</Text>
      </View>
      
      <View style={styles.tabBar}>
        {renderTabButton('overview', 'Overview', 'grid-outline')}
        {renderTabButton('income', 'Income', 'trending-up-outline')}
        {renderTabButton('expenses', 'Expenses', 'cash-outline')}
        {renderTabButton('actionPlan', 'Action Plan', 'list-outline')}
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'income' && renderIncomeTab()}
        {activeTab === 'expenses' && renderExpensesTab()}
        {activeTab === 'actionPlan' && renderActionPlanTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  activeTabButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  insightTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  trendTag: {
    backgroundColor: colors.primary,
  },
  diversificationTag: {
    backgroundColor: colors.secondary,
  },
  clientTag: {
    backgroundColor: colors.accent,
  },
  seasonalTag: {
    backgroundColor: colors.warning,
  },
  insightTypeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  recommendationContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  highPriorityTag: {
    backgroundColor: colors.error,
  },
  mediumPriorityTag: {
    backgroundColor: colors.warning,
  },
  lowPriorityTag: {
    backgroundColor: colors.success,
  },
  priorityTagText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  savingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
  },
  savingsLabel: {
    fontSize: 14,
    color: colors.text,
  },
  savingsAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  positiveValue: {
    color: colors.success,
  },
  negativeValue: {
    color: colors.error,
  },
  healthScoreContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.white,
  },
  categoryScores: {
    flex: 1,
  },
  categoryScoreItem: {
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
  },
  categoryScoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  scoreBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCheckbox: {
    marginRight: 15,
    paddingTop: 2,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  actionMeta: {
    flexDirection: 'row',
  },
  actionTimeframe: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionImpact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionMetaText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 5,
  },
  exportButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  exportButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 