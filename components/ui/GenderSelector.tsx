import { useTheme } from '@/core/theme/useTheme';
import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface GenderSelectorProps {
  label?: string;
  error?: FieldError;
  control: any;
  name: string;
  style?: ViewStyle;
}

const GENDERS = [
  { value: 'MALE', label: 'Male', icon: '👨' },
  { value: 'FEMALE', label: 'Female', icon: '👩' },
  { value: 'OTHER', label: 'Other', icon: '⚧' },
];

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  label,
  error,
  control,
  name,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={styles.optionsContainer}>
            {GENDERS.map((gender) => {
              const isSelected = value === gender.value;
              return (
                <TouchableOpacity
                  key={gender.value}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary + '15'
                        : theme.colors.card,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : error
                        ? theme.colors.error
                        : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => onChange(gender.value)}
                  accessibilityRole="button"
                  accessibilityLabel={gender.label}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.icon}>{gender.icon}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? theme.colors.primary : theme.colors.text,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {gender.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {error && error.message && (
        <Text
          style={[styles.error, { color: theme.colors.error }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {String(error.message)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
