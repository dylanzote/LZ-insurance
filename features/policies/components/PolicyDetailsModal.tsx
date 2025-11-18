import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import type { Policy } from '../types';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  policy: Policy | null;
  visible: boolean;
  onClose: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
  },
}));

export const PolicyDetailsModal: React.FC<Props> = ({ policy, visible, onClose }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  if (!policy) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('policies.title')} Details
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/** each detail row **/}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Policy Type:</Text>
            <Text style={styles.value}>{policy.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{t(`policies.${policy.status}`)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Premium:</Text>
            <Text style={styles.value}>${policy.premium}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Coverage Amount:</Text>
            <Text style={styles.value}>${policy.coverageAmount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{policy.startDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{policy.endDate}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
