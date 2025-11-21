import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

interface SelectFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onSelect: (value: string) => void;
  tipTitle?: string;
  tipContent?: React.ReactNode;
  showTip?: boolean;
  onTipPress?: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    marginBottom: 16,
  } as const,
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  selectButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 48,
  } as const,
  selectText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  } as const,
  placeholderText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    flex: 1,
  } as const,
  tipButton: {
    marginTop: 4,
    paddingVertical: 4,
  } as const,
  tipText: {
    fontSize: 12,
    color: theme.colors.primary,
    textDecorationLine: 'underline' as const,
  } as const,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  } as const,
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
  } as const,
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  } as const,
}));

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  tipTitle,
  tipContent,
  showTip = false,
  onTipPress,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.selectText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      {showTip && onTipPress && (
        <TouchableOpacity style={styles.tipButton} onPress={onTipPress}>
          <Text style={styles.tipText}>ℹ️ {tipTitle || 'Learn more'}</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </Card>
        </View>
      </Modal>
    </View>
  );
};

