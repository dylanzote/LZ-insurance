import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import { chatAPI } from '@/services/api/endpoints';
import { useRouter } from 'expo-router';
import { MessageCircle, Send, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
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
  headerWrapper: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingRight: 16,
    paddingLeft: 8,
  } as const,
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.error + '15',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 8,
  } as const,
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight + '10',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    backgroundColor: theme.colors.background,
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
    alignItems: 'flex-end' as const,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  } as const,
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: 100,
    minHeight: 44,
  } as const,
  sendButton: {
    marginLeft: theme.spacing.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
  const { bottom: safeAreaBottom } = useSafeArea();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'away'>('offline');
  const [agentName, setAgentName] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // iOS keyboard listeners - don't touch this
      const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 250);
      });

      const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    } else {
      // Android: Standard approach - let the system handle it with adjustResize
      // Just track keyboard for scroll behavior
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        // Scroll to bottom when keyboard shows
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      return () => {
        keyboardDidShowListener.remove();
      };
    }
  }, []);

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

  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header with Close Button */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Header
              title={t('chat.title')}
              showNotifications={false}
            />
          </View>
          <TouchableOpacity
            onPress={handleEndChat}
            activeOpacity={0.7}
            style={styles.closeButton}
            accessibilityLabel={t('chat.endChat')}
            accessibilityRole="button"
          >
            <X size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Agent Info Bar */}
      <View style={styles.headerContent}>
        <View style={[
          styles.statusDot, 
          getStatusColor(),
          {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 10,
          }
        ]} />
        <MessageCircle size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled={true}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 16
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {isLoading ? (
            <View style={styles.emptyState}>
              <MessageCircle size={48} color={styles.emptyText.color} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Text variant="body" style={styles.emptyText}>
                {t('chat.connecting')}
              </Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageCircle size={48} color={styles.emptyText.color} style={{ opacity: 0.3, marginBottom: 16 }} />
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
        <View 
          style={[
            styles.inputContainer,
            Platform.OS === 'ios' 
              ? {
                  paddingBottom: safeAreaBottom + 12
                }
              : {
                  paddingBottom: 8
                }
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={styles.emptyText.color}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isSending && !isTyping}
            textAlignVertical="center"
            onFocus={() => {
              if (Platform.OS === 'android') {
                // On Android, scroll to bottom when input is focused
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }
            }}
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

