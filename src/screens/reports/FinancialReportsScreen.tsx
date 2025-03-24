import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ButtonGroup, Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../hooks/useAuth';
import { incomeService } from '../../services/income.service';
import { exportService } from '../../services/export.service';
import { INCOME_SOURCES, TAX_CATEGORIES } from '../../types/income.types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FinancialReportsScreen = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState(0); // 0: Income Summary, 1: Tax Report, 2: Custom
  const [reportFormat, setReportFormat] = useState(0); // 0: CSV, 1: JSON
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    endDate: new Date(),
    incomeSource: '',
    taxCategory: ''
  });

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      setReportData(null);
      
      // Get filtered income data
      const incomes = await incomeService.getIncomes(user.id, filters);
      
      if (incomes.length === 0) {
        Alert.alert('No Data', 'There is no income data for the selected filters.');
        return;
      }
      
      // Process data based on report type
      let processedData;
      
      if (reportType === 0) { // Income Summary
        processedData = processIncomeSummary(incomes);
      } else if (reportType === 1) { // Tax Report
        processedData = processTaxReport(incomes);
      } else { // Custom
        processedData = incomes;
      }
      
      setReportData(processedData);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!reportData) {
      Alert.alert('No Data', 'Please generate a report first.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (reportFormat === 0) { // CSV
        await exportService.exportIncomeToCSV(reportData);
      } else { // JSON
        await exportService.exportIncomeToJSON(reportData);
      }
      
      Alert.alert('Success', 'Report exported successfully.');
    } catch (error) {
      console.error('Error exporting report:', error);
      Alert.alert('Error', 'Failed to export report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processIncomeSummary = (incomes) => {
    // Group by month
    const byMonth = {};
    
    incomes.forEach(income => {
      const date = new Date(income.transactionDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!byMonth[monthYear]) {
        byMonth[monthYear] = {
          month: monthYear,
          total: 0,
          count: 0
        };
      }
      
      byMonth[monthYear].total += income.amount;
      byMonth[monthYear].count += 1;
    });
    
    // Convert to array and sort by date
    return Object.values(byMonth).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      
      if (aYear !== bYear) {
        return aYear - bYear;
      }
      
      return aMonth - bMonth;
    });
  };

  const processTaxReport = (incomes) => {
    // Group by tax category
    const byTaxCategory = {};
    
    incomes.forEach(income => {
      if (!byTaxCategory[income.taxCategory]) {
        byTaxCategory[income.taxCategory] = {
          category: income.taxCategory,
          total: 0,
          count: 0
        };
      }
      
      byTaxCategory[income.taxCategory].total += income.amount;
      byTaxCategory[income.taxCategory].count += 1;
    });
    
    return Object.values(byTaxCategory);
  };

  const renderReportTypeSelector = () => {
    const buttons = ['Income Summary', 'Tax Report', 'Custom'];
    return (
      <ButtonGroup
        onPress={setReportType}
        selectedIndex={reportType}
        buttons={buttons}
        containerStyle={styles.buttonGroup}
      />
    );
  };

  const renderReportFormatSelector = () => {
    const buttons = ['CSV', 'JSON'];
    return (
      <ButtonGroup
        onPress={setReportFormat}
        selectedIndex={reportFormat}
        buttons={buttons}
        containerStyle={styles.buttonGroup}
      />
    );
  };

  const renderFilters = () => {
    return (
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Date Range</Text>
        <View style={styles.dateContainer}>
          <Button
            title={formatDate(filters.startDate)}
            onPress={() => setShowStartDate(true)}
            type="outline"
            containerStyle={styles.dateButton}
          />
          <Text>to</Text>
          <Button
            title={formatDate(filters.endDate)}
            onPress={() => setShowEndDate(true)}
            type="outline"
            containerStyle={styles.dateButton}
          />
        </View>
        
        {showStartDate && (
          <DateTimePicker
            value={filters.startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDate(false);
              if (date) setFilters({ ...filters, startDate: date });
            }}
          />
        )}
        
        {showEndDate && (
          <DateTimePicker
            value={filters.endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDate(false);
              if (date) setFilters({ ...filters, endDate: date });
            }}
          />
        )}
        
        {reportType === 2 && ( // Only show additional filters for Custom report
          <>
            <Text style={styles.filterLabel}>Income Source</Text>
            <Picker
              selectedValue={filters.incomeSource}
              onValueChange={(value) => setFilters({ ...filters, incomeSource: value })}
              style={styles.picker}
            >
              <Picker.Item label="All Sources" value="" />
              {INCOME_SOURCES.map((source) => (
                <Picker.Item key={source} label={source} value={source} />
              ))}
            </Picker>
            
            <Text style={styles.filterLabel}>Tax Category</Text>
            <Picker
              selectedValue={filters.taxCategory}
              onValueChange={(value) => setFilters({ ...filters, taxCategory: value })}
              style={styles.picker}
            >
              <Picker.Item label="All Categories" value="" />
              {TAX_CATEGORIES.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </>
        )}
      </View>
    );
  };

  const renderReportPreview = () => {
    if (!reportData) {
      return (
        <Text style={styles.noDataText}>
          Generate a report to see a preview here.
        </Text>
      );
    }
    
    if (reportType === 0) { // Income Summary
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Income Summary</Text>
          <Text style={styles.previewSubtitle}>
            {formatDate(filters.startDate)} - {formatDate(filters.endDate)}
          </Text>
          
          {reportData.map((item, index) => (
            <View key={index} style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>{item.month}</Text>
              <Text style={styles.previewItemValue}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
          
          <View style={styles.previewTotal}>
            <Text style={styles.previewTotalLabel}>Total</Text>
            <Text style={styles.previewTotalValue}>
              {formatCurrency(
                reportData.reduce((sum, item) => sum + item.total, 0)
              )}
            </Text>
          </View>
        </View>
      );
    } else if (reportType === 1) { // Tax Report
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Tax Report</Text>
          <Text style={styles.previewSubtitle}>
            {formatDate(filters.startDate)} - {formatDate(filters.endDate)}
          </Text>
          
          {reportData.map((item, index) => (
            <View key={index} style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>{item.category}</Text>
              <Text style={styles.previewItemValue}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
          
          <View style={styles.previewTotal}>
            <Text style={styles.previewTotalLabel}>Total Taxable Income</Text>
            <Text style={styles.previewTotalValue}>
              {formatCurrency(
                reportData.reduce((sum, item) => sum + item.total, 0)
              )}
            </Text>
          </View>
        </View>
      );
    } else { // Custom
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Custom Report</Text>
          <Text style={styles.previewSubtitle}>
            {formatDate(filters.startDate)} - {formatDate(filters.endDate)}
          </Text>
          
          <Text style={styles.previewInfo}>
            {reportData.length} transactions found
          </Text>
          
          <Text style={styles.previewTotal}>
            Total: {formatCurrency(
              reportData.reduce((sum, income) => sum + income.amount, 0)
            )}
          </Text>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>Financial Reports</Text>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Report Type</Card.Title>
        {renderReportTypeSelector()}
      </Card>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Report Filters</Card.Title>
        {renderFilters()}
      </Card>
      
      <Card containerStyle={styles.card}>
        <Card.Title>Export Format</Card.Title>
        {renderReportFormatSelector()}
      </Card>
      
      <View style={styles.actionButtons}>
        <Button
          title="Generate Report"
          onPress={handleGenerateReport}
          loading={isLoading}
          containerStyle={styles.actionButton}
        />
        <Button
          title="Export Report"
          onPress={handleExportReport}
          disabled={!reportData || isLoading}
          containerStyle={styles.actionButton}
        />
      </View>
      
      <Card containerStyle={styles.previewCard}>
        <Card.Title>Report Preview</Card.Title>
        {renderReportPreview()}
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
  buttonGroup: {
    marginBottom: 10,
    borderRadius: 5,
  },
  filtersContainer: {
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 16,
    color: '#86939e',
    marginBottom: 5,
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  previewCard: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  previewContainer: {
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  previewItemLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 5,
    borderTopWidth: 2,
    borderTopColor: '#eee',
  },
  previewTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  previewInfo: {
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default FinancialReportsScreen; 