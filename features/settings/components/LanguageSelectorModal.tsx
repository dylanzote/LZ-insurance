import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Globe, X, Check } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (locale: 'en' | 'fr') => void;
}

const useStyles = createThemedStyles((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: theme.spacing.lg,
  } as const,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  content: {
    padding: theme.spacing.lg,
  } as const,
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  optionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  } as const,
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  } as const,
  optionContent: {
    flex: 1,
  } as const,
  optionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  } as const,
  checkIcon: {
    marginLeft: 8,
  } as const,
}));

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const languages = [
    { value: 'en' as const, label: 'English', nativeLabel: 'English' },
    { value: 'fr' as const, label: 'French', nativeLabel: 'Français' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Card variant="elevated" style={styles.modalContent}>
          <View style={styles.header}>
            <Text variant="h3" weight="bold" style={styles.headerTitle}>
              {t('settings.appearance.selectLanguage')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <X size={20} color={styles.headerTitle.color} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {languages.map((lang) => {
              const isActive = locale === lang.value;
              return (
                <TouchableOpacity
                  key={lang.value}
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={() => {
                    onSelect(lang.value);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIcon}>
                    <Globe size={20} color={styles.optionLabel.color} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text variant="body" weight="semibold" style={styles.optionLabel}>
                      {lang.nativeLabel}
                    </Text>
                  </View>
                  {isActive && (
                    <Check size={20} color={styles.optionLabel.color} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      </View>
    </Modal>
  );
};

