import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';

interface CircularScoreMeterProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  } as const,
  scoreContainer: {
    position: 'absolute' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  scoreText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  levelText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 4,
  } as const,
  maxScore: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  } as const,
}));

export const CircularScoreMeter: React.FC<CircularScoreMeterProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.colors.success || '#16a34a';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return theme.colors.warning || '#d97706';
    return theme.colors.error || '#dc2626';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Poor';
  };

  const scoreColor = getScoreColor(score);
  const scoreLevel = getScoreLevel(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      
      <View style={[styles.scoreContainer, { width: size, height: size }]}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score}
        </Text>
        <Text style={[styles.levelText, { color: scoreColor }]}>
          {scoreLevel}
        </Text>
        <Text style={styles.maxScore}>/ 100</Text>
      </View>
    </View>
  );
};

