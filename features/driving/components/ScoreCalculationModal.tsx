import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { X, Gauge, Zap, AlertCircle, CornerDownRight, Clock, Smartphone, Moon } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ScoreCalculationModalProps {
  visible: boolean;
  onClose: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 32,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center' as const,
  } as const,
  closeButton: {
    padding: 8,
    width: 40,
    alignItems: 'center' as const,
  } as const,
  content: {
    padding: 20,
  } as const,
  question: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 20,
  } as const,
  tabs: {
    flexDirection: 'row' as const,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  } as const,
  tabActive: {
    borderBottomColor: theme.colors.primary,
  } as const,
  tabText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.textSecondary,
  } as const,
  tabTextActive: {
    color: theme.colors.primary,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 12,
  } as const,
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  } as const,
  scoreTable: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden' as const,
    marginBottom: 16,
  } as const,
  scoreRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  scoreRowLast: {
    borderBottomWidth: 0,
  } as const,
  scoreLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  scoreValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    width: 50,
  } as const,
  stars: {
    fontSize: 16,
    marginLeft: 12,
  } as const,
  adjustment: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
    textAlign: 'right' as const,
  } as const,
  adjustmentSurcharge: {
    color: theme.colors.error || '#dc2626',
  } as const,
  factorItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  factorItemLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  } as const,
  factorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  factorContent: {
    flex: 1,
  } as const,
  factorTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  factorDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  } as const,
  disclaimer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  } as const,
  disclaimerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center' as const,
  } as const,
  closeButtonBottom: {
    marginTop: 24,
    marginHorizontal: 20,
  } as const,
}));

type TabType = 'overall' | 'factors';

const getStars = (score: number): string => {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

const scoreRanges = [
  { score: 5.0, adjustment: '30% discount' },
  { score: 4.5, adjustment: '21 - 29% discount' },
  { score: 4.0, adjustment: '11 - 20% discount' },
  { score: 3.5, adjustment: '6 - 10% discount' },
  { score: 3.0, adjustment: '1 - 5% discount' },
  { score: 2.5, adjustment: '0% adjustment' },
  { score: 2.0, adjustment: '0% adjustment' },
  { score: 1.5, adjustment: '10% surcharge' },
  { score: 1.0, adjustment: '20% surcharge' },
  { score: 0.5, adjustment: '30% surcharge' },
];

export const ScoreCalculationModal: React.FC<ScoreCalculationModalProps> = ({
  visible,
  onClose,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overall');

  const renderOverallScoring = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('driving.calculationModal.whatIsPerformance')}
        </Text>
        <Text style={styles.sectionText}>
          {t('driving.calculationModal.performanceDescription')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('driving.calculationModal.scoresAndAdjustments')}
        </Text>
        <Text style={styles.sectionText}>
          {t('driving.calculationModal.scoresDescription')}
        </Text>
      </View>

      <View style={styles.scoreTable}>
        {scoreRanges.map((item, index) => {
          const isSurcharge = item.adjustment.includes('surcharge');
          return (
            <View
              key={index}
              style={[
                styles.scoreRow,
                index === scoreRanges.length - 1 && styles.scoreRowLast,
              ]}
            >
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreValue}>{item.score}</Text>
                <Text style={styles.stars}>{getStars(item.score)}</Text>
              </View>
              <Text
                style={[
                  styles.adjustment,
                  isSurcharge && styles.adjustmentSurcharge,
                ]}
              >
                {item.adjustment}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          {t('driving.calculationModal.disclaimer')}
        </Text>
      </View>
    </View>
  );

  const renderScoringFactors = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('driving.calculationModal.tripPerformance')}
        </Text>
        <Text style={styles.sectionText}>
          {t('driving.calculationModal.tripPerformanceDescription')}
        </Text>
      </View>

      <View style={styles.section}>
        {[
          {
            icon: Gauge,
            title: t('driving.calculationModal.factors.speed'),
            description: t('driving.calculationModal.factors.speedDesc'),
          },
          {
            icon: Zap,
            title: t('driving.calculationModal.factors.acceleration'),
            description: t('driving.calculationModal.factors.accelerationDesc'),
          },
          {
            icon: AlertCircle,
            title: t('driving.calculationModal.factors.braking'),
            description: t('driving.calculationModal.factors.brakingDesc'),
          },
          {
            icon: CornerDownRight,
            title: t('driving.calculationModal.factors.cornering'),
            description: t('driving.calculationModal.factors.corneringDesc'),
          },
          {
            icon: Clock,
            title: t('driving.calculationModal.factors.duration'),
            description: t('driving.calculationModal.factors.durationDesc'),
          },
          {
            icon: Smartphone,
            title: t('driving.calculationModal.factors.distractions'),
            description: t('driving.calculationModal.factors.distractionsDesc'),
          },
        ].map((factor, index, array) => (
          <View
            key={index}
            style={[
              styles.factorItem,
              index === array.length - 1 && styles.factorItemLast,
            ]}
          >
            <View style={styles.factorIcon}>
              <factor.icon color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.factorContent}>
              <Text style={styles.factorTitle}>{factor.title}</Text>
              <Text style={styles.factorDescription}>{factor.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('driving.calculationModal.nightDriving')}
        </Text>
        <View style={styles.factorItem}>
          <View style={styles.factorIcon}>
            <Moon color={theme.colors.primary} size={20} />
          </View>
          <View style={styles.factorContent}>
            <Text style={styles.factorDescription}>
              {t('driving.calculationModal.nightDrivingDescription')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <X color={theme.colors.primary} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {t('driving.calculationModal.title')}
            </Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.question}>
              {t('driving.calculationModal.question')}
            </Text>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'overall' && styles.tabActive]}
                onPress={() => setActiveTab('overall')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'overall' && styles.tabTextActive,
                  ]}
                >
                  {t('driving.calculationModal.tabs.overall')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'factors' && styles.tabActive]}
                onPress={() => setActiveTab('factors')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'factors' && styles.tabTextActive,
                  ]}
                >
                  {t('driving.calculationModal.tabs.factors')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'overall' ? renderOverallScoring() : renderScoringFactors()}
          </ScrollView>

          <View style={styles.closeButtonBottom}>
            <Button
              title={t('common.close')}
              onPress={onClose}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
