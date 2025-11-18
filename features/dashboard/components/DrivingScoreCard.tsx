import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { i18n } from '@/core/i18n';

interface DrivingScoreCardProps {
  score: number;
  discount: number;
  tripsToReview: number;
  onPress: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  scoreSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  } as const,
  scoreText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  } as const,
  scoreInfo: {
    flex: 1,
  } as const,
  scoreLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as const,
  discountText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.success,
  } as const,
  tripsSection: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  tripsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  reviewButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  } as const,
  reviewButtonText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600' as const,
  } as const,
}));

const getScoreColor = (score: number) => {
  if (score >= 90) return '#16a34a';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#d97706';
  return '#dc2626';
};

const getStars = (score: number) => {
  const stars = Math.floor(score / 20);
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
};

export const DrivingScoreCard: React.FC<DrivingScoreCardProps> = ({
  score,
  discount,
  tripsToReview,
  onPress,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const scoreColor = getScoreColor(score);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.drivingScore')}</Text>
        <Text style={{ color: scoreColor, fontWeight: '600' }}>
          {getStars(score)}
        </Text>
      </View>

      <View style={styles.scoreSection}>
        <View style={[styles.scoreCircle, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreLabel}>{t('dashboard.currentScore')}</Text>
          <Text style={styles.discountText}>
            {i18n.t('dashboard.discountEligible', { discount })}
          </Text>
        </View>
      </View>

      <View style={styles.tripsSection}>
        <Text style={styles.tripsText}>
          {i18n.t('dashboard.tripsToReview', { count: tripsToReview })}
        </Text>
        {tripsToReview > 0 && (
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>
              {t('common.review')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};