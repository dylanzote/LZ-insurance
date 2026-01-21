import { FeedbackScreen } from '@/features/feedback';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { View, Text } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function FeedbackPage() {
  const { t } = useTranslation();
  
  return (
    <FeatureGate
      feature="feedback"
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>
            {t('common.featureUnavailable') || 'This feature is currently unavailable.'}
          </Text>
        </View>
      }
    >
      <FeedbackScreen />
    </FeatureGate>
  );
}

