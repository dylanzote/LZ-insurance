import type { ChatMessage } from '../types';

// Mock initial messages for a chat session
export const mockInitialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hello! Welcome to LZ Insurance support. How can I assist you today?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-2',
    text: 'Hi, I have a question about my claim status.',
    sender: 'user',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-3',
    text: 'I\'d be happy to help you with that. Could you please provide your claim number?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    read: true,
    type: 'text',
  },
];

// Simulate agent responses
export const getAgentResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('claim') || lowerMessage.includes('status')) {
    return 'I can help you check your claim status. Your claim is currently under review. You can track it in the "Track My Claim" section of the app.';
  }
  
  if (lowerMessage.includes('policy') || lowerMessage.includes('coverage')) {
    return 'For policy and coverage questions, you can view all your policies in the "Manage Policies" section. Would you like me to guide you there?';
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
    return 'For billing inquiries, please visit the "View My Billing" section or contact our billing department at 1-800-LZ-BILL.';
  }
  
  if (lowerMessage.includes('discount') || lowerMessage.includes('driving score')) {
    return 'Your driving score discount is calculated based on your safe driving habits. You can view your current score and projected discount in the "LZ Advantage" section.';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m here to help you with any questions about your insurance. What would you like to know?';
  }
  
  if (lowerMessage.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with today?';
  }
  
  // Default response
  return 'Thank you for your message. I understand you need assistance. Let me connect you with a specialist who can better help with your inquiry. In the meantime, you can also check our FAQs section for common questions.';
};

