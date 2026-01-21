// import { Card } from '@/components/ui/Card';
// import { Text } from '@/components/ui/Text';
// import { Badge } from '@/components/ui/Badge';
// import { createThemedStyles } from '@/core/theme/createThemedStyles';
// import { useTranslation } from '@/hooks/useTranslation';
// import { Policy } from '@/features/policies/types';
// import React from 'react';
// import { TouchableOpacity, View } from 'react-native';
// import { Calendar, MapPin, Car, Home, Shield, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react-native';

// interface PolicyCoverageCardProps {
//   policy: Policy;
//   onPress: () => void;
// }

// const useStyles = createThemedStyles((theme) => ({
//   card: {
//     marginBottom: 16,
//     padding: 20,
//     borderRadius: 16,
//     overflow: 'hidden' as const,
//   } as const,
//   statusIndicator: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 4,
//   } as const,
//   statusActive: {
//     backgroundColor: '#10b981',
//   } as const,
//   statusPending: {
//     backgroundColor: '#f59e0b',
//   } as const,
//   statusExpired: {
//     backgroundColor: '#ef4444',
//   } as const,
//   statusCancelled: {
//     backgroundColor: '#6b7280',
//   } as const,
//   header: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'flex-start' as const,
//     marginBottom: 16,
//     marginTop: 4,
//   } as const,
//   leftSection: {
//     flex: 1,
//   } as const,
//   typeRow: {
//     flexDirection: 'row' as const,
//     alignItems: 'center' as const,
//     marginBottom: 8,
//   } as const,
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     backgroundColor: theme.colors.primaryLight,
//     justifyContent: 'center' as const,
//     alignItems: 'center' as const,
//     marginRight: 12,
//   } as const,
//   policyTypeContainer: {
//     flex: 1,
//   } as const,
//   policyType: {
//     fontSize: 18,
//     fontWeight: '700' as const,
//     color: theme.colors.text,
//     marginBottom: 4,
//   } as const,
//   policyId: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     fontFamily: 'monospace',
//   } as const,
//   statusBadgeContainer: {
//     flexDirection: 'row' as const,
//     alignItems: 'center' as const,
//     gap: 6,
//   } as const,
//   statusIcon: {
//     marginRight: 4,
//   } as const,
//   detailsSection: {
//     marginBottom: 16,
//     paddingLeft: 60,
//   } as const,
//   detailsRow: {
//     flexDirection: 'row' as const,
//     alignItems: 'flex-start' as const,
//     marginBottom: 10,
//   } as const,
//   detailIcon: {
//     marginRight: 10,
//     marginTop: 2,
//   } as const,
//   detailContent: {
//     flex: 1,
//   } as const,
//   detailLabel: {
//     fontSize: 11,
//     color: theme.colors.textSecondary,
//     marginBottom: 2,
//     textTransform: 'uppercase' as const,
//     letterSpacing: 0.5,
//     fontWeight: '600' as const,
//   } as const,
//   detailText: {
//     fontSize: 15,
//     color: theme.colors.text,
//     fontWeight: '500' as const,
//     lineHeight: 20,
//   } as const,
//   footer: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'center' as const,
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.border,
//   } as const,
//   expiryInfo: {
//     flexDirection: 'row' as const,
//     alignItems: 'center' as const,
//     flex: 1,
//   } as const,
//   expiryText: {
//     fontSize: 13,
//     color: theme.colors.textSecondary,
//     marginLeft: 8,
//     fontWeight: '500' as const,
//   } as const,
//   coverageSection: {
//     alignItems: 'flex-end' as const,
//   } as const,
//   coverageLabel: {
//     fontSize: 11,
//     color: theme.colors.textSecondary,
//     marginBottom: 4,
//     textTransform: 'uppercase' as const,
//     letterSpacing: 0.5,
//     fontWeight: '600' as const,
//   } as const,
//   coverageAmount: {
//     fontSize: 22,
//     fontWeight: '700' as const,
//     color: theme.colors.primary,
//   } as const,
// }));

// export const PolicyCoverageCard: React.FC<PolicyCoverageCardProps> = ({
//   policy,
//   onPress,
// }) => {
//   const styles = useStyles();
//   const { t, locale } = useTranslation();

//   // Ensure coverageAmount is a number, not an object
//   const coverageAmount = typeof policy.coverageAmount === 'number' 
//     ? policy.coverageAmount 
//     : typeof policy.coverageAmount === 'string'
//     ? parseFloat(policy.coverageAmount) || 0
//     : 0;

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' => {
//     switch (status) {
//       case 'active':
//         return 'success';
//       case 'pending':
//         return 'warning';
//       case 'expired':
//         return 'error';
//       default:
//         return 'info';
//     }
//   };

//   const getStatusIndicatorStyle = () => {
//     switch (policy.status) {
//       case 'active':
//         return styles.statusActive;
//       case 'pending':
//         return styles.statusPending;
//       case 'expired':
//         return styles.statusExpired;
//       case 'cancelled':
//         return styles.statusCancelled;
//       default:
//         return styles.statusActive;
//     }
//   };

//   const getStatusIcon = () => {
//     const iconSize = 14;
//     const iconColor = policy.status === 'active' ? '#10b981' : 
//                      policy.status === 'pending' ? '#f59e0b' : 
//                      policy.status === 'expired' ? '#ef4444' : '#6b7280';
    
//     switch (policy.status) {
//       case 'active':
//         return <CheckCircle2 size={iconSize} color={iconColor} />;
//       case 'pending':
//         return <Clock size={iconSize} color={iconColor} />;
//       case 'expired':
//         return <XCircle size={iconSize} color={iconColor} />;
//       case 'cancelled':
//         return <AlertCircle size={iconSize} color={iconColor} />;
//       default:
//         return <CheckCircle2 size={iconSize} color={iconColor} />;
//     }
//   };

//   const getTypeIcon = () => {
//     if (policy.type === 'auto') {
//       return policy.vehicleDetails?.type === 'motorcycle' ? '🏍️' : '🚗';
//     }
//     if (policy.type === 'home') return '🏠';
//     if (policy.type === 'life') return '🛡️';
//     if (policy.type === 'health') return '🏥';
//     return '📄';
//   };

//   const getTypeIconComponent = () => {
//     const iconSize = 24;
//     const iconColor = '#3b82f6';
    
//     if (policy.type === 'auto') {
//       return <Car size={iconSize} color={iconColor} />;
//     }
//     if (policy.type === 'home') return <Home size={iconSize} color={iconColor} />;
//     if (policy.type === 'life') return <Shield size={iconSize} color={iconColor} />;
//     if (policy.type === 'health') return <Shield size={iconSize} color={iconColor} />;
//     return <Shield size={iconSize} color={iconColor} />;
//   };

//   const renderVehicleDetails = () => {
//     if (!policy.vehicleDetails) {
//       return policy.vehicle ? (
//         <View style={styles.detailsRow}>
//           <Car size={18} color={styles.detailText.color as string} style={styles.detailIcon} />
//           <View style={styles.detailContent}>
//             <Text variant="caption" style={styles.detailLabel}>{String(t('dashboard.vehicle'))}</Text>
//             <Text variant="body" style={styles.detailText}>{String(policy.vehicle || '')}</Text>
//           </View>
//         </View>
//       ) : null;
//     }

//     const { make, model, year, type } = policy.vehicleDetails;
//     const vehicleType = type === 'motorcycle' ? String(t('dashboard.motorcycle')) : String(t('dashboard.vehicle'));
    
//     return (
//       <View style={styles.detailsRow}>
//         <Car size={18} color={styles.detailText.color as string} style={styles.detailIcon} />
//         <View style={styles.detailContent}>
//           <Text variant="caption" style={styles.detailLabel}>{vehicleType}</Text>
//           <Text variant="body" style={styles.detailText}>
//             {String(make)} {String(model)} {String(year)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderPropertyDetails = () => {
//     if (!policy.propertyDetails) {
//       return policy.property ? (
//         <View style={styles.detailsRow}>
//           <MapPin size={18} color={styles.detailText.color as string} style={styles.detailIcon} />
//           <View style={styles.detailContent}>
//             <Text variant="caption" style={styles.detailLabel}>{String(t('policies.property'))}</Text>
//             <Text variant="body" style={styles.detailText} numberOfLines={2}>{String(policy.property || '')}</Text>
//           </View>
//         </View>
//       ) : null;
//     }

//     const { address, city, state, zipCode } = policy.propertyDetails;
//     const fullAddress = [address, city, state, zipCode].filter(Boolean).join(', ');
    
//     return (
//       <View style={styles.detailsRow}>
//         <MapPin size={18} color={styles.detailText.color as string} style={styles.detailIcon} />
//         <View style={styles.detailContent}>
//           <Text variant="caption" style={styles.detailLabel}>{String(t('policies.property'))}</Text>
//           <Text variant="body" style={styles.detailText} numberOfLines={2}>
//             {String(fullAddress)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
//       <Card variant="elevated" style={styles.card}>
//         {/* Status Indicator Bar */}
//         <View style={[styles.statusIndicator, getStatusIndicatorStyle()]} />

//         <View style={styles.header}>
//           <View style={styles.typeRow}>
//             <View style={styles.iconContainer}>
//               {getTypeIconComponent()}
//             </View>
//             <View style={styles.policyTypeContainer}>
//               <Text variant="h3" style={styles.policyType}>
//                 {String(t(`policies.types.${policy.type}`))}
//               </Text>
//               <Text variant="caption" style={styles.policyId}>
//                 {t('dashboard.policyId')}: {String(policy.id)}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.statusBadgeContainer}>
//             {getStatusIcon()}
//             <Badge 
//               variant={getStatusVariant(policy.status)}
//               label={String(t(`policies.status.${policy.status}`))}
//             />
//           </View>
//         </View>

//         <View style={styles.detailsSection}>
//           {policy.type === 'auto' && renderVehicleDetails()}
//           {policy.type === 'home' && renderPropertyDetails()}
//         </View>

//         <View style={styles.footer}>
//           <View style={styles.expiryInfo}>
//             <Calendar size={16} color={styles.expiryText.color as string} />
//             <Text variant="bodySmall" style={styles.expiryText}>
//               {String(t('dashboard.expiresOn'))} {formatDate(policy.endDate)}
//             </Text>
//           </View>
//           <View style={styles.coverageSection}>
//             <Text variant="caption" style={styles.coverageLabel}>{String(t('policies.coverage'))}</Text>
//             <Text variant="h2" style={styles.coverageAmount}>
//               ${coverageAmount.toLocaleString()}
//             </Text>
//           </View>
//         </View>
//       </Card>
//     </TouchableOpacity>
//   );
// };


import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Policy } from '@/features/policies/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { AlertCircle, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface PolicyCoverageCardProps {
  policy: Policy;
  onPress: () => void;
}

const useStyles = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as const,
  coverageHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 16,
  } as const,
  coverageType: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  coverageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: theme.colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as const,
  coverageTextContainer: {
    flex: 1,
  } as const,
  coverageTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: 4,
  } as const,
  policyDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as const,
  coverageAmount: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: theme.colors.primary,
    textAlign: 'right' as const,
  } as const,
  coverageDetails: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  policyInfo: {
    flex: 1,
  } as const,
  policyNumber: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 4,
  } as const,
  vehicleInfo: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500' as const,
  } as const,
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  } as const,
  statusIcon: {
    marginRight: 4,
  } as const,
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as const,
  expiryInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  expiryText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500' as const,
  } as const,
  statusBadge: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.success,
    backgroundColor: `${theme.colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  } as const,
  // Status-specific styles
  statusActive: {
    color: '#10b981',
    backgroundColor: '#10b98115',
  } as const,
  statusPending: {
    color: '#f59e0b',
    backgroundColor: '#f59e0b15',
  } as const,
  statusExpired: {
    color: '#ef4444',
    backgroundColor: '#ef444415',
  } as const,
  statusCancelled: {
    color: '#6b7280',
    backgroundColor: '#6b728015',
  } as const,
}));

// Helper functions
const getPolicyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto': return 'car-sport';
    case 'home': return 'home';
    case 'life': return 'person';
    default: return 'shield-checkmark';
  }
};

const getPolicyColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto': return '#FF6B6B';
    case 'home': return '#4ECDC4';
    case 'life': return '#45B7D1';
    default: return '#96CEB4';
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active': return 'statusActive';
    case 'pending': return 'statusPending';
    case 'expired': return 'statusExpired';
    case 'cancelled': return 'statusCancelled';
    default: return 'statusActive';
  }
};

const getStatusIcon = (status: string) => {
  const iconSize = 14;
  const iconColor = status === 'active' ? '#10b981' : 
                   status === 'pending' ? '#f59e0b' : 
                   status === 'expired' ? '#ef4444' : '#6b7280';
  
  switch (status) {
    case 'active':
      return <CheckCircle2 size={iconSize} color={iconColor} />;
    case 'pending':
      return <Clock size={iconSize} color={iconColor} />;
    case 'expired':
      return <XCircle size={iconSize} color={iconColor} />;
    case 'cancelled':
      return <AlertCircle size={iconSize} color={iconColor} />;
    default:
      return <CheckCircle2 size={iconSize} color={iconColor} />;
  }
};

const getDisplayText = (policy: Policy) => {
  if (policy.type === 'auto' && policy.vehicleDetails) {
    const { make, model, year } = policy.vehicleDetails;
    return `${make} ${model} ${year}`;
  }
  if (policy.type === 'home' && policy.propertyDetails) {
    const { address } = policy.propertyDetails;
    return address || 'Property';
  }
  return policy.vehicle || policy.property || 'Primary Policy';
};

export const PolicyCoverageCard: React.FC<PolicyCoverageCardProps> = ({
  policy,
  onPress,
}) => {
  const styles = useStyles();
  const { t, locale } = useTranslation();

  // Ensure coverageAmount is a number
  const coverageAmount = typeof policy.coverageAmount === 'number' 
    ? policy.coverageAmount 
    : typeof policy.coverageAmount === 'string'
    ? parseFloat(policy.coverageAmount) || 0
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        {/* Header with Icon, Title, and Coverage Amount */}
        <View style={styles.coverageHeader}>
          <View style={styles.coverageType}>
            <View 
              style={[
                styles.coverageIcon, 
                { backgroundColor: getPolicyColor(policy.type) }
              ]}
            >
              <Ionicons 
                name={getPolicyIcon(policy.type)} 
                size={24} 
                color="white" 
              />
            </View>
            <View style={styles.coverageTextContainer}>
              <Text style={styles.coverageTitle}>
                {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
              </Text>
              <Text style={styles.policyDetails}>
                {getDisplayText(policy)}
              </Text>
            </View>
          </View>
          <Text style={styles.coverageAmount}>
            ${coverageAmount.toLocaleString()}
          </Text>
        </View>

        {/* Policy Details and Status */}
        <View style={styles.coverageDetails}>
          <View style={styles.policyInfo}>
            <Text style={styles.policyNumber}>
              Policy #: {policy.id}
            </Text>
            <Text style={styles.vehicleInfo}>
              {policy.type === 'auto' ? 'Vehicle' : 'Property'} • Active
            </Text>
          </View>
          <View style={styles.statusContainer}>
            {getStatusIcon(policy.status)}
            <Text style={[styles.statusBadge, styles[getStatusStyle(policy.status)]]}>
              {t(`policies.${policy.status}`)}
            </Text>
          </View>
        </View>

        {/* Footer with Expiry Info */}
        <View style={styles.footer}>
          <View style={styles.expiryInfo}>
            <Calendar size={16} color={styles.expiryText.color as string} />
            <Text style={styles.expiryText}>
              Expires {formatDate(policy.endDate)}
            </Text>
          </View>
          <Text style={[styles.statusBadge, styles.statusActive]}>
            Covered
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};