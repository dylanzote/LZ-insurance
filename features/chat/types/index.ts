export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  read: boolean;
  type?: 'text' | 'system';
}

export interface ChatSession {
  id: string;
  agentName: string;
  agentAvatar?: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

