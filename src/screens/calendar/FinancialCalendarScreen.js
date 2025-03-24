import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function FinancialCalendarScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    loadEvents();
    generateCalendarDays(currentMonth);
  }, [currentMonth]);
  
  const loadEvents = async () => {
    setIsLoading(true);
    // In a real app, you would fetch events from your backend
    // For now, we'll use mock data
    setTimeout(() => {
      const mockEvents = [
        {
          id: '1',
          title: 'Quarterly Tax Payment',
          date: '2023-12-15',
          amount: 1250,
          type: 'tax',
          description: 'Q4 estimated tax payment due',
          completed: false
        },
        {
          id: '2',
          title: 'Client Invoice Due',
          date: '2023-12-10',
          amount: 2500,
          type: 'invoice',
          client: 'ABC Company',
          description: 'Invoice #1045 payment due',
          completed: false
        },
        {
          id: '3',
          title: 'Subscription Renewal',
          date: '2023-12-05',
          amount: 49.99,
          type: 'expense',
          description: 'Adobe Creative Cloud subscription renewal',
          completed: true
        },
        {
          id: '4',
          title: 'Client Payment Expected',
          date: '2023-12-20',
          amount: 1800,
          type: 'income',
          client: 'XYZ Corp',
          description: 'Payment for website redesign project',
          completed: false
        }
      ];
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  };
  
  const generateCalendarDays = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, monthIndex, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(year, monthIndex + 1, 0);
    const lastDate = lastDay.getDate();
    
    // Get the last day of the previous month
    const prevMonthLastDay = new Date(year, monthIndex, 0);
    const prevMonthLastDate = prevMonthLastDay.getDate();
    
    const days = [];
    
    // Add days from previous month to fill the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(year, monthIndex - 1, prevMonthLastDate - firstDayOfWeek + i + 1);
      days.push({
        date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, monthIndex, i);
      days.push({
        date,
        day: i,
        month: monthIndex,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, monthIndex + 1, i);
      days.push({
        date,
        day: i,
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false
      });
    }
    
    setCalendarDays(days);
  };
  
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  const handleDayPress = (day) => {
    setSelectedDate(day.date);
  };
  
  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };
  
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };
  
  const getEventIndicatorColor = (type) => {
    switch (type) {
      case 'income':
        return colors.success;
      case 'expense':
        return colors.error;
      case 'tax':
        return colors.warning;
      case 'invoice':
        return colors.primary;
      default:
        return colors.textLight;
    }
  };
  
  const renderDayCell = (day) => {
    const isToday = day.date.toDateString() === new Date().toDateString();
    const isSelected = day.date.toDateString() === selectedDate.toDateString();
    const dateEvents = getEventsForDate(day.date);
    
    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          !day.isCurrentMonth && styles.otherMonthDay,
          isSelected && styles.selectedDay
        ]}
        onPress={() => handleDayPress(day)}
      >
        <View style={[styles.dayContent, isToday && styles.todayContent]}>
          <Text style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthDayText,
            isToday && styles.todayDayText,
            isSelected && styles.selectedDayText
          ]}>
            {day.day}
          </Text>
          
          {dateEvents.length > 0 && (
            <View style={styles.eventIndicatorContainer}>
              {dateEvents.slice(0, 3).map((event, index) => (
                <View 
                  key={index}
                  style={[
                    styles.eventIndicator,
                    { backgroundColor: getEventIndicatorColor(event.type) }
                  ]}
                />
              ))}
              {dateEvents.length > 3 && (
                <Text style={styles.moreEventsText}>+{dateEvents.length - 3}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEventItem = ({ item }) => {
    const isIncome = item.type === 'income';
    
    return (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() => handleEventPress(item)}
      >
        <View style={[
          styles.eventTypeIcon,
          { backgroundColor: getEventIndicatorColor(item.type) }
        ]}>
          <Ionicons 
            name={
              item.type === 'income' ? 'cash-outline' :
              item.type === 'expense' ? 'card-outline' :
              item.type === 'tax' ? 'receipt-outline' :
              'document-text-outline'
            } 
            size={20} 
            color={colors.white} 
          />
        </View>
        
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
        </View>
        
        <View style={styles.eventAmount}>
          <Text style={[
            styles.amountText,
            isIncome ? styles.incomeText : styles.expenseText
          ]}>
            {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }
  
  const selectedDateEvents = getEventsForDate(selectedDate);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Calendar</Text>
      </View>
      
      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => navigateMonth(-1)}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => navigateMonth(1)}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdaysRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => (
            <View key={index} style={styles.dayCellContainer}>
              {renderDayCell(day)}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.eventsSection}>
        <Text style={styles.selectedDateText}>
          Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        
        {selectedDateEvents.length > 0 ? (
          <FlatList
            data={selectedDateEvents}
            renderItem={renderEventItem}
            keyExtractor={item => item.id}
            style={styles.eventsList}
          />
        ) : (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={50} color={colors.textLight} />
            <Text style={styles.noEventsText}>No events for this date</Text>
          </View>
        )}
      </View>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Event Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {selectedEvent && (
              <View style={styles.modalBody}>
                <View style={styles.eventDetailHeader}>
                  <View style={[
                    styles.eventTypeIcon,
                    { backgroundColor: getEventIndicatorColor(selectedEvent.type) }
                  ]}>
                    <Ionicons 
                      name={
                        selectedEvent.type === 'income' ? 'cash-outline' :
                        selectedEvent.type === 'expense' ? 'card-outline' :
                        selectedEvent.type === 'tax' ? 'receipt-outline' :
                        'document-text-outline'
                      } 
                      size={20} 
                      color={colors.white} 
                    />
                  </View>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                </View>
                
                <View style={styles.eventDetailRow}>
                  <Text style={styles.eventDetailLabel}>Date:</Text>
                  <Text style={styles.eventDetailValue}>
                    {formatDate(selectedEvent.date)}
                  </Text>
                </View>
                
                <View style={styles.eventDetailRow}>
                  <Text style={styles.eventDetailLabel}>Amount:</Text>
                  <Text style={[
                    styles.eventDetailValue,
                    selectedEvent.type === 'income' ? styles.incomeText : styles.expenseText
                  ]}>
                    {selectedEvent.type === 'income' ? '+' : '-'}{formatCurrency(selectedEvent.amount)}
                  </Text>
                </View>
                
                {selectedEvent.client && (
                  <View style={styles.eventDetailRow}>
                    <Text style={styles.eventDetailLabel}>Client:</Text>
                    <Text style={styles.eventDetailValue}>{selectedEvent.client}</Text>
                  </View>
                )}
                
                <View style={styles.eventDetailRow}>
                  <Text style={styles.eventDetailLabel}>Type:</Text>
                  <Text style={styles.eventDetailValue}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.eventDetailRow}>
                  <Text style={styles.eventDetailLabel}>Status:</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: selectedEvent.completed ? colors.success : colors.warning }
                  ]}>
                    <Text style={styles.statusText}>
                      {selectedEvent.completed ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.eventDetailLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    selectedEvent.completed && styles.disabledButton
                  ]}
                  disabled={selectedEvent.completed}
                  onPress={() => {
                    // Mark as completed logic would go here
                    setModalVisible(false);
                    Alert.alert('Success', 'Event marked as completed');
                  }}
                >
                  <Text style={styles.actionButtonText}>
                    {selectedEvent.completed ? 'Completed' : 'Mark as Completed'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  calendarContainer: {
    backgroundColor: colors.white,
    margin: 15,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  monthButton: {
    padding: 5,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 5,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellContainer: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  dayCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dayContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: colors.textLight,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  todayContent: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  todayDayText: {
    fontWeight: 'bold',
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  moreEventsText: {
    fontSize: 10,
    color: colors.textLight,
    marginLeft: 2,
  },
  eventsSection: {
    flex: 1,
    padding: 15,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
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
  eventTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  eventAmount: {
    marginLeft: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: colors.success,
  },
  expenseText: {
    color: colors.error,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 10,
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
  modalBody: {
    padding: 15,
  },
  eventDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  eventDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventDetailLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  eventDetailValue: {
    fontSize: 16,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 5,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 