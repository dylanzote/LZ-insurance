import { useTheme } from '@/core/theme/useTheme';
import { Calendar } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// Avoid top-level import: @react-native-community/datetimepicker requires native RNCDatePicker.
// If the native module isn't in the binary (e.g. Expo Go, or dev build before prebuild), the app
// would crash on load. We require it only when opening the picker and fall back to a text input.

interface DatePickerInputProps {
  label?: string;
  error?: FieldError;
  control: any;
  name: string;
  style?: ViewStyle;
  placeholder?: string;
}

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

function parseYyyyMmDd(s: string): Date | null {
  if (!YYYY_MM_DD.test(s)) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  error,
  control,
  name,
  style,
  placeholder = 'Select date',
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [fallbackText, setFallbackText] = useState('');
  const nativePickerRef = useRef<React.ComponentType<any> | null | undefined>(undefined);

  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const tryLoadNativePicker = useCallback((): boolean => {
    if (nativePickerRef.current !== undefined && nativePickerRef.current !== null) return true;
    if (nativePickerRef.current === null) return false; // already tried and failed
    try {
      const D = require('@react-native-community/datetimepicker').default;
      nativePickerRef.current = D;
      return true;
    } catch {
      nativePickerRef.current = null;
      return false;
    }
  }, []);

  const handleOpenPicker = useCallback((value: string, onChange: (v: string) => void) => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) setTempDate(d);
    } else {
      setTempDate(new Date());
    }
    setFallbackText(value || '');
    if (tryLoadNativePicker()) {
      setShowPicker(true);
      setShowFallback(false);
    } else {
      setShowFallback(true);
      setShowPicker(false);
    }
  }, [tryLoadNativePicker]);

  const handleFallbackDone = useCallback((onChange: (v: string) => void) => {
    const t = fallbackText.trim();
    const d = parseYyyyMmDd(t);
    if (d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      onChange(`${y}-${m}-${day}`);
    }
    setShowFallback(false);
  }, [fallbackText]);

  const NativePicker = nativePickerRef.current;

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
        render={({ field: { onChange, value } }) => {
          const displayValue = value ? formatDisplayDate(value) : '';

          return (
            <>
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: error ? theme.colors.error : theme.colors.border,
                    borderWidth: error ? 2 : 1,
                  },
                ]}
                onPress={() => handleOpenPicker(value || '', onChange)}
                accessibilityLabel={label || name}
                accessibilityHint={error?.message}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.inputText,
                    {
                      color: displayValue ? theme.colors.text : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {displayValue || placeholder}
                </Text>
                <Calendar size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>

              {/* Native DateTimePicker (only when module is available) */}
              {NativePicker && showPicker && (
                Platform.OS === 'ios' ? (
                  <Modal
                    visible={true}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPicker(false)}
                  >
                    <Pressable
                      style={styles.modalOverlay}
                      onPress={() => setShowPicker(false)}
                    >
                      <View
                        style={[styles.modalContent, { backgroundColor: theme.colors.background }]}
                      >
                        <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                          <TouchableOpacity onPress={() => setShowPicker(false)}>
                            <Text style={[styles.modalButton, { color: theme.colors.error }]}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              const year = tempDate.getFullYear();
                              const month = String(tempDate.getMonth() + 1).padStart(2, '0');
                              const day = String(tempDate.getDate()).padStart(2, '0');
                              onChange(`${year}-${month}-${day}`);
                              setShowPicker(false);
                            }}
                          >
                            <Text style={[styles.modalButton, { color: theme.colors.primary }]}>
                              Done
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <NativePicker
                          value={tempDate}
                          mode="date"
                          display="spinner"
                          onChange={(_: any, selectedDate?: Date) => {
                            if (selectedDate) setTempDate(selectedDate);
                          }}
                          maximumDate={new Date()}
                          minimumDate={new Date(1900, 0, 1)}
                        />
                      </View>
                    </Pressable>
                  </Modal>
                ) : (
                  <NativePicker
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={(event: { type: string }, selectedDate?: Date) => {
                      setShowPicker(false);
                      if (event.type === 'set' && selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        onChange(`${year}-${month}-${day}`);
                      }
                    }}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                  />
                )
              )}

              {/* Fallback when native RNCDatePicker is not in the binary */}
              {showFallback && (
                <Modal
                  visible={true}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowFallback(false)}
                >
                  <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowFallback(false)}
                  >
                    <View
                      style={[styles.modalContent, styles.fallbackModal, { backgroundColor: theme.colors.background }]}
                      onStartShouldSetResponder={() => true}
                    >
                      <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.modalButton, { color: theme.colors.text }]}>
                          Date of birth
                        </Text>
                      </View>
                      <Text style={[styles.fallbackHint, { color: theme.colors.textSecondary }]}>
                        Enter as YYYY-MM-DD (e.g. 1990-01-15)
                      </Text>
                      <TextInput
                        style={[
                          styles.fallbackInput,
                          {
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          },
                        ]}
                        placeholder="1990-01-15"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={fallbackText}
                        onChangeText={setFallbackText}
                        keyboardType="numbers-and-punctuation"
                        autoCapitalize="none"
                        maxLength={10}
                      />
                      <View style={styles.fallbackActions}>
                        <TouchableOpacity
                          onPress={() => setShowFallback(false)}
                          style={[styles.fallbackBtn, { borderColor: theme.colors.border }]}
                        >
                          <Text style={{ color: theme.colors.text }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleFallbackDone(onChange)}
                          style={[styles.fallbackBtn, { backgroundColor: theme.colors.primary }]}
                        >
                          <Text style={{ color: '#fff', fontWeight: '600' }}>Set</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Pressable>
                </Modal>
              )}
            </>
          );
        }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalButton: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  fallbackModal: {
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 20,
    borderRadius: 12,
  },
  fallbackHint: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 12,
  },
  fallbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  fallbackActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  fallbackBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
