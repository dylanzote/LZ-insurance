import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { faqsData } from '../data/faqs';
import type { FAQCategory } from '../types';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: theme.spacing.md,
  } as const,
  searchContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  searchInput: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  searchIcon: {
    marginRight: theme.spacing.sm,
  } as const,
  searchText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  } as const,
  categoriesContainer: {
    marginBottom: theme.spacing.md,
  } as const,
  categoriesScroll: {
    paddingVertical: theme.spacing.xs,
  } as const,
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  } as const,
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  categoryText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
  } as const,
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
  } as const,
  faqCard: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    overflow: 'hidden' as const,
  } as const,
  faqHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    padding: theme.spacing.md,
  } as const,
  faqQuestion: {
    flex: 1,
    marginRight: theme.spacing.sm,
  } as const,
  faqAnswer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: 0,
  } as const,
  emptyState: {
    alignItems: 'center' as const,
    padding: theme.spacing.xl,
  } as const,
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
}));

export const FAQsScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = ['all', 'claims', 'policies', 'driving', 'coverage', 'billing', 'account', 'general'];

  const filteredFAQs = useMemo(() => {
    let filtered = faqsData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const toggleFAQ = (id: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFAQs(newExpanded);
  };

  return (
    <View style={styles.container}>
      <Header title={t('support.faqs.title')} showNotifications={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Search size={20} color={styles.searchText.color} style={styles.searchIcon} />
              <TextInput
                style={styles.searchText}
                placeholder={t('support.faqs.searchPlaceholder')}
                placeholderTextColor={styles.searchText.color + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="bodySmall"
                      weight={isActive ? 'semibold' : 'medium'}
                      style={[styles.categoryText, isActive && styles.categoryTextActive]}
                    >
                      {t(`support.faqs.categories.${category}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* FAQs List */}
          {filteredFAQs.length === 0 ? (
            <Card variant="outlined" padding="lg" style={styles.emptyState}>
              <Text variant="body" style={styles.emptyText}>
                {t('support.faqs.noResults')}
              </Text>
            </Card>
          ) : (
            filteredFAQs.map((faq) => {
              const isExpanded = expandedFAQs.has(faq.id);
              return (
                <Card
                  key={faq.id}
                  variant="elevated"
                  padding="none"
                  style={styles.faqCard}
                >
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFAQ(faq.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqQuestion}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                        {faq.question}
                      </Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={20} color={styles.categoryText.color} />
                    ) : (
                      <ChevronDown size={20} color={styles.categoryText.color} />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <Text variant="bodySmall" style={{ color: styles.categoryText.color, lineHeight: 22 }}>
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

