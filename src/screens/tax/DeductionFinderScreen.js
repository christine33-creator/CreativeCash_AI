import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

// Sample deduction categories for freelancers
const DEDUCTION_CATEGORIES = [
  {
    id: '1',
    title: 'Home Office',
    icon: 'home-outline',
    description: 'Deduct expenses for the business use of your home',
    examples: [
      'Portion of rent or mortgage interest',
      'Utilities (proportional to office space)',
      'Home repairs for office area',
      'Home office furniture and equipment'
    ],
    requirements: [
      'Must be used regularly and exclusively for business',
      'Must be your principal place of business',
      'Can use simplified option ($5 per square foot, up to 300 sq ft)'
    ]
  },
  {
    id: '2',
    title: 'Business Travel',
    icon: 'airplane-outline',
    description: 'Deduct expenses for business trips away from your tax home',
    examples: [
      'Airfare, train tickets, and other transportation',
      'Hotel accommodations',
      'Meals (50% deductible)',
      'Rental cars and taxis',
      'Conference and event fees'
    ],
    requirements: [
      'Trip must be primarily for business',
      'Must be away from your tax home overnight',
      'Keep detailed records of all expenses',
      'Save receipts for expenses over $75'
    ]
  },
  {
    id: '3',
    title: 'Vehicle Expenses',
    icon: 'car-outline',
    description: 'Deduct expenses for business use of your vehicle',
    examples: [
      'Standard mileage rate (65.5 cents per mile for 2023)',
      'Actual expenses (gas, insurance, repairs, depreciation)',
      'Parking fees and tolls for business trips',
      'Vehicle registration fees (business portion)'
    ],
    requirements: [
      'Must track business vs. personal mileage',
      'Cannot deduct commuting miles',
      'Must choose standard mileage rate or actual expenses',
      'Keep detailed mileage log with dates, purpose, and miles'
    ]
  },
  {
    id: '4',
    title: 'Health Insurance',
    icon: 'medkit-outline',
    description: 'Self-employed health insurance deduction',
    examples: [
      'Health insurance premiums for you, spouse, and dependents',
      'Dental and vision insurance premiums',
      'Long-term care insurance premiums (with age-based limits)'
    ],
    requirements: [
      'Business must show a profit',
      'Cannot be eligible for employer-sponsored plan',
      'Deduction limited to business income'
    ]
  },
  {
    id: '5',
    title: 'Professional Services',
    icon: 'briefcase-outline',
    description: 'Deduct fees for professional services',
    examples: [
      'Accountant and bookkeeper fees',
      'Attorney fees for business matters',
      'Consultant fees',
      'Professional membership dues'
    ],
    requirements: [
      'Services must be business-related',
      'Keep invoices and proof of payment'
    ]
  },
  {
    id: '6',
    title: 'Business Insurance',
    icon: 'shield-outline',
    description: 'Deduct premiums for business insurance',
    examples: [
      'Professional liability insurance',
      'Business property insurance',
      'Business interruption insurance',
      'Cyber liability insurance'
    ],
    requirements: [
      'Insurance must be for business purposes',
      'Keep policy documents and premium statements'
    ]
  },
  {
    id: '7',
    title: 'Education & Training',
    icon: 'school-outline',
    description: 'Deduct costs for maintaining or improving skills',
    examples: [
      'Professional development courses',
      'Workshops and seminars',
      'Books, publications, and online courses',
      'Professional certifications'
    ],
    requirements: [
      'Must maintain or improve skills needed in current business',
      'Cannot be to qualify for a new profession',
      'Keep receipts and course descriptions'
    ]
  },
  {
    id: '8',
    title: 'Office Supplies & Equipment',
    icon: 'desktop-outline',
    description: 'Deduct costs for business supplies and equipment',
    examples: [
      'Computer hardware and software',
      'Office furniture',
      'Stationery and supplies',
      'Postage and shipping'
    ],
    requirements: [
      'Items under $2,500 can be expensed immediately',
      'Larger purchases may need to be depreciated',
      'Keep receipts and proof of business use'
    ]
  },
  {
    id: '9',
    title: 'Marketing & Advertising',
    icon: 'megaphone-outline',
    description: 'Deduct costs to promote your business',
    examples: [
      'Website development and hosting',
      'Business cards and brochures',
      'Online advertising',
      'Social media marketing',
      'Promotional materials'
    ],
    requirements: [
      'Must be ordinary and necessary for your business',
      'Keep detailed records of all marketing expenses'
    ]
  },
  {
    id: '10',
    title: 'Retirement Plans',
    icon: 'wallet-outline',
    description: 'Tax-advantaged retirement savings for self-employed',
    examples: [
      'SEP IRA (up to 25% of net earnings, max $66,000 for 2023)',
      'Solo 401(k) (up to $22,500 plus profit-sharing)',
      'SIMPLE IRA (up to $15,500 plus 3% match)'
    ],
    requirements: [
      'Different plans have different deadlines and requirements',
      'Consult with a financial advisor for best options',
      'Keep plan documents and contribution records'
    ]
  }
];

export default function DeductionFinderScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deductions, setDeductions] = useState([]);
  const [selectedDeduction, setSelectedDeduction] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setDeductions(DEDUCTION_CATEGORIES);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDeductions = searchQuery 
    ? deductions.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : deductions;

  const renderDeductionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.deductionCard}
      onPress={() => setSelectedDeduction(item)}
    >
      <View style={styles.deductionHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={24} color={colors.white} />
        </View>
        <Text style={styles.deductionTitle}>{item.title}</Text>
      </View>
      <Text style={styles.deductionDescription}>{item.description}</Text>
      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const renderDeductionDetails = () => {
    if (!selectedDeduction) return null;

    return (
      <View style={styles.detailsOverlay}>
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsIconContainer}>
              <Ionicons name={selectedDeduction.icon} size={28} color={colors.white} />
            </View>
            <Text style={styles.detailsTitle}>{selectedDeduction.title}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedDeduction(null)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.detailsContent}>
            <Text style={styles.detailsDescription}>{selectedDeduction.description}</Text>
            
            <Text style={styles.sectionTitle}>Examples</Text>
            {selectedDeduction.examples.map((example, index) => (
              <View key={index} style={styles.bulletItem}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{example}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Requirements</Text>
            {selectedDeduction.requirements.map((requirement, index) => (
              <View key={index} style={styles.bulletItem}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{requirement}</Text>
              </View>
            ))}
            
            <Text style={styles.disclaimer}>
              Note: Tax laws change frequently. Consult with a tax professional for advice specific to your situation.
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading deduction categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax Deduction Finder</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search deductions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <FlatList
        data={filteredDeductions}
        renderItem={renderDeductionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {renderDeductionDetails()}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    fontSize: 16,
    color: colors.text,
  },
  listContainer: {
    padding: 15,
    paddingTop: 0,
  },
  deductionCard: {
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
  deductionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deductionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  deductionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 10,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 5,
  },
  detailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: '100%',
    height: '80%',
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  detailsContent: {
    padding: 15,
  },
  detailsDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    marginTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
}); 