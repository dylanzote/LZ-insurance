import { Header } from '@/components/layout/Header';
import { QuoteForm } from '@/features/quotes';
import type { InsuranceType } from '@/features/quotes/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function NewQuoteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ productId?: string; type?: string }>();

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('quotes.getQuote')} showNotifications={true} />
      <QuoteForm
        productId={params.productId}
        preSelectedType={params.type as InsuranceType}
        onSuccess={(quoteId) => {
          router.push(`/quotes/${quoteId}` as any);
        }}
        onCancel={() => {
          router.back();
        }}
      />
    </View>
  );
}

