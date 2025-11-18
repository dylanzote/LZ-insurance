import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { chatAPI } from '@/services/api/endpoints';
import { useRouter } from 'expo-router';
import { Send, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import type { ChatMessage } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  } as const,
  agentInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  } as const,
  agentName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  agentStatus: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  } as const,
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  } as const,
  statusOnline: {
    backgroundColor: '#10b981',
  } as const,
  statusOffline: {
    backgroundColor: theme.colors.textSecondary,
  } as const,
  statusAway: {
    backgroundColor: '#f59e0b',
  } as const,
  messagesContainer: {
    flex: 1,
    padding: theme.spacing.md,
  } as const,
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: 100,
  } as const,
  sendButton: {
    marginLeft: theme.spacing.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  sendButtonDisabled: {
    opacity: 0.5,
  } as const,
  typingContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  } as const,
}));

export const ChatScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'away'>('offline');
  const [agentName, setAgentName] = useState('');

  useEffect(() => {
    loadChatSession();
    loadMessages();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const loadChatSession = async () => {
    try {
      const session = await chatAPI.getChatSession();
      setAgentName(session.agentName);
      setAgentStatus(session.status);
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const loadedMessages = await chatAPI.getMessages();
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const userMessageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      // Add user message immediately
      const userMessage = await chatAPI.sendMessage(userMessageText);
      setMessages(prev => [...prev, userMessage]);

      // Show typing indicator
      setIsTyping(true);

      // Get agent response
      const agentMessage = await chatAPI.getAgentResponse(userMessageText);
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert(
        t('common.error'),
        t('chat.messageFailed')
      );
      // Restore input text on error
      setInputText(userMessageText);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleEndChat = () => {
    Alert.alert(
      t('chat.endChat'),
      t('chat.endChatConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('chat.endChat'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('chat.chatEnded'));
            router.back();
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'online':
        return styles.statusOnline;
      case 'away':
        return styles.statusAway;
      default:
        return styles.statusOffline;
    }
  };

  const getStatusText = () => {
    switch (agentStatus) {
      case 'online':
        return t('chat.agentOnline');
      case 'away':
        return t('chat.agentAway');
      default:
        return t('chat.agentOffline');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16 }}>
        <Header
          title={t('chat.title')}
          showNotifications={false}
        />
        <TouchableOpacity
          onPress={handleEndChat}
          activeOpacity={0.7}
          style={{ padding: 8 }}
        >
          <X size={24} color={styles.agentName.color} />
        </TouchableOpacity>
      </View>
      
      {/* Agent Info Bar */}
      <View style={[styles.headerContent, { borderBottomWidth: 1 }]}>
        <View style={[styles.statusDot, getStatusColor()]} />
        <View style={styles.agentInfo}>
          <Text variant="body" weight="semibold" style={styles.agentName}>
            {agentName || 'Support Agent'}
          </Text>
          <Text variant="caption" style={styles.agentStatus}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text variant="body" style={styles.emptyText}>
                {t('chat.connecting')}
              </Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="body" style={styles.emptyText}>
                {t('chat.noMessages')}
              </Text>
            </View>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <View style={styles.typingContainer}>
                  <TypingIndicator />
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={styles.emptyText.color}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isSending && !isTyping}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isSending || isTyping) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isSending || isTyping}
            activeOpacity={0.7}
          >
            <Send
              size={20}
              color={(!inputText.trim() || isSending || isTyping) ? '#999' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

