import React from 'react';
import { View, Text } from 'react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';

interface ScoreMeterProps {
  score: number;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  } as const,
  scoreContainer: {
    alignItems: 'center' as const,
    marginBottom: 20,
  } as const,
  scoreText: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  levelText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 8,
  } as const,
  progressContainer: {
    width: '100%',
    height: 20,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    overflow: 'hidden' as const,
    marginTop: 10,
  } as const,
  progressBar: {
    height: '100%',
    borderRadius: 10,
  } as const,
  labelsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
    marginTop: 8,
  } as const,
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
}));

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ score }) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Poor';
  };

  const scoreColor = getScoreColor(score);
  const scoreLevel = getScoreLevel(score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score}
        </Text>
        <Text style={[styles.levelText, { color: scoreColor }]}>
          {scoreLevel}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${score}%`,
              backgroundColor: scoreColor,
            }
          ]} 
        />
      </View>

      <View style={styles.labelsContainer}>
        <Text style={styles.label}>0</Text>
        <Text style={styles.label}>50</Text>
        <Text style={styles.label}>100</Text>
      </View>
    </View>
  );
};