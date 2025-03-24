import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatCurrency } from '../../utils/formatters';

export default function ClientManagementScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new/edit client
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  useEffect(() => {
    loadClients();
  }, []);
  
  const loadClients = async () => {
    setIsLoading(true);
    // In a real app, you would fetch clients from your backend
    // For now, we'll use mock data
    setTimeout(() => {
      setClients([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '(555) 123-4567',
          company: 'ABC Company',
          totalRevenue: 7500,
          activeProjects: 2,
          lastInvoice: '2023-11-15',
          notes: 'Prefers communication via email. Pays invoices promptly.'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '(555) 987-6543',
          company: 'XYZ Corp',
          totalRevenue: 12000,
          activeProjects: 1,
          lastInvoice: '2023-10-30',
          notes: 'Long-term client. Interested in website redesign next quarter.'
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael.b@example.com',
          phone: '(555) 456-7890',
          company: 'Brown Consulting',
          totalRevenue: 3500,
          activeProjects: 0,
          lastInvoice: '2023-09-22',
          notes: 'New client. Referred by Sarah Johnson.'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleAddClient = () => {
    setIsEditing(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientCompany('');
    setClientNotes('');
    setModalVisible(true);
  };
  
  const handleEditClient = (client) => {
    setIsEditing(true);
    setSelectedClient(client);
    setClientName(client.name);
    setClientEmail(client.email);
    setClientPhone(client.phone);
    setClientCompany(client.company);
    setClientNotes(client.notes);
    setModalVisible(true);
  };
  
  const handleDeleteClient = (clientId) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you would delete from your backend
            setClients(clients.filter(client => client.id !== clientId));
          }
        }
      ]
    );
  };
  
  const handleSaveClient = () => {
    if (!clientName.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return;
    }
    
    if (!clientEmail.trim()) {
      Alert.alert('Error', 'Please enter a client email');
      return;
    }
    
    if (isEditing && selectedClient) {
      // Update existing client
      const updatedClients = clients.map(client => {
        if (client.id === selectedClient.id) {
          return {
            ...client,
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            company: clientCompany,
            notes: clientNotes
          };
        }
        return client;
      });
      
      setClients(updatedClients);
      Alert.alert('Success', 'Client updated successfully');
    } else {
      // Add new client
      const newClient = {
        id: Date.now().toString(),
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        company: clientCompany,
        totalRevenue: 0,
        activeProjects: 0,
        lastInvoice: null,
        notes: clientNotes
      };
      
      setClients([newClient, ...clients]);
      Alert.alert('Success', 'Client added successfully');
    }
    
    setModalVisible(false);
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderClientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => navigation.navigate('ClientDetail', { client: item })}
    >
      <View style={styles.clientHeader}>
        <View style={styles.clientInitials}>
          <Text style={styles.initialsText}>
            {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientCompany}>{item.company}</Text>
        </View>
        <View style={styles.clientActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditClient(item)}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteClient(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.clientStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>{formatCurrency(item.totalRevenue)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Active Projects</Text>
          <Text style={styles.statValue}>{item.activeProjects}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Invoice</Text>
          <Text style={styles.statValue}>
            {item.lastInvoice ? new Date(item.lastInvoice).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Client Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddClient}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
      
      {filteredClients.length > 0 ? (
        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.clientList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people" size={60} color={colors.textLight} />
          <Text style={styles.emptyStateTitle}>
            {searchQuery.length > 0 ? 'No matching clients' : 'No clients yet'}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery.length > 0 
              ? 'Try a different search term'
              : 'Add your first client to get started'
            }
          </Text>
          {searchQuery.length === 0 && (
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleAddClient}
            >
              <Text style={styles.emptyStateButtonText}>Add Client</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Client' : 'Add New Client'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder="Enter client name"
                  placeholderTextColor={colors.textLight}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={clientEmail}
                  onChangeText={setClientEmail}
                  placeholder="Enter client email"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={clientPhone}
                  onChangeText={setClientPhone}
                  placeholder="Enter client phone"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={clientCompany}
                  onChangeText={setClientCompany}
                  placeholder="Enter company name"
                  placeholderTextColor={colors.textLight}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={clientNotes}
                  onChangeText={setClientNotes}
                  placeholder="Enter any notes about this client"
                  placeholderTextColor={colors.textLight}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveClient}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update Client' : 'Add Client'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 5,
  },
  clientList: {
    padding: 15,
    paddingTop: 0,
  },
  clientCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clientInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  clientCompany: {
    fontSize: 14,
    color: colors.textLight,
  },
  clientActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  clientStats: {
    flexDirection: 'row',
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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
    maxHeight: '90%',
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
  modalBody: {
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
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 