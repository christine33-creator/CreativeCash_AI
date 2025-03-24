import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { INCOME_SOURCES, TAX_CATEGORIES, IncomeFilters } from '../../types/income.types';

interface IncomeFiltersProps {
  filters: IncomeFilters;
  onFiltersChange: (filters: IncomeFilters) => void;
  onReset: () => void;
}

export const IncomeFiltersComponent = ({ filters, onFiltersChange, onReset }: IncomeFiltersProps) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Button
          title="All"
          type={!filters.incomeSource ? "solid" : "outline"}
          onPress={() => onFiltersChange({ ...filters, incomeSource: undefined })}
          containerStyle={styles.filterButton}
        />
        {INCOME_SOURCES.map((source) => (
          <Button
            key={source}
            title={source}
            type={filters.incomeSource === source ? "solid" : "outline"}
            onPress={() => onFiltersChange({ ...filters, incomeSource: source })}
            containerStyle={styles.filterButton}
          />
        ))}
      </ScrollView>

      <View style={styles.dateContainer}>
        <Button
          title={filters.startDate ? new Date(filters.startDate).toLocaleDateString() : "Start Date"}
          onPress={() => setShowStartDate(true)}
          type="outline"
        />
        <Button
          title={filters.endDate ? new Date(filters.endDate).toLocaleDateString() : "End Date"}
          onPress={() => setShowEndDate(true)}
          type="outline"
        />
      </View>

      {showStartDate && (
        <DateTimePicker
          value={filters.startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDate(false);
            if (date) onFiltersChange({ ...filters, startDate: date });
          }}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={filters.endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDate(false);
            if (date) onFiltersChange({ ...filters, endDate: date });
          }}
        />
      )}

      <Button
        title="Reset Filters"
        type="clear"
        onPress={onReset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    marginHorizontal: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
}); 