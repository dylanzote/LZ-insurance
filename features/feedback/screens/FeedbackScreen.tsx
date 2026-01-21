import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { MessageSquare, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { FeedbackCard } from '../components/FeedbackCard';
import { FeedbackForm } from '../components/FeedbackForm';
import { useFeedback } from '../hooks/useFeedback';
import type { FeedbackFormData, FeedbackStatus } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 20,
  } as const,
  statsCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
  } as const,
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 16,
  } as const,
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  } as const,
  statItem: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  } as const,
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  } as const,
  statLabel: {
    fontSize: 13,
    color: theme.colors.primaryDark,
    opacity: 0.7,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  filterContainer: {
    flexDirection: 'row' as const,
    gap: 8,
    marginBottom: 16,
  } as const,
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  filterChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
  } as const,
  filterChipTextActive: {
    color: theme.colors.white,
  } as const,
  fab: {
    position: 'absolute' as const,
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  } as const,
  formContainer: {
    padding: 20,
  } as const,
}));

export const FeedbackScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { feedbacks, stats, loading, refetch, submitFeedback, deleteFeedback } = useFeedback();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FeedbackStatus | 'all'>('all');

  const filteredFeedbacks = React.useMemo(() => {
    if (filter === 'all') return feedbacks;
    return feedbacks.filter(f => f.status === filter);
  }, [feedbacks, filter]);

  const handleSubmit = async (data: FeedbackFormData) => {
    try {
      await submitFeedback(data);
      setShowForm(false);
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'An error occurred';
      console.error('Error submitting feedback:', errorMessage);
      // Error is already handled by useFeedback hook
      // Re-throw to prevent form from closing on error
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id);
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <Header 
          title={t('feedback.form.title')} 
          showNotifications={true}
        />
        <FeedbackForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('feedback.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.content}
      >
        {/* Statistics */}
        {stats && (
          <Card variant="elevated" style={styles.statsCard}>
            <Text variant="h3" weight="bold" style={styles.statsTitle}>
              {t('feedback.stats.title')}
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>{t('feedback.stats.total')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.pending}</Text>
                <Text style={styles.statLabel}>{t('feedback.stats.pending')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.resolved}</Text>
                <Text style={styles.statLabel}>{t('feedback.stats.resolved')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                </Text>
                <Text style={styles.statLabel}>{t('feedback.stats.averageRating')}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Filter */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="bold" style={styles.sectionTitle}>
              {t('feedback.history')}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {(['all', 'submitted', 'in-review', 'resolved', 'closed'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  filter === status && styles.filterChipActive,
                ]}
                onPress={() => setFilter(status)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === status && styles.filterChipTextActive,
                  ]}
                >
                  {t(`feedback.filters.${status}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feedback List */}
        {loading && feedbacks.length === 0 ? (
          <LoadingSpinner message={t('feedback.loading')} />
        ) : filteredFeedbacks.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={t('feedback.empty.title')}
            message={t('feedback.empty.description')}
            action={
              <Button
                title={t('feedback.submit')}
                onPress={() => setShowForm(true)}
                style={{ marginTop: 16 }}
              />
            }
          />
        ) : (
          <View style={styles.section}>
            {filteredFeedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={t('feedback.submit')}
      >
        <Plus size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

