import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

export default function AIChatHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get chat logs from Supabase
      const { data, error } = await supabase
        .from('ai_chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      // Group by date for display
      const groupedSessions = groupChatsByDate(data || []);
      setChatSessions(groupedSessions);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupChatsByDate = (chats) => {
    const grouped = {};
    
    chats.forEach(chat => {
      const date = new Date(chat.timestamp).toDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(chat);
    });
    
    // Convert to array format for FlatList
    return Object.keys(grouped).map(date => ({
      date,
      chats: grouped[date]
    }));
  };

  const renderChatSession = ({ item }) => {
    return (
      <View style={styles.sessionContainer}>
        <Text style={styles.dateHeader}>{item.date}</Text>
        
        {item.chats.map((chat, index) => (
          <View 
            key={chat.id} 
            style={[
              styles.chatBubble,
              chat.is_user_message ? styles.userBubble : styles.aiBubble
            ]}
          >
            {!chat.is_user_message && (
              <View style={styles.aiAvatar}>
                <Ionicons name="analytics" size={16} color={colors.white} />
              </View>
            )}
            <View style={styles.chatContent}>
              <Text style={styles.chatText}>{chat.message}</Text>
              <Text style={styles.timestamp}>
                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading chat history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadChatHistory}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (chatSessions.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="chatbubbles-outline" size={50} color={colors.textLight} />
        <Text style={styles.emptyText}>No chat history yet</Text>
        <TouchableOpacity 
          style={styles.startChatButton}
          onPress={() => navigation.navigate('AIChat')}
        >
          <Text style={styles.startChatButtonText}>Start a Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatSessions}
        renderItem={renderChatSession}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => navigation.navigate('AIChat')}
      >
        <Ionicons name="chatbubble" size={20} color={colors.white} />
        <Text style={styles.newChatButtonText}>New Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 15,
  },
  sessionContainer: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  chatBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatContent: {
    flex: 1,
  },
  chatText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  userChatText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  startChatButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startChatButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  newChatButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 