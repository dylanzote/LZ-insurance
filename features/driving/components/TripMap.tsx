import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle, CornerDownRight, ExternalLink, MapPin, Navigation, Smartphone, Zap } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Linking, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import type { TripData } from '../types';

interface TripMapProps {
  trip: TripData;
  showControls?: boolean;
  height?: number;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  event?: 'speeding' | 'hardBraking' | 'rapidAcceleration' | 'cornering' | 'phoneUsage';
  score?: number; // Performance score at this point (0-100)
}

const { width } = Dimensions.get('window');

const useStyles = createThemedStyles((theme) => ({
  container: {
    marginBottom: 16,
  } as const,
  mapContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    position: 'relative' as const,
  } as const,
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  } as const,
  mapOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
    padding: 20,
  } as const,
  mapPlaceholderText: {
    color: theme.colors.text,
    fontSize: 14,
    textAlign: 'center' as const,
    lineHeight: 20,
  } as const,
  controlsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    paddingHorizontal: 4,
  } as const,
  openMapsButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    gap: 6,
  } as const,
  openMapsText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  } as const,
  legendContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  } as const,
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  } as const,
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  } as const,
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  } as const,
  performanceIndicator: {
    position: 'absolute' as const,
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as const,
  performanceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  } as const,
  performanceScore: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  } as const,
  eventMarkersContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as const,
  eventMarker: {
    position: 'absolute' as const,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  } as const,
}));

// Generate route points between start and end (simplified - in production, use actual GPS points)
const generateRoutePoints = (trip: TripData): RoutePoint[] => {
  const points: RoutePoint[] = [];
  
  if (!trip.startLocation || !trip.endLocation) {
    return points;
  }

  // Generate intermediate points along the route
  const numPoints = Math.max(5, Math.floor(trip.distance / 2)); // More points for longer trips
  const latDiff = trip.endLocation.latitude - trip.startLocation.latitude;
  const lngDiff = trip.endLocation.longitude - trip.startLocation.longitude;

  // Add start point
  points.push({
    latitude: trip.startLocation.latitude,
    longitude: trip.startLocation.longitude,
    score: trip.score,
  });

  // Generate intermediate points with some variation to simulate actual route
  for (let i = 1; i < numPoints - 1; i++) {
    const progress = i / (numPoints - 1);
    const variation = (Math.sin(progress * Math.PI * 4) * 0.001); // Add slight curve
    
    points.push({
      latitude: trip.startLocation.latitude + (latDiff * progress) + variation,
      longitude: trip.startLocation.longitude + (lngDiff * progress) + variation,
      // Assign events to some points based on trip events
      event: i === Math.floor(numPoints * 0.3) && trip.events.speeding > 0 ? 'speeding' :
             i === Math.floor(numPoints * 0.5) && trip.events.hardBraking > 0 ? 'hardBraking' :
             i === Math.floor(numPoints * 0.7) && trip.events.rapidAcceleration > 0 ? 'rapidAcceleration' :
             i === Math.floor(numPoints * 0.6) && trip.events.cornering > 0 ? 'cornering' :
             i === Math.floor(numPoints * 0.4) && trip.events.phoneUsage > 0 ? 'phoneUsage' : undefined,
      score: trip.score + (Math.random() * 10 - 5), // Slight score variation
    });
  }

  // Add end point
  points.push({
    latitude: trip.endLocation.latitude,
    longitude: trip.endLocation.longitude,
    score: trip.score,
  });

  return points;
};

// Get Google Maps Static API URL
const getMapImageUrl = (routePoints: RoutePoint[], apiKey?: string): string => {
  if (routePoints.length < 2) {
    return '';
  }

  // For now, return empty string - Google Maps Static API requires API key
  // In production, this should be configured with a valid API key
  // For Expo Go, we'll show a placeholder with route information
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return ''; // Return empty to show placeholder
  }

  // Extract coordinates for path
  const pathCoords = routePoints.map(p => `${p.latitude},${p.longitude}`).join('|');
  
  // Markers for start (green), end (red), and events (yellow/orange)
  const markers: string[] = [];
  
  // Start marker (green)
  markers.push(`color:green|label:S|${routePoints[0].latitude},${routePoints[0].longitude}`);
  
  // Event markers
  routePoints.forEach((point, index) => {
    if (point.event && index > 0 && index < routePoints.length - 1) {
      const color = point.event === 'speeding' ? 'red' :
                    point.event === 'hardBraking' ? 'orange' :
                    point.event === 'rapidAcceleration' ? 'yellow' :
                    point.event === 'cornering' ? 'purple' : 'blue';
      markers.push(`color:${color}|${point.latitude},${point.longitude}`);
    }
  });
  
  // End marker (red)
  const lastPoint = routePoints[routePoints.length - 1];
  markers.push(`color:red|label:E|${lastPoint.latitude},${lastPoint.longitude}`);

  const markersParam = markers.join('&markers=');
  const size = `${width - 32}x${Math.floor((width - 32) * 0.6)}`;
  
  return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=color:0x0066cc|weight:5|${pathCoords}&markers=${markersParam}&key=${apiKey}`;
};

export const TripMap: React.FC<TripMapProps> = ({ 
  trip, 
  showControls = true, 
  height = 250 
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [mapImageLoading, setMapImageLoading] = useState(true);
  const [mapImageError, setMapImageError] = useState(false);

  const routePoints = useMemo(() => generateRoutePoints(trip), [trip]);
  const mapImageUrl = useMemo(() => {
    if (routePoints.length < 2) return '';
    // For now, always return empty since we don't have Google Maps API key
    // In production, pass actual API key: return getMapImageUrl(routePoints, GOOGLE_MAPS_API_KEY);
    return getMapImageUrl(routePoints);
  }, [routePoints]);

  const handleOpenInMaps = () => {
    if (!trip.startLocation || !trip.endLocation) return;

    const start = `${trip.startLocation.latitude},${trip.startLocation.longitude}`;
    const end = `${trip.endLocation.latitude},${trip.endLocation.longitude}`;

    if (Platform.OS === 'ios') {
      // Apple Maps
      Linking.openURL(`https://maps.apple.com/?saddr=${start}&daddr=${end}`);
    } else {
      // Google Maps
      Linking.openURL(`https://www.google.com/maps/dir/${start}/${end}`);
    }
  };

  const getEventColor = (event?: string): string => {
    switch (event) {
      case 'speeding':
        return '#ef4444'; // red
      case 'hardBraking':
        return '#f97316'; // orange
      case 'rapidAcceleration':
        return '#eab308'; // yellow
      case 'cornering':
        return '#a855f7'; // purple
      case 'phoneUsage':
        return '#3b82f6'; // blue
      default:
        return theme.colors.primary;
    }
  };

  const getEventIcon = (event?: string) => {
    switch (event) {
      case 'speeding':
        return Navigation;
      case 'hardBraking':
        return AlertCircle;
      case 'rapidAcceleration':
        return Zap;
      case 'cornering':
        return CornerDownRight;
      case 'phoneUsage':
        return Smartphone;
      default:
        return MapPin;
    }
  };

  const getEventLabel = (event?: string): string => {
    if (!event) return '';
    switch (event) {
      case 'speeding':
        return t('driving.trends.speeding');
      case 'hardBraking':
        return t('driving.trends.braking');
      case 'rapidAcceleration':
        return t('driving.trends.acceleration');
      case 'cornering':
        return t('driving.calculationModal.factors.cornering');
      case 'phoneUsage':
        return t('driving.calculationModal.factors.distractions');
      default:
        return '';
    }
  };

  const hasEvents = routePoints.some(p => p.event);

  if (!trip.startLocation || !trip.endLocation) {
    return (
      <Card variant="elevated" style={styles.container}>
        <View style={[styles.mapPlaceholder, { height }]}>
          <MapPin size={32} color={theme.colors.textSecondary} />
          <Text variant="body" style={styles.mapPlaceholderText}>
            {t('driving.map.noLocationData')}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={[styles.mapContainer, { height }]}>
        {mapImageUrl && !mapImageError ? (
          <>
            <Image
              source={{ uri: mapImageUrl }}
              style={styles.mapImage}
              onLoadStart={() => setMapImageLoading(true)}
              onLoadEnd={() => setMapImageLoading(false)}
              onError={() => {
                setMapImageError(true);
                setMapImageLoading(false);
              }}
            />
            {mapImageLoading && (
              <View style={styles.mapOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={theme.colors.primary} />
            {trip.startLocation?.address ? (
              <>
                <Text variant="body" weight="semibold" style={[styles.mapPlaceholderText, { marginTop: 12, textAlign: 'center' }]}>
                  📍 {trip.startLocation.address}
                </Text>
                {trip.endLocation?.address && (
                  <>
                    <View style={{ 
                      height: 24, 
                      width: '70%', 
                      borderLeftWidth: 3, 
                      borderLeftColor: theme.colors.primary, 
                      marginVertical: 12 
                    }} />
                    <Text variant="body" weight="semibold" style={[styles.mapPlaceholderText, { textAlign: 'center' }]}>
                      🏁 {trip.endLocation.address}
                    </Text>
                  </>
                )}
              </>
            ) : trip.startLocation ? (
              <Text variant="body" style={[styles.mapPlaceholderText, { marginTop: 12, textAlign: 'center' }]}>
                Start: {trip.startLocation.latitude.toFixed(4)}, {trip.startLocation.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text variant="body" style={[styles.mapPlaceholderText, { marginTop: 12, textAlign: 'center' }]}>
                {t('driving.map.loading')}
              </Text>
            )}
            
            {trip.endLocation && !trip.endLocation.address && (
              <Text variant="body" style={[styles.mapPlaceholderText, { marginTop: 8, textAlign: 'center' }]}>
                End: {trip.endLocation.latitude.toFixed(4)}, {trip.endLocation.longitude.toFixed(4)}
              </Text>
            )}

            <View style={{ 
              marginTop: 16, 
              padding: 12, 
              backgroundColor: theme.colors.primary + '15', 
              borderRadius: 8,
              width: '90%'
            }}>
              <Text variant="caption" style={{ textAlign: 'center', color: theme.colors.primary, fontWeight: '600' }}>
                {trip.distance.toFixed(1)} km • {trip.duration} min • Score: {trip.score}/100
              </Text>
            </View>

            {showControls && (
              <Text variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 12, textAlign: 'center', paddingHorizontal: 16 }}>
                {t('driving.map.tapToView')}
              </Text>
            )}
          </View>
        )}

        {/* Performance Score Overlay */}
        {!mapImageLoading && !mapImageError && (
          <View style={styles.performanceIndicator}>
            <View>
              <Text style={styles.performanceText}>
                {t('driving.review.tripScore')}
              </Text>
              <Text style={styles.performanceScore}>
                {trip.score}/100
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.performanceText, { fontSize: 10 }]}>
                {trip.distance.toFixed(1)} km
              </Text>
              <Text style={[styles.performanceText, { fontSize: 10 }]}>
                {trip.duration} min
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Legend */}
      {hasEvents && (
        <View style={styles.legendContainer}>
          {trip.events.speeding > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>
                {t('driving.trends.speeding')}
              </Text>
            </View>
          )}
          {trip.events.hardBraking > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
              <Text style={styles.legendText}>
                {t('driving.trends.braking')}
              </Text>
            </View>
          )}
          {trip.events.rapidAcceleration > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
              <Text style={styles.legendText}>
                {t('driving.trends.acceleration')}
              </Text>
            </View>
          )}
          {trip.events.cornering > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#a855f7' }]} />
              <Text style={styles.legendText}>
                {t('driving.calculationModal.factors.cornering')}
              </Text>
            </View>
          )}
          {trip.events.phoneUsage > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>
                {t('driving.calculationModal.factors.distractions')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Controls */}
      {showControls && (
        <View style={styles.controlsContainer}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {t('driving.map.legend')}
          </Text>
          <TouchableOpacity
            style={styles.openMapsButton}
            onPress={handleOpenInMaps}
            activeOpacity={0.7}
          >
            <ExternalLink size={16} color={theme.colors.white} />
            <Text style={styles.openMapsText}>
              {t('driving.map.openInMaps')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

