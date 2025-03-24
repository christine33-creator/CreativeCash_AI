import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/colors';

export default function InvoiceGeneratorScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [issueDate, setIssueDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 14 days from now
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [items, setItems] = useState([{ description: '', quantity: '1', rate: '', amount: 0 }]);
  const [notes, setNotes] = useState('');
  const [includePaymentInstructions, setIncludePaymentInstructions] = useState(true);
  const [includeTaxId, setIncludeTaxId] = useState(false);
  
  const calculateItemAmount = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return quantity * rate;
  };
  
  const updateItemAmount = (index) => {
    const updatedItems = [...items];
    updatedItems[index].amount = calculateItemAmount(updatedItems[index]);
    setItems(updatedItems);
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems, () => {
      if (field === 'quantity' || field === 'rate') {
        updateItemAmount(index);
      }
    });
  };
  
  const addItem = () => {
    setItems([...items, { description: '', quantity: '1', rate: '', amount: 0 }]);
  };
  
  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };
  
  const handleIssueDateChange = (event, selectedDate) => {
    setShowIssueDatePicker(false);
    if (selectedDate) {
      setIssueDate(selectedDate);
    }
  };
  
  const handleDueDateChange = (event, selectedDate) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const validateForm = () => {
    if (!clientName.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return false;
    }
    
    if (!clientEmail.trim()) {
      Alert.alert('Error', 'Please enter a client email');
      return false;
    }
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.description.trim()) {
        Alert.alert('Error', `Please enter a description for item ${i + 1}`);
        return false;
      }
      
      if (!item.rate || isNaN(parseFloat(item.rate))) {
        Alert.alert('Error', `Please enter a valid rate for item ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleGenerateInvoice = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // In a real app, you would generate and save the invoice
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Invoice Generated',
        'Your invoice has been generated successfully. Would you like to send it now?',
        [
          {
            text: 'Later',
            style: 'cancel',
            onPress: () => navigation.goBack()
          },
          {
            text: 'Send Now',
            onPress: () => {
              Alert.alert('Invoice Sent', 'Your invoice has been sent to the client.');
              navigation.goBack();
            }
          }
        ]
      );
    }, 2000);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate Invoice</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Invoice Number</Text>
            <TextInput
              style={styles.input}
              value={invoiceNumber}
              onChangeText={setInvoiceNumber}
              placeholder="INV-001"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Issue Date</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowIssueDatePicker(true)}
            >
              <Text>{formatDate(issueDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textLight} />
            </TouchableOpacity>
            {showIssueDatePicker && (
              <DateTimePicker
                value={issueDate}
                mode="date"
                display="default"
                onChange={handleIssueDateChange}
              />
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDueDatePicker(true)}
            >
              <Text>{formatDate(dueDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textLight} />
            </TouchableOpacity>
            {showDueDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDueDateChange}
              />
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Name</Text>
            <TextInput
              style={styles.input}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Enter client name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Email</Text>
            <TextInput
              style={styles.input}
              value={clientEmail}
              onChangeText={setClientEmail}
              placeholder="Enter client email"
              keyboardType="email-address"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          
          {items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Item {index + 1}</Text>
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={item.description}
                  onChangeText={(value) => handleItemChange(index, 'description', value)}
                  placeholder="Enter item description"
                />
              </View>
              
              <View style={styles.rowInputs}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={item.quantity}
                    onChangeText={(value) => handleItemChange(index, 'quantity', value)}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Rate ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={item.rate}
                    onChangeText={(value) => handleItemChange(index, 'rate', value)}
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>
                    ${calculateItemAmount(item).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addItemText}>Add Another Item</Text>
          </TouchableOpacity>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter any additional notes for the client"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Include Payment Instructions</Text>
            <Switch
              value={includePaymentInstructions}
              onValueChange={setIncludePaymentInstructions}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Include Tax ID</Text>
            <Switch
              value={includeTaxId}
              onValueChange={setIncludeTaxId}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGenerateInvoice}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color={colors.white} />
              <Text style={styles.generateButtonText}>Generate Invoice</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    fontSize: 16,
  },
  dateInput: {
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  amountContainer: {
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    borderStyle: 'dashed',
  },
  addItemText: {
    color: colors.primary,
    marginLeft: 5,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.text,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 