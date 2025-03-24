import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FAB, SearchBar } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { incomeService } from '../../services/income.service';
import { Income, IncomeFilters } from '../../types/income.types';
import { IncomeListItem } from '../../components/income/IncomeListItem';
import { IncomeFiltersComponent } from '../../components/income/IncomeFilters';
import { IncomeStats } from '../../components/income/IncomeStats';

export const IncomeListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IncomeFilters>({});
  const [stats, setStats] = useState({
    totalIncome: 0,
    bySource: {},
    byTaxCategory: {}
  });

  const loadIncomes = async () => {
    try {
      setIsLoading(true);
      const data = await incomeService.getIncomes(user!.id, filters);
      setIncomes(data);
      applySearchFilter(data, searchQuery);

      // Load statistics
      const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1);
      const endDate = filters.endDate || new Date();
      const statistics = await incomeService.getIncomeStats(user!.id, startDate, endDate);
      setStats(statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, [filters]);

  const applySearchFilter = (data: Income[], query: string) => {
    if (!query) {
      setFilteredIncomes(data);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = data.filter(income => 
      income.projectName.toLowerCase().includes(searchTerm) ||
      income.notes?.toLowerCase().includes(searchTerm)
    );
    setFilteredIncomes(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearchFilter(incomes, query);
  };

  const handleFilterChange = (newFilters: IncomeFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleIncomePress = (income: Income) => {
    navigation.navigate('EditIncome', { income });
  };

  if (isLoading && !incomes.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search incomes..."
        onChangeText={handleSearch}
        value={searchQuery}
        platform="ios"
        containerStyle={styles.searchBar}
      />

      <IncomeFiltersComponent
        filters={filters}
        onFiltersChange={handleFilterChange}
        onReset={resetFilters}
      />

      <IncomeStats
        totalIncome={stats.totalIncome}
        bySource={stats.bySource}
        byTaxCategory={stats.byTaxCategory}
        periodLabel={filters.startDate ? 'Filtered Period' : 'Year to Date'}
      />

      <FlatList
        data={filteredIncomes}
        renderItem={({ item }) => (
          <IncomeListItem
            income={item}
            onPress={handleIncomePress}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={loadIncomes}
      />

      <FAB
        icon={{ name: 'add', color: 'white' }}
        placement="right"
        color="#2ecc71"
        onPress={() => navigation.navigate('AddIncome')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    paddingBottom: 80,
  },
});

export default IncomeListScreen; 