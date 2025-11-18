import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import type { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row' as const,
  } as const,
  containerUser: {
    justifyContent: 'flex-end' as const,
  } as const,
  containerAgent: {
    justifyContent: 'flex-start' as const,
  } as const,
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg,
  } as const,
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  } as const,
  bubbleAgent: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  text: {
    fontSize: 15,
    lineHeight: 20,
  } as const,
  textUser: {
    color: '#FFFFFF',
  } as const,
  textAgent: {
    color: theme.colors.text,
  } as const,
  timestamp: {
    fontSize: 11,
    marginTop: theme.spacing.xs,
    opacity: 0.7,
  } as const,
  timestampUser: {
    color: '#FFFFFF',
    textAlign: 'right' as const,
  } as const,
  timestampAgent: {
    color: theme.colors.textSecondary,
  } as const,
}));

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const styles = useStyles();
  const isUser = message.sender === 'user';

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerAgent]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
        <Text variant="body" style={[styles.text, isUser ? styles.textUser : styles.textAgent]}>
          {message.text}
        </Text>
        <Text
          variant="caption"
          style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAgent]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

