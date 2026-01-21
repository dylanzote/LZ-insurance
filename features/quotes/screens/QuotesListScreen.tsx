import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Bike,
  Calendar,
  Car,
  FileText,
  Heart,
  Home,
  Plane,
  Plus,
  Stethoscope
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuotes } from '../hooks/useQuotes';
import type { InsuranceType } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: 16,
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
}));

const getTypeIcon = (type: InsuranceType) => {
  switch (type) {
    case 'auto':
      return Car;
    case 'motorcycle':
      return Bike;
    case 'home':
      return Home;
    case 'life':
      return Heart;
    case 'health':
      return Stethoscope;
    case 'travel':
      return Plane;
    default:
      return FileText;
  }
};

const getStatusColor = (status: string, theme: any) => {
  switch (status) {
    case 'approved':
      return theme.colors.success;
    case 'pending':
      return theme.colors.warning;
    case 'expired':
      return theme.colors.textSecondary;
    case 'converted':
      return theme.colors.primary;
    default:
      return theme.colors.textSecondary;
  }
};

export const QuotesListScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { quotes, loading, refetch } = useQuotes();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleQuotePress = (quoteId: string) => {
    router.push(`/quotes/${quoteId}` as any);
  };

  const handleNewQuote = () => {
    router.push('/(app)/quotes/new' as any);
  };

  if (loading && quotes.length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('quotes.title')} showNotifications={true} />
        <LoadingSpinner message={t('quotes.loading')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('quotes.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {quotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('quotes.empty.title')}
            message={t('quotes.empty.description')}
            action={
              <Button
                title={t('quotes.getQuote')}
                onPress={handleNewQuote}
                style={{ marginTop: 16 }}
              />
            }
          />
        ) : (
          quotes.map((quote) => {
            const Icon = getTypeIcon(quote.type);
            return (
              <TouchableOpacity
                key={quote.id}
                onPress={() => handleQuotePress(quote.id)}
                activeOpacity={0.7}
              >
                <Card variant="elevated" style={{ marginBottom: 16, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: theme.colors.primaryLight + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Icon size={24} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="h3" weight="semibold">
                        {t(`quotes.types.${quote.type}`)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text
                          variant="caption"
                          color={theme.colors.textSecondary}
                          style={{ marginLeft: 4 }}
                        >
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Badge
                      variant={
                        quote.status === 'approved'
                          ? 'success'
                          : quote.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      label={t(`quotes.status.${quote.status}`)}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                    }}
                  >
                    <View>
                      <Text variant="caption" color={theme.colors.textSecondary}>
                        {t('quotes.monthlyPremium')}
                      </Text>
                      <Text variant="h3" weight="bold" color={theme.colors.primary}>
                        ${quote.monthlyPremium.toFixed(2)}
                      </Text>
                    </View>
                    <ArrowRight size={20} color={theme.colors.textSecondary} />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewQuote}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={t('quotes.getQuote')}
      >
        <Plus size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

