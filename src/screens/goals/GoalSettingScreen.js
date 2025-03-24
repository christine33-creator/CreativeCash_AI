import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatCurrency } from '../../utils/formatters';

export default function GoalSettingScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  // New goal form state
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalCategory, setGoalCategory] = useState('income');
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    setIsLoading(true);
    // In a real app, you would fetch goals from your backend
    // For now, we'll use mock data
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          name: 'Monthly Income Target',
          currentAmount: 4500,
          targetAmount: 6000,
          deadline: '2023-12-31',
          category: 'income',
          progress: 75,
          createdAt: '2023-10-01'
        },
        {
          id: '2',
          name: 'Emergency Fund',
          currentAmount: 3000,
          targetAmount: 10000,
          deadline: '2024-06-30',
          category: 'savings',
          progress: 30,
          createdAt: '2023-09-15'
        },
        {
          id: '3',
          name: 'New Equipment Purchase',
          currentAmount: 1200,
          targetAmount: 2500,
          deadline: '2024-03-15',
          category: 'expense',
          progress: 48,
          createdAt: '2023-10-20'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalName('');
    setGoalAmount('');
    setGoalDeadline('');
    setGoalCategory('income');
    setModalVisible(true);
  };
  
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalAmount(goal.targetAmount.toString());
    setGoalDeadline(goal.deadline);
    setGoalCategory(goal.category);
    setModalVisible(true);
  };
  
  const handleDeleteGoal = (goalId) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you would delete from your backend
            setGoals(goals.filter(goal => goal.id !== goalId));
          }
        }
      ]
    );
  };
  
  const handleSaveGoal = () => {
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }
    
    if (!goalAmount || isNaN(parseFloat(goalAmount)) || parseFloat(goalAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid goal amount');
      return;
    }
    
    if (!goalDeadline.trim()) {
      Alert.alert('Error', 'Please enter a deadline');
      return;
    }
    
    const newGoal = {
      id: editingGoal ? editingGoal.id : Date.now().toString(),
      name: goalName,
      currentAmount: editingGoal ? editingGoal.currentAmount : 0,
      targetAmount: parseFloat(goalAmount),
      deadline: goalDeadline,
      category: goalCategory,
      progress: editingGoal ? (editingGoal.currentAmount / parseFloat(goalAmount) * 100) : 0,
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString().split('T')[0]
    };
    
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => goal.id === editingGoal.id ? newGoal : goal));
    } else {
      // Add new goal
      setGoals([newGoal, ...goals]);
    }
    
    setModalVisible(false);
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'income':
        return 'cash-outline';
      case 'savings':
        return 'save-outline';
      case 'expense':
        return 'cart-outline';
      default:
        return 'flag-outline';
    }
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'income':
        return colors.success;
      case 'savings':
        return colors.primary;
      case 'expense':
        return colors.warning;
      default:
        return colors.text;
    }
  };
  
  const renderGoalItem = (goal) => {
    const progressColor = goal.progress < 30 ? colors.error : 
                          goal.progress < 70 ? colors.warning : 
                          colors.success;
    
    return (
      <View style={styles.goalCard} key={goal.id}>
        <View style={styles.goalHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(goal.category) }]}>
            <Ionicons name={getCategoryIcon(goal.category)} size={16} color={colors.white} />
          </View>
          <Text style={styles.goalName}>{goal.name}</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => {
              Alert.alert(
                'Goal Options',
                'What would you like to do?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Edit', onPress: () => handleEditGoal(goal) },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteGoal(goal.id) }
                ]
              );
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.goalAmounts}>
          <Text style={styles.currentAmount}>{formatCurrency(goal.currentAmount)}</Text>
          <Text style={styles.targetAmount}>of {formatCurrency(goal.targetAmount)}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${goal.progress}%`, backgroundColor: progressColor }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.deadlineText}>Deadline: {goal.deadline}</Text>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => {
              // In a real app, you would navigate to a screen to update progress
              Alert.alert('Update Progress', 'This would allow you to update your progress');
            }}
          >
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading goals...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Goals</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddGoal}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.white} />
            <Text style={styles.addButtonText}>Add New Goal</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.goalsContainer}>
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={50} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No goals yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Set financial goals to track your progress and stay motivated
              </Text>
            </View>
          ) : (
            goals.map(renderGoalItem)
          )}
        </View>
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Goal Name</Text>
                <TextInput
                  style={styles.input}
                  value={goalName}
                  onChangeText={setGoalName}
                  placeholder="e.g., Monthly Income Target"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Target Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={goalAmount}
                    onChangeText={setGoalAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Deadline</Text>
                <TextInput
                  style={styles.input}
                  value={goalDeadline}
                  onChangeText={setGoalDeadline}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.categoryButton,
                      goalCategory === 'income' && styles.activeCategoryButton,
                      { borderColor: colors.success }
                    ]}
                    onPress={() => setGoalCategory('income')}
                  >
                    <Ionicons 
                      name="cash-outline" 
                      size={20} 
                      color={goalCategory === 'income' ? colors.white : colors.success} 
                    />
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        goalCategory === 'income' && styles.activeCategoryButtonText,
                        { color: goalCategory === 'income' ? colors.white : colors.success }
                      ]}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.categoryButton,
                      goalCategory === 'savings' && styles.activeCategoryButton,
                      { borderColor: colors.primary }
                    ]}
                    onPress={() => setGoalCategory('savings')}
                  >
                    <Ionicons 
                      name="save-outline" 
                      size={20} 
                      color={goalCategory === 'savings' ? colors.white : colors.primary} 
                    />
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        goalCategory === 'savings' && styles.activeCategoryButtonText,
                        { color: goalCategory === 'savings' ? colors.white : colors.primary }
                      ]}
                    >
                      Savings
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.categoryButton,
                      goalCategory === 'expense' && styles.activeCategoryButton,
                      { borderColor: colors.warning }
                    ]}
                    onPress={() => setGoalCategory('expense')}
                  >
                    <Ionicons 
                      name="cart-outline" 
                      size={20} 
                      color={goalCategory === 'expense' ? colors.white : colors.warning} 
                    />
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        goalCategory === 'expense' && styles.activeCategoryButtonText,
                        { color: goalCategory === 'expense' ? colors.white : colors.warning }
                      ]}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveGoal}
              >
                <Text style={styles.saveButtonText}>
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
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
  content: {
    flex: 1,
  },
  addButtonContainer: {
    padding: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  goalsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  menuButton: {
    padding: 5,
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  targetAmount: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    width: 40,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 14,
    color: colors.textLight,
  },
  updateButton: {
    backgroundColor: colors.background,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  updateButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 5,
  },
  modalForm: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    fontSize: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: 16,
    color: colors.text,
    paddingLeft: 10,
  },
  amountInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  activeCategoryButtonText: {
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 