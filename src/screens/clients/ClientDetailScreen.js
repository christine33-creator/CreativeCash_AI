import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ClientDetailScreen({ route, navigation }) {
  const { client } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    loadClientData();
  }, []);
  
  const loadClientData = async () => {
    setIsLoading(true);
    // In a real app, you would fetch detailed client data from your backend
    // For now, we'll use the passed client data and add mock invoices and projects
    setTimeout(() => {
      setClientData(client);
      
      // Mock invoices
      setInvoices([
        {
          id: '1',
          number: 'INV-001',
          date: '2023-11-15',
          dueDate: '2023-11-30',
          amount: 2500,
          status: 'paid',
          description: 'Website redesign - Phase 1'
        },
        {
          id: '2',
          number: 'INV-002',
          date: '2023-10-20',
          dueDate: '2023-11-05',
          amount: 1800,
          status: 'paid',
          description: 'Logo design and branding'
        },
        {
          id: '3',
          number: 'INV-003',
          date: '2023-12-01',
          dueDate: '2023-12-15',
          amount: 3200,
          status: 'pending',
          description: 'Website redesign - Phase 2'
        }
      ]);
      
      // Mock projects
      setProjects([
        {
          id: '1',
          name: 'Website Redesign',
          startDate: '2023-10-15',
          endDate: '2023-12-31',
          status: 'in-progress',
          budget: 5000,
          description: 'Complete website redesign including responsive design and CMS integration'
        },
        {
          id: '2',
          name: 'Brand Identity',
          startDate: '2023-09-01',
          endDate: '2023-10-15',
          status: 'completed',
          budget: 2500,
          description: 'Logo design, color palette, typography, and brand guidelines'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleContactClient = (method) => {
    if (method === 'email' && clientData.email) {
      Linking.openURL(`mailto:${clientData.email}`);
    } else if (method === 'phone' && clientData.phone) {
      Linking.openURL(`tel:${clientData.phone}`);
    }
  };
  
  const handleCreateInvoice = () => {
    navigation.navigate('InvoiceGenerator', { client: clientData });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.error;
      case 'in-progress':
        return colors.primary;
      case 'completed':
        return colors.success;
      default:
        return colors.textLight;
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading client details...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.clientInitials}>
          <Text style={styles.initialsText}>
            {clientData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.headerTitle}>{clientData.name}</Text>
        <Text style={styles.headerSubtitle}>{clientData.company}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>{clientData.email}</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactClient('email')}
            >
              <Ionicons name="send-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {clientData.phone && (
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{clientData.phone}</Text>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactClient('phone')}
              >
                <Ionicons name="call" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Invoices</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreateInvoice}
            >
              <Ionicons name="add" size={20} color={colors.white} />
              <Text style={styles.addButtonText}>New Invoice</Text>
            </TouchableOpacity>
          </View>
          
          {invoices.length > 0 ? (
            invoices.map(invoice => (
              <TouchableOpacity
                key={invoice.id}
                style={styles.invoiceItem}
                onPress={() => navigation.navigate('InvoiceDetail', { invoice })}
              >
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                  <Text style={styles.invoiceDescription}>{invoice.description}</Text>
                  <Text style={styles.invoiceDate}>
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(invoice.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No invoices yet</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          
          {projects.length > 0 ? (
            projects.map(project => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectItem}
                onPress={() => navigation.navigate('ProjectDetail', { project })}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(project.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {project.status === 'in-progress' ? 'In Progress' : 
                        project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.projectMeta}>
                  <Text style={styles.projectDates}>
                    {new Date(project.startDate).toLocaleDateString()} - 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                  </Text>
                  <Text style={styles.projectBudget}>Budget: {formatCurrency(project.budget)}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No projects yet</Text>
          )}
        </View>
        
        {clientData.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{clientData.notes}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={styles.summaryValue}>{formatCurrency(clientData.totalRevenue || 0)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Active Projects</Text>
            <Text style={styles.summaryValue}>{clientData.activeProjects || 0}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Last Invoice</Text>
            <Text style={styles.summaryValue}>
              {clientData.lastInvoice ? new Date(clientData.lastInvoice).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('ClientManagement', { 
              screen: 'EditClient', 
              params: { client: clientData } 
            })}
          >
            <Ionicons name="create-outline" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Edit Client</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
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
                      navigation.goBack();
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Delete Client</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  clientInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  initialsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    marginBottom: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    marginRight: 15,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  contactButton: {
    padding: 8,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  invoiceDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  invoiceDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  projectItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  projectDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectDates: {
    fontSize: 14,
    color: colors.textLight,
  },
  projectBudget: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 15,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 5,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 