import { supabase } from './supabase';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

// Deepseek API integration
const DEEPSEEK_API_KEY = 'sk-dc0ba353385349728e6745d67f5ff51b';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const sendMessageToAI = async (message, userId, conversationHistory = []) => {
  try {
    // Log the user message to Supabase
    await logUserMessage(message, userId);
    
    // Format conversation history for the API
    const formattedHistory = formatConversationHistory(conversationHistory);
    
    // Add the current user message
    formattedHistory.push({
      role: "user",
      content: message
    });
    
    // Call the Deepseek API
    const response = await callDeepseekAPI(formattedHistory);
    
    // Log the AI response to Supabase
    await logAIResponse(response, userId);
    
    return response;
  } catch (error) {
    console.error('Error in AI service:', error);
    throw error;
  }
};

const formatConversationHistory = (history) => {
  // Start with system message to set context
  const formattedHistory = [
    {
      role: "system",
      content: "You are CreativeCash_AI, a financial assistant for freelancers and creative professionals. " +
               "Provide helpful, concise advice on taxes, invoicing, expense tracking, and financial planning " +
               "specifically tailored for independent workers. Be friendly and supportive."
    }
  ];
  
  // Add conversation history
  history.forEach(msg => {
    formattedHistory.push({
      role: msg.sender === 'user' ? "user" : "assistant",
      content: msg.text
    });
  });
  
  return formattedHistory;
};

const callDeepseekAPI = async (messages) => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Deepseek API error:', errorData);
      throw new Error(`Deepseek API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Deepseek API:', error);
    return fallbackResponse(messages[messages.length - 1].content);
  }
};

// Fallback responses in case the API call fails
const fallbackResponse = (userMessage) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes('tax') || lowerCaseMessage.includes('taxes')) {
    return "As a freelancer, you can typically deduct business expenses like home office, equipment, software subscriptions, and professional development. Keep detailed records and consider quarterly estimated tax payments to avoid penalties. It's best to consult with a tax professional for personalized advice.";
  } 
  
  if (lowerCaseMessage.includes('invoice') || lowerCaseMessage.includes('invoicing')) {
    return "For effective invoicing: 1) Use professional templates, 2) Set clear payment terms (Net 15 or 30), 3) Send invoices promptly, 4) Follow up on late payments, and 5) Consider accepting multiple payment methods. You can use our app's invoice generator to create professional invoices easily!";
  }
  
  if (lowerCaseMessage.includes('retirement') || lowerCaseMessage.includes('save')) {
    return "Freelancers have several retirement options: Solo 401(k), SEP IRA, or Roth IRA. Without employer matching, aim to save 15-20% of your income. Consistency is key - even small regular contributions add up over time thanks to compound interest.";
  }
  
  if (lowerCaseMessage.includes('expense') || lowerCaseMessage.includes('tracking')) {
    return "For expense tracking: 1) Use dedicated software or our app, 2) Separate business and personal accounts, 3) Scan receipts immediately, 4) Review expenses weekly, and 5) Categorize properly for tax purposes. This makes tax time much easier and helps you understand your business finances better.";
  }
  
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
    return "Hello! I'm your CreativeCash financial assistant. How can I help with your freelance finances today?";
  }
  
  // Default response
  return "That's a great question about freelance finances. While I'm still learning, I recommend tracking all income and expenses carefully, setting aside 25-30% for taxes, and building both an emergency fund and retirement savings. Would you like more specific advice on a particular financial topic?";
};

const logUserMessage = async (message, userId) => {
  try {
    if (!userId) return;
    
    await supabase.from('ai_chat_logs').insert({
      user_id: userId,
      message: message,
      is_user_message: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging user message:', error);
    // Don't throw - this is non-critical
  }
};

const logAIResponse = async (response, userId) => {
  try {
    if (!userId) return;
    
    await supabase.from('ai_chat_logs').insert({
      user_id: userId,
      message: response,
      is_user_message: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging AI response:', error);
    // Don't throw - this is non-critical
  }
};

export const getAISuggestions = () => {
  return [
    "How can I reduce my taxes as a freelancer?",
    "What's a good invoicing strategy?",
    "How should I save for retirement?",
    "Tips for tracking business expenses?",
    "How much should I set aside for taxes?",
    "What insurance do I need as a freelancer?"
  ];
};

// Get financial insights based on user data
export const getFinancialInsights = async (userId, incomeData) => {
  try {
    // This would typically call an AI model API
    // For now, we'll return some static insights
    const insights = [
      {
        type: 'income_trend',
        title: 'Income Trend',
        description: 'Your income has increased by 15% compared to last month.',
        recommendation: 'Consider setting aside the additional income for savings or investments.'
      },
      {
        type: 'tax_optimization',
        title: 'Tax Optimization',
        description: 'You have a high percentage of income in the "Freelance" category.',
        recommendation: 'Make sure you\'re tracking all business expenses to maximize deductions.'
      },
      {
        type: 'diversification',
        title: 'Income Diversification',
        description: 'Most of your income comes from a single source.',
        recommendation: 'Consider diversifying your income streams to reduce financial risk.'
      }
    ];
    
    return { insights };
  } catch (error) {
    return { error };
  }
};

// Save a chat message
export const saveChatMessage = async (userId, message, isUser = true) => {
  try {
    const docRef = await addDoc(collection(db, 'chat_messages'), {
      userId,
      content: message,
      isUser,
      timestamp: new Date()
    });
    
    return { id: docRef.id };
  } catch (error) {
    return { error };
  }
};

// Get chat history
export const getChatHistory = async (userId) => {
  try {
    const q = query(
      collection(db, 'chat_messages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { messages };
  } catch (error) {
    return { error };
  }
};

// Get AI response to a user message
export const getAIResponse = async (userId, message) => {
  try {
    // In a real app, this would call an AI API like OpenAI
    // For now, we'll return some static responses
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
      response = "Based on your income data, I recommend setting aside about 30% of your freelance income for taxes. Remember to track all your business expenses for potential deductions.";
    } else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      response = "Looking at your income patterns, you could comfortably save about 20% of your monthly income. Consider automating transfers to a high-yield savings account.";
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
      response = "With your current financial situation, you might consider starting with index funds or ETFs. They offer diversification with relatively lower risk for beginning investors.";
    } else {
      response = "I'm your financial assistant. I can help with questions about your income, taxes, savings, and investments. What would you like to know?";
    }
    
    // Save the AI response to the chat history
    await saveChatMessage(userId, response, false);
    
    return { response };
  } catch (error) {
    return { error };
  }
}; 