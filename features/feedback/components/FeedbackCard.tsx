import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { 
  Bug, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  Heart, 
  HelpCircle,
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Feedback, FeedbackCategory } from '../types';

interface FeedbackCardProps {
  feedback: Feedback;
  onDelete?: (id: string) => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    marginBottom: 16,
    overflow: 'hidden' as const,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  } as const,
  headerLeft: {
    flex: 1,
    marginRight: 12,
  } as const,
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 6,
  } as const,
  categoryRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  } as const,
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 8,
  } as const,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  } as const,
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  footerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  } as const,
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  ratingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  } as const,
  deleteButton: {
    padding: 8,
  } as const,
  responseCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
  } as const,
  responseLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  } as const,
  responseText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  } as const,
}));

const getCategoryIcon = (category: FeedbackCategory) => {
  switch (category) {
    case 'bug':
      return Bug;
    case 'feature':
      return Lightbulb;
    case 'improvement':
      return TrendingUp;
    case 'complaint':
      return AlertCircle;
    case 'compliment':
      return Heart;
    default:
      return HelpCircle;
  }
};

const getCategoryColor = (category: FeedbackCategory, theme: any) => {
  switch (category) {
    case 'bug':
      return '#ef4444';
    case 'feature':
      return '#3b82f6';
    case 'improvement':
      return '#10b981';
    case 'complaint':
      return '#f59e0b';
    case 'compliment':
      return '#ec4899';
    default:
      return theme.colors.textSecondary;
  }
};

const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'info' => {
  switch (status) {
    case 'resolved':
      return 'success';
    case 'in-review':
      return 'warning';
    case 'closed':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'resolved':
      return CheckCircle2;
    case 'in-review':
      return Clock;
    case 'closed':
      return XCircle;
    default:
      return Clock;
  }
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onDelete }) => {
  const styles = useStyles();
  const { t, locale } = useTranslation();
  const { theme } = useTheme();

  const CategoryIcon = getCategoryIcon(feedback.category);
  const categoryColor = getCategoryColor(feedback.category, theme);
  const StatusIcon = getStatusIcon(feedback.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatLocale = locale === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(formatLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="h4" weight="bold" style={styles.title}>
            {feedback.title}
          </Text>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
              <CategoryIcon size={16} color={categoryColor} />
            </View>
            <Badge
              label={t(`feedback.categories.${feedback.category}`)}
              variant="default"
              size="sm"
            />
            <Badge
              label={t(`feedback.status.${feedback.status}`)}
              variant={getStatusVariant(feedback.status)}
              size="sm"
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(feedback.id)}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message}>
        {feedback.message}
      </Text>

      {feedback.rating && (
        <View style={styles.ratingContainer}>
          <Text variant="caption" style={{ color: theme.colors.textSecondary, marginRight: 4 }}>
            {t('feedback.form.rating')}:
          </Text>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              size={14}
              color={value <= feedback.rating! ? '#fbbf24' : theme.colors.border}
              fill={value <= feedback.rating! ? '#fbbf24' : 'transparent'}
            />
          ))}
        </View>
      )}

      {feedback.response && (
        <View style={styles.responseCard}>
          <Text style={styles.responseLabel}>
            {t('feedback.response')}
          </Text>
          <Text style={styles.responseText}>
            {feedback.response}
          </Text>
          {feedback.respondedAt && (
            <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 6 }}>
              {formatDate(feedback.respondedAt)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <StatusIcon size={14} color={theme.colors.textSecondary} />
          <Text style={styles.date}>
            {formatDate(feedback.createdAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

