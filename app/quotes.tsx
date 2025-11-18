import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import { ScrollView, View } from 'react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
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
}));

export default function QuotesScreen() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Header title={t('quotes.title')} showNotifications={true} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Card variant="elevated" style={{ padding: 24 }}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {t('quotes.comingSoon')}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

