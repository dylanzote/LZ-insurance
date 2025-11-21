import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, X } from 'lucide-react-native';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

interface DatePickerFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  onSelect: (date: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
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
  dateButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 48,
  } as const,
  dateText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  } as const,
  placeholderText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    flex: 1,
  } as const,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
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
  dateSelector: {
    flexDirection: 'row' as const,
    padding: 20,
    gap: 12,
  } as const,
  dateColumn: {
    flex: 1,
  } as const,
  columnTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600' as const,
  } as const,
  dateOption: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    alignItems: 'center' as const,
  } as const,
  dateOptionSelected: {
    backgroundColor: theme.colors.primaryLight + '20',
  } as const,
  dateOptionText: {
    fontSize: 14,
    color: theme.colors.text,
  } as const,
  dateOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  } as const,
  doneButton: {
    margin: 20,
    padding: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    alignItems: 'center' as const,
  } as const,
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  } as const,
}));

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  placeholder,
  onSelect,
  minimumDate,
  maximumDate,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  
  const today = minimumDate || new Date();
  const maxDate = maximumDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const handleDateSelect = () => {
    const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const isoString = date.toISOString().split('T')[0];
    onSelect(isoString);
    setShowPicker(false);
  };

  const displayValue = value ? formatDate(new Date(value)) : placeholder;

  const years = Array.from({ length: maxDate.getFullYear() - today.getFullYear() + 1 }, (_, i) => today.getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getAvailableDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Filter out past dates if selecting current month/year
    if (selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1) {
      return days.filter(day => day >= today.getDate());
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Calendar size={20} color={theme.colors.textSecondary} style={{ marginRight: 12 }} />
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {displayValue}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateSelector}>
              <View style={styles.dateColumn}>
                <Text style={styles.columnTitle}>Year</Text>
                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.dateOption,
                        selectedYear === year && styles.dateOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedYear(year);
                        const days = getDaysInMonth(selectedMonth, year);
                        if (selectedDay > days) {
                          setSelectedDay(days);
                        }
                      }}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedYear === year && styles.dateOptionTextSelected,
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.columnTitle}>Month</Text>
                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.dateOption,
                        selectedMonth === month && styles.dateOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(month);
                        const days = getDaysInMonth(month, selectedYear);
                        if (selectedDay > days) {
                          setSelectedDay(days);
                        }
                      }}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedMonth === month && styles.dateOptionTextSelected,
                      ]}>
                        {monthNames[month - 1]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.columnTitle}>Day</Text>
                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                  {getAvailableDays().map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dateOption,
                        selectedDay === day && styles.dateOptionSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedDay === day && styles.dateOptionTextSelected,
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <TouchableOpacity style={styles.doneButton} onPress={handleDateSelect}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>
    </View>
  );
};
