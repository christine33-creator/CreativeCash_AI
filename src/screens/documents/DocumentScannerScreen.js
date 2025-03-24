import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatDate } from '../../utils/formatters';

export default function DocumentScannerScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDocuments, setScannedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    // Load previously scanned documents
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    // In a real app, you would fetch documents from storage
    // For now, we'll use mock data
    setTimeout(() => {
      setScannedDocuments([
        {
          id: '1',
          type: 'receipt',
          title: 'Office Supplies',
          date: '2023-11-10',
          amount: 124.99,
          vendor: 'Office Depot',
          category: 'Supplies',
          imageUri: 'https://example.com/receipt1.jpg',
          processed: true,
          taxDeductible: true
        },
        {
          id: '2',
          type: 'receipt',
          title: 'Software Subscription',
          date: '2023-10-25',
          amount: 49.99,
          vendor: 'Adobe',
          category: 'Software',
          imageUri: 'https://example.com/receipt2.jpg',
          processed: true,
          taxDeductible: true
        },
        {
          id: '3',
          type: 'invoice',
          title: 'Client Invoice #1045',
          date: '2023-11-05',
          amount: 1500.00,
          client: 'ABC Company',
          status: 'paid',
          imageUri: 'https://example.com/invoice1.jpg',
          processed: true
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleScanDocument = () => {
    setIsScanning(true);
    // In a real app, you would use a camera library to scan documents
    // For now, we'll simulate scanning
    setTimeout(() => {
      Alert.alert(
        'Document Scanned',
        'Your document has been scanned successfully. Would you like to process it now?',
        [
          {
            text: 'Later',
            style: 'cancel',
            onPress: () => {
              // Add unprocessed document to list
              const newDocument = {
                id: Date.now().toString(),
                type: 'receipt',
                title: 'New Receipt',
                date: new Date().toISOString().split('T')[0],
                imageUri: 'https://example.com/new_receipt.jpg',
                processed: false
              };
              setScannedDocuments([newDocument, ...scannedDocuments]);
              setIsScanning(false);
            }
          },
          {
            text: 'Process Now',
            onPress: () => {
              setIsScanning(false);
              navigation.navigate('ProcessDocument', { isNew: true });
            }
          }
        ]
      );
    }, 2000);
  };

  const handleDocumentPress = (document) => {
    setSelectedDocument(document);
    if (document.processed) {
      navigation.navigate('DocumentDetails', { document });
    } else {
      navigation.navigate('ProcessDocument', { document });
    }
  };

  const renderDocumentItem = (document) => {
    const isReceipt = document.type === 'receipt';
    
    return (
      <TouchableOpacity 
        key={document.id}
        style={styles.documentItem}
        onPress={() => handleDocumentPress(document)}
      >
        <View style={styles.documentIconContainer}>
          <Ionicons 
            name={isReceipt ? 'receipt-outline' : 'document-text-outline'} 
            size={24} 
            color={colors.white} 
          />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{document.title}</Text>
          <Text style={styles.documentDate}>
            {formatDate(document.date)}
          </Text>
          {document.amount && (
            <Text style={styles.documentAmount}>
              ${document.amount.toFixed(2)}
            </Text>
          )}
          {!document.processed && (
            <View style={styles.unprocessedBadge}>
              <Text style={styles.unprocessedText}>Unprocessed</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading documents...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Scanner</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleScanDocument}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="camera-outline" size={28} color={colors.white} />
            )}
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Document'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          {scannedDocuments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={50} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No documents yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Scan receipts and invoices to keep track of your expenses and income
              </Text>
            </View>
          ) : (
            scannedDocuments.map(renderDocumentItem)
          )}
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
  scanButtonContainer: {
    padding: 20,
  },
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  documentsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  documentDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  documentAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 5,
  },
  unprocessedBadge: {
    backgroundColor: colors.warning,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  unprocessedText: {
    fontSize: 12,
    color: colors.white,
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
}); 