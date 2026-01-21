import type { ChatMessage } from '@/features/chat/types';

export const chatAPI = {
  getMessages: async (sessionId?: string): Promise<ChatMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 'msg_1',
        text: 'Hello! How can I help you today?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: true,
        type: 'text',
      },
    ];
  },
  getChatSession: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      agentName: 'Sarah Johnson',
      status: 'online' as const,
    };
  },
  sendMessage: async (message: string, sessionId?: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `msg_${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
    };
  },
  getAgentResponse: async (userMessage: string, sessionId?: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Import the getAgentResponse function from mockChat
    const { getAgentResponse } = await import('@/features/chat/data/mockChat');
    const responseText = getAgentResponse(userMessage);
    
    return {
      id: `msg_${Date.now()}`,
      text: responseText,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
    };
  },
};

