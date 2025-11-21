import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';
import { Controller, FieldError } from 'react-hook-form';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: FieldError;
  control: any;
  name: string;
  style?: ViewStyle;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  control,
  name,
  style,
  ...props
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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: error ? theme.colors.error : theme.colors.border,
                borderWidth: error ? 2 : 1,
                color: theme.colors.text,
              },
            ]}
            placeholderTextColor={theme.colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            accessibilityLabel={label || name}
            accessibilityHint={error?.message}
            accessibilityState={{ invalid: !!error }}
            accessibilityRole="text"
            {...props}
          />
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});