import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/core/theme/useTheme';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useClaims } from '../hooks/useClaims';
import { Claim, ClaimStatus } from '../types';
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  User,
  Shield,
  AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  content: {
    padding: isTablet ? 24 : 16,
  } as const,
  headerCard: {
    marginBottom: 20,
    padding: 20,
  } as const,
  statusRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 8,
  } as const,
  section: {
    marginBottom: 24,
  } as const,
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
  } as const,
  infoCard: {
    padding: 16,
    marginBottom: 12,
  } as const,
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  infoIcon: {
    marginRight: 12,
  } as const,
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as const,
  infoValue: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: theme.colors.text,
    flex: 1,
  } as const,
  description: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  } as const,
  timelineContainer: {
    marginTop: 8,
  } as const,
  timelineItem: {
    flexDirection: 'row' as const,
    marginBottom: 20,
    position: 'relative' as const,
  } as const,
  timelineLine: {
    position: 'absolute' as const,
    left: 15,
    top: 40,
    bottom: -20,
    width: 2,
    backgroundColor: theme.colors.border,
  } as const,
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 16,
    zIndex: 1,
  } as const,
  timelineIconActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as const,
  timelineIconCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  } as const,
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  } as const,
  timelineStatus: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  timelineDate: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as const,
  timelineDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as const,
  imagesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginTop: 12,
  } as const,
  imageItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.surface,
  } as const,
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  } as const,
  documentsList: {
    marginTop: 12,
    gap: 8,
  } as const,
  documentItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  } as const,
  documentName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  documentSize: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  emptyState: {
    padding: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 8,
  } as const,
}));

export const ClaimDetailScreen: React.FC = () => {
  const styles = useStyles();
  const { t, locale } = useTranslation();
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { claims, loading, refetch } = useClaims();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const claim = claims.find((c: Claim) => c.id === id);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: ClaimStatus): string => {
    switch (status) {
      case 'submitted':
        return '#f59e0b';
      case 'document-verification':
        return '#3b82f6';
      case 'surveyor-assigned':
        return '#8b5cf6';
      case 'assessment':
        return '#ec4899';
      case 'settlement':
        return '#10b981';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusOrder = (status: ClaimStatus): number => {
    const order: Record<ClaimStatus, number> = {
      'submitted': 1,
      'document-verification': 2,
      'surveyor-assigned': 3,
      'assessment': 4,
      'settlement': 5,
      'approved': 6,
      'rejected': 0,
      'processing': 0,
      'in-review': 0,
    };
    return order[status] || 0;
  };

  const getTimelineIcon = (status: ClaimStatus, currentStatus: ClaimStatus, index: number, total: number) => {
    const statusOrder = getStatusOrder(status);
    const currentOrder = getStatusOrder(currentStatus);
    
    if (statusOrder < currentOrder) {
      return <CheckCircle size={18} color="#ffffff" />;
    } else if (statusOrder === currentOrder) {
      return <Clock size={18} color="#ffffff" />;
    } else {
      return <Clock size={18} color={theme.colors.textSecondary} />;
    }
  };

  if (loading && !claim) {
    return (
      <View style={styles.container}>
        <Header title={t('claims.details.title')} showNotifications={true} />
        <LoadingSpinner message={t('common.loading')} />
      </View>
    );
  }

  if (!claim) {
    return (
      <View style={styles.container}>
        <Header title={t('claims.details.title')} showNotifications={true} />
        <View style={styles.emptyState}>
          <AlertCircle size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>{t('claims.details.notFound')}</Text>
        </View>
      </View>
    );
  }

  const timeline = claim.timeline || [];
  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <View style={styles.container}>
      <Header title={t('claims.details.title')} showNotifications={true} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.statusRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{claim.title}</Text>
              <Badge
                variant={
                  claim.status === 'approved' || claim.status === 'settlement'
                    ? 'success'
                    : claim.status === 'rejected'
                    ? 'error'
                    : 'info'
                }
              >
                {t(`claims.status.${claim.status}`)}
              </Badge>
            </View>
          </View>
        </Card>

        {/* Claim Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('claims.details.information')}</Text>
          
          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Shield size={20} color={theme.colors.primary} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{t('claims.details.policyType')}</Text>
                <Text style={styles.infoValue}>
                  {t(`policies.types.${claim.policyType}`)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={20} color={theme.colors.primary} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{t('claims.details.incidentDate')}</Text>
                <Text style={styles.infoValue}>{formatDate(claim.incidentDate)}</Text>
              </View>
            </View>

            {claim.location && (
              <View style={styles.infoRow}>
                <MapPin size={20} color={theme.colors.primary} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{t('claims.details.location')}</Text>
                  <Text style={styles.infoValue}>{claim.location}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <DollarSign size={20} color={theme.colors.primary} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{t('claims.details.amount')}</Text>
                <Text style={styles.infoValue}>
                  ${claim.amount.toLocaleString()}
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated" style={styles.infoCard}>
            <Text style={styles.infoLabel}>{t('claims.details.description')}</Text>
            <Text style={styles.description}>{claim.description}</Text>
          </Card>
        </View>

        {/* Timeline */}
        {sortedTimeline.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('claims.details.timeline')}</Text>
            <Card variant="elevated" style={styles.timelineContainer}>
              {sortedTimeline.map((event, index) => {
                const isLast = index === sortedTimeline.length - 1;
                const statusOrder = getStatusOrder(event.status);
                const currentOrder = getStatusOrder(claim.status);
                const isCompleted = statusOrder < currentOrder;
                const isActive = statusOrder === currentOrder;

                return (
                  <View key={event.id} style={styles.timelineItem}>
                    {!isLast && <View style={styles.timelineLine} />}
                    <View
                      style={[
                        styles.timelineIcon,
                        isCompleted && styles.timelineIconCompleted,
                        isActive && styles.timelineIconActive,
                      ]}
                    >
                      {getTimelineIcon(event.status, claim.status, index, sortedTimeline.length)}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStatus}>
                        {t(`claims.status.${event.status}`)}
                      </Text>
                      <Text style={styles.timelineDate}>
                        {formatDateTime(event.date)}
                      </Text>
                      {event.description && (
                        <Text style={styles.timelineDescription}>
                          {event.description}
                        </Text>
                      )}
                      {event.assignedTo && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <User size={14} color={theme.colors.textSecondary} />
                          <Text style={[styles.timelineDescription, { marginLeft: 6 }]}>
                            {t('claims.details.assignedTo')}: {event.assignedTo}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Images */}
        {claim.images && claim.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('claims.details.photos')} ({claim.images.length})
            </Text>
            <View style={styles.imagesGrid}>
              {claim.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageItem}
                  onPress={() => setSelectedImage(image.uri)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Documents */}
        {claim.documents && claim.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('claims.details.documents')} ({claim.documents.length})
            </Text>
            <View style={styles.documentsList}>
              {claim.documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <FileText size={24} color={theme.colors.primary} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    {doc.size && (
                      <Text style={styles.documentSize}>
                        {(doc.size / 1024).toFixed(2)} KB
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

