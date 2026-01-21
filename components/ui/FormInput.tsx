import { useTheme } from '@/core/theme/useTheme';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

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
  secureTextEntry,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                isPasswordField && styles.inputWithIcon,
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
              secureTextEntry={isPasswordField && !isPasswordVisible}
              {...props}
            />
          )}
        />
        
        {isPasswordField && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
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
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: 40,
    height: '100%',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});