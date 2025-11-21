import { TripData } from '@/features/driving/types';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const TRIP_STORAGE_KEY = '@trip_history';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export interface TripEvent {
  type: 'speeding' | 'hardBraking' | 'rapidAcceleration' | 'phoneUsage' | 'cornering';
  timestamp: number;
  location: LocationPoint;
  severity?: number; // For speeding: how much over limit
}

export interface ActiveTrip {
  id: string;
  startTime: number;
  startLocation: LocationPoint;
  locations: LocationPoint[];
  events: TripEvent[];
  distance: number;
  lastHeading: number | null;
  headingChanges: number; // Track cornering events
}

class TripTrackerService {
  private activeTrip: ActiveTrip | null = null;
  private isTracking = false;
  private locationUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private lastLocation: LocationPoint | null = null;
  private lastSpeed = 0;
  private speedThreshold = 5; // Minimum speed to consider as driving (m/s)
  private tripStartSpeed = 2; // Speed to start trip (m/s)
  private tripEndSpeed = 1; // Speed to end trip (m/s)
  private tripEndDelay = 30000; // 30 seconds of low speed to end trip
  private phoneUsageDetector: ReturnType<typeof setInterval> | null = null;
  private phoneUsageCount = 0;
  private locationSubscription: Location.LocationSubscription | null = null;
  
  // Check if running in Expo Go (background location not fully supported)
  private isExpoGo(): boolean {
    return Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
  }
  
  // Check if we can use background location (requires native build, not Expo Go)
  private canUseBackgroundLocation(): boolean {
    // Background location requires native build, not available in Expo Go on iOS
    if (Platform.OS === 'ios' && this.isExpoGo()) {
      return false;
    }
    return true;
  }
  
  // Speed limit detection (in production, this would use geocoding API)
  // For now, using default speed limits based on road type
  private readonly DEFAULT_SPEED_LIMITS = {
    highway: 120, // km/h
    urban: 50, // km/h
    residential: 30, // km/h
  };

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // First request foreground permissions (required)
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        console.warn('Foreground location permission not granted:', foregroundStatus);
        return false;
      }

      // Then request background permissions (required for background tracking)
      // On iOS, this will show a different permission dialog
      try {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {
          return true;
        } else if (backgroundStatus === 'denied') {
          console.warn('Background location permission denied');
          return false;
        } else {
          // On iOS, background permission might be 'undetermined' initially
          // We can still track in foreground, but background tracking won't work
          console.warn('Background location permission not granted:', backgroundStatus);
          // Return true for foreground-only tracking (better than nothing)
          return true;
        }
      } catch (bgError: any) {
        // On iOS, if background permission request fails, it might be because:
        // 1. The permission descriptions are missing (should be caught by foreground request)
        // 2. The user denied it previously
        // 3. The app doesn't have the right capabilities
        console.warn('Background permission request failed:', bgError?.message || bgError);
        // Still return true if foreground is granted (we can track in foreground)
        return true;
      }
    } catch (error: any) {
      // Check if it's the Info.plist error
      if (error?.message?.includes('NSLocation') || error?.message?.includes('Info.plist')) {
        console.error('iOS Location Permission Error: Missing NSLocation*UsageDescription in Info.plist');
        console.error('Please ensure app.json has the correct iOS infoPlist configuration');
        throw new Error('Location permission descriptions are missing. Please rebuild the app after updating app.json.');
      }
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   * Returns true if foreground permission is granted (background is optional but preferred)
   */
  async hasPermissions(): Promise<boolean> {
    try {
      // Check foreground permission first (required)
      const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        return false;
      }

      // Check background permission (preferred but not strictly required for basic tracking)
      try {
        const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
        
        // Background permission is preferred for tracking trips when app is in background
        // On iOS, if background permission is denied, we can still track in foreground
        // On Android, we need explicit background permission for background tracking
        if (backgroundStatus === 'denied') {
          // On iOS, we can still work with foreground-only
          // On Android, this might be a problem, but let's allow foreground tracking
          console.warn('Background permission denied, but foreground is granted. Foreground tracking will work.');
          return true; // Allow foreground tracking
        }
        
        // If background permission is granted, we're good
        // If it's undetermined, we'll request it when starting tracking
        return backgroundStatus === 'granted' || foregroundStatus === 'granted';
      } catch (bgError: any) {
        // If background permission check fails (e.g., on iOS without proper setup),
        // we can still use foreground permission
        console.warn('Background permission check failed, using foreground only:', bgError?.message || bgError);
        return foregroundStatus === 'granted';
      }
    } catch (error: any) {
      // Check if it's the Info.plist error
      if (error?.message?.includes('NSLocation') || error?.message?.includes('Info.plist')) {
        console.error('iOS Location Permission Error: Missing NSLocation*UsageDescription in Info.plist');
        return false;
      }
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Start tracking trips
   * Automatically requests permissions if not granted
   */
  async startTracking(): Promise<boolean> {
    if (this.isTracking) {
      return true;
    }

    // Check and request permissions if needed
    const hasPermissions = await this.hasPermissions();
    if (!hasPermissions) {
      const granted = await this.requestPermissions();
      if (!granted) {
        console.warn('Location permissions not granted. Cannot start tracking.');
        return false;
      }
    }

    try {
      // Verify permissions one more time before starting
      const finalCheck = await this.hasPermissions();
      if (!finalCheck) {
        console.warn('Permissions check failed. Cannot start tracking.');
        return false;
      }

      // Check if we can use background location or need to use foreground-only
      const canUseBackground = this.canUseBackgroundLocation();
      
      if (canUseBackground) {
        // Try to start background location tracking (for native builds)
        try {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Update every 10 meters
            foregroundService: {
              notificationTitle: 'Trip Tracking Active',
              notificationBody: 'Your trip is being tracked for driving score calculation',
            },
            showsBackgroundLocationIndicator: true,
          });

          // Start monitoring location updates
          this.startLocationMonitoring();
          this.isTracking = true;
          console.log('Background location tracking started successfully');
          return true;
        } catch (bgError: any) {
          // If background location fails, fall back to foreground-only
          console.warn('Background location not available, falling back to foreground tracking:', bgError?.message || bgError);
          // Continue to foreground-only tracking below
        }
      }

      // Fallback to foreground-only location tracking (works in Expo Go)
      console.log('Starting foreground-only location tracking (background not available in Expo Go)');
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Foreground location permission not granted');
        return false;
      }

      // Use watchPositionAsync for foreground-only tracking
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          // Handle location updates
          const point: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            speed: location.coords.speed ? location.coords.speed * 3.6 : undefined, // Convert m/s to km/h
            heading: location.coords.heading || undefined,
          };
          
          this.processLocationUpdate(point);
        }
      );

      // Start monitoring location updates
      this.startLocationMonitoring();
      this.isTracking = true;
      console.log('Foreground location tracking started successfully (works in Expo Go)');
      return true;
    } catch (error: any) {
      console.error('Error starting location tracking:', error);
      this.isTracking = false;
      
      // Provide helpful error message for Expo Go users
      if (this.isExpoGo() && Platform.OS === 'ios') {
        console.warn('Note: Background location tracking is not available in Expo Go on iOS. Only foreground tracking is supported.');
        console.warn('To use background location tracking, create a development build with: npx expo run:ios');
      }
      
      return false;
    }
  }

  /**
   * Stop tracking trips
   */
  async stopTracking(): Promise<void> {
    if (!this.isTracking) {
      return;
    }

    try {
      // Stop background location task if it's running
      const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      if (isTaskDefined) {
        try {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        } catch (error) {
          console.warn('Error stopping background location updates:', error);
        }
      }

      // Stop foreground location subscription if it's running
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }

      this.stopLocationMonitoring();
      this.stopPhoneUsageDetection();
      this.endActiveTrip();
      this.isTracking = false;
      console.log('Location tracking stopped');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  /**
   * Start monitoring location updates
   */
  private startLocationMonitoring(): void {
    this.locationUpdateInterval = setInterval(async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const locationPoint: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
          speed: location.coords.speed || 0,
          heading: location.coords.heading || 0,
        };

        this.processLocationUpdate(locationPoint);
        this.lastLocation = locationPoint;
        this.lastSpeed = locationPoint.speed || 0;
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop monitoring location updates
   */
  private stopLocationMonitoring(): void {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  /**
   * Process location update and manage trip state
   */
  private processLocationUpdate(location: LocationPoint): void {
    const speed = location.speed || 0;
    const speedMs = speed; // Already in m/s from expo-location

    // Start trip if speed exceeds threshold and no active trip
    if (!this.activeTrip && speedMs > this.tripStartSpeed) {
      this.startTrip(location);
    }

    // Continue trip if active
    if (this.activeTrip) {
      this.updateTrip(location, speedMs);
    }

    // Detect driving events
    if (this.activeTrip) {
      this.detectDrivingEvents(location, speedMs);
    }
  }

  /**
   * Start a new trip
   */
  private startTrip(startLocation: LocationPoint): void {
    this.activeTrip = {
      id: `trip_${Date.now()}`,
      startTime: Date.now(),
      startLocation,
      locations: [startLocation],
      events: [],
      distance: 0,
      lastHeading: startLocation.heading || null,
      headingChanges: 0,
    };
    
    // Reset phone usage counter for new trip
    this.phoneUsageCount = 0;
    
    // Start phone usage detection (simulated - in production would use device sensors)
    this.startPhoneUsageDetection();
  }

  /**
   * Update active trip with new location
   */
  private updateTrip(location: LocationPoint, speed: number): void {
    if (!this.activeTrip) return;

    // Add location to trip
    this.activeTrip.locations.push(location);

    // Calculate distance
    if (this.lastLocation) {
      const distance = this.calculateDistance(
        this.lastLocation.latitude,
        this.lastLocation.longitude,
        location.latitude,
        location.longitude
      );
      this.activeTrip.distance += distance;
    }

    // Check if trip should end (low speed for extended period)
    if (speed < this.tripEndSpeed) {
      // Trip will end after delay if speed remains low
      setTimeout(() => {
        if (this.activeTrip && (location.speed || 0) < this.tripEndSpeed) {
          this.endActiveTrip();
        }
      }, this.tripEndDelay);
    }
  }

  /**
   * Detect driving events (speeding, hard braking, rapid acceleration, cornering)
   */
  private detectDrivingEvents(location: LocationPoint, currentSpeed: number): void {
    if (!this.activeTrip || !this.lastLocation) return;

    const speedKmh = currentSpeed * 3.6; // Convert m/s to km/h
    const speedChange = currentSpeed - this.lastSpeed;
    const timeDelta = (location.timestamp - this.lastLocation.timestamp) / 1000; // seconds
    const acceleration = timeDelta > 0 ? speedChange / timeDelta : 0;

    // 1. Detect SPEEDING relative to posted speed limit
    // In production, this would use geocoding API to get actual speed limits
    // For now, estimate based on speed and location context
    const estimatedSpeedLimit = this.estimateSpeedLimit(speedKmh, location);
    if (speedKmh > estimatedSpeedLimit) {
      const overLimit = speedKmh - estimatedSpeedLimit;
      // Only count as speeding if significantly over limit (e.g., > 10 km/h)
      if (overLimit > 10) {
        this.activeTrip.events.push({
          type: 'speeding',
          timestamp: location.timestamp,
          location,
          severity: overLimit,
        });
      }
    }

    // 2. Detect HARD BRAKING (deceleration > 4 m/s²)
    if (acceleration < -4) {
      this.activeTrip.events.push({
        type: 'hardBraking',
        timestamp: location.timestamp,
        location,
      });
    }

    // 3. Detect RAPID ACCELERATION (acceleration > 3 m/s²)
    if (acceleration > 3) {
      this.activeTrip.events.push({
        type: 'rapidAcceleration',
        timestamp: location.timestamp,
        location,
      });
    }

    // 4. Detect CORNERING (quick direction changes at speed)
    if (location.heading !== undefined && this.activeTrip.lastHeading !== null && currentSpeed > 5) {
      const headingChange = Math.abs(location.heading - this.activeTrip.lastHeading);
      // Normalize heading change to 0-180 degrees
      const normalizedChange = headingChange > 180 ? 360 - headingChange : headingChange;
      
      // Detect sharp turns (> 30 degrees) at speed (> 20 km/h)
      if (normalizedChange > 30 && speedKmh > 20) {
        this.activeTrip.events.push({
          type: 'cornering',
          timestamp: location.timestamp,
          location,
        });
        this.activeTrip.headingChanges++;
      }
    }
    
    // Update last heading
    if (location.heading !== undefined) {
      this.activeTrip.lastHeading = location.heading;
    }
  }

  /**
   * Estimate speed limit based on current speed and location context
   * In production, this would use a geocoding API to get actual speed limits
   */
  private estimateSpeedLimit(currentSpeed: number, location: LocationPoint): number {
    // Simple heuristic: if speed is very high, likely highway
    if (currentSpeed > 80) {
      return this.DEFAULT_SPEED_LIMITS.highway;
    } else if (currentSpeed > 40) {
      return this.DEFAULT_SPEED_LIMITS.urban;
    } else {
      return this.DEFAULT_SPEED_LIMITS.residential;
    }
  }

  /**
   * Start phone usage detection
   * In production, this would use device sensors or app state monitoring
   */
  private startPhoneUsageDetection(): void {
    // Simulate phone usage detection
    // In production, you would:
    // 1. Monitor app state (foreground/background)
    // 2. Detect screen interactions during driving
    // 3. Use device sensors to detect phone movement
    // 4. Monitor audio output (speaker/headset)
    
    // For now, simulate random phone usage events
    // In production, replace with actual detection logic
    this.phoneUsageDetector = setInterval(() => {
      if (this.activeTrip && Math.random() < 0.01) { // 1% chance per check
        this.phoneUsageCount++;
        this.activeTrip.events.push({
          type: 'phoneUsage',
          timestamp: Date.now(),
          location: this.lastLocation || this.activeTrip.startLocation,
        });
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop phone usage detection
   */
  private stopPhoneUsageDetection(): void {
    if (this.phoneUsageDetector) {
      clearInterval(this.phoneUsageDetector);
      this.phoneUsageDetector = null;
    }
  }

  /**
   * End active trip and save it
   */
  private async endActiveTrip(): Promise<void> {
    if (!this.activeTrip) return;

    // Stop phone usage detection
    this.stopPhoneUsageDetection();

    // Only save trips longer than 100 meters
    if (this.activeTrip.distance < 0.1) {
      this.activeTrip = null;
      return;
    }

    // Calculate trip duration in minutes
    const tripDuration = (Date.now() - this.activeTrip.startTime) / (1000 * 60);
    
    // Check if trip occurred during night hours (11 PM - 5 AM)
    const startDate = new Date(this.activeTrip.startTime);
    const startHour = startDate.getHours();
    const isNightDriving = startHour >= 23 || startHour < 5;

    const tripData: TripData = {
      id: this.activeTrip.id,
      date: new Date(this.activeTrip.startTime).toISOString(),
      distance: this.activeTrip.distance,
      duration: Math.round(tripDuration),
      isNightDriving,
      score: this.calculateTripScore(this.activeTrip, tripDuration, isNightDriving),
      events: {
        speeding: this.activeTrip.events.filter(e => e.type === 'speeding').length,
        hardBraking: this.activeTrip.events.filter(e => e.type === 'hardBraking').length,
        rapidAcceleration: this.activeTrip.events.filter(e => e.type === 'rapidAcceleration').length,
        cornering: this.activeTrip.events.filter(e => e.type === 'cornering').length,
        phoneUsage: this.activeTrip.events.filter(e => e.type === 'phoneUsage').length,
      },
    };

    // Save trip to storage
    await this.saveTrip(tripData);

    this.activeTrip = null;
  }

  /**
   * Calculate trip score based on events, duration, and night driving
   * Score is on a scale of 0-5 (as per the modal), then converted to 0-100
   */
  private calculateTripScore(
    trip: ActiveTrip,
    durationMinutes: number,
    isNightDriving: boolean
  ): number {
    let score = 5.0; // Start with perfect score (0-5 scale)

    // Penalties for events (more severe penalties for night driving)
    const nightMultiplier = isNightDriving ? 1.5 : 1.0;

    // 1. SPEEDING: -0.1 per event (more severe at night)
    const speedingEvents = trip.events.filter(e => e.type === 'speeding');
    speedingEvents.forEach(event => {
      const severity = event.severity || 0;
      // More points deducted for higher severity
      const penalty = Math.min(0.3, 0.1 + (severity / 100) * 0.2);
      score -= penalty * nightMultiplier;
    });

    // 2. HARD BRAKING: -0.15 per event
    const brakingEvents = trip.events.filter(e => e.type === 'hardBraking');
    score -= brakingEvents.length * 0.15 * nightMultiplier;

    // 3. RAPID ACCELERATION: -0.1 per event
    const accelerationEvents = trip.events.filter(e => e.type === 'rapidAcceleration');
    score -= accelerationEvents.length * 0.1 * nightMultiplier;

    // 4. CORNERING: -0.1 per event (sharp turns at speed)
    const corneringEvents = trip.events.filter(e => e.type === 'cornering');
    score -= corneringEvents.length * 0.1 * nightMultiplier;

    // 5. PHONE USAGE: -0.2 per event (most severe)
    const phoneEvents = trip.events.filter(e => e.type === 'phoneUsage');
    score -= phoneEvents.length * 0.2 * nightMultiplier;

    // 6. DURATION: Penalty for trips over 90 minutes
    if (durationMinutes > 90) {
      const excessMinutes = durationMinutes - 90;
      // Small penalty for very long trips
      score -= Math.min(0.2, (excessMinutes / 60) * 0.1);
    }

    // Ensure score is between 0 and 5
    score = Math.max(0, Math.min(5, score));

    // Convert to 0-100 scale for compatibility
    return Math.round(score * 20);
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Save trip to storage and send to backend
   */
  private async saveTrip(trip: TripData): Promise<void> {
    try {
      // Get existing trips
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingTripsJson = await AsyncStorage.getItem(TRIP_STORAGE_KEY);
      const existingTrips: TripData[] = existingTripsJson ? JSON.parse(existingTripsJson) : [];

      // Add new trip
      existingTrips.unshift(trip);

      // Keep only last 100 trips
      const tripsToKeep = existingTrips.slice(0, 100);

      // Save back to storage
      await AsyncStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(tripsToKeep));

      // Send trip to backend API
      try {
        const { tripsAPI } = require('@/services/api/endpoints');
        await tripsAPI.submitTrip(trip);
        console.log('Trip successfully synced to backend:', trip.id);
      } catch (apiError) {
        // If API call fails, mark trip as pending sync
        console.warn('Failed to sync trip to backend, will retry later:', apiError);
        // In production, you might want to queue this for retry
        const pendingTripsJson = await AsyncStorage.getItem('@pending_trips');
        const pendingTrips = pendingTripsJson ? JSON.parse(pendingTripsJson) : [];
        pendingTrips.push(trip);
        await AsyncStorage.setItem('@pending_trips', JSON.stringify(pendingTrips));
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  }

  /**
   * Get trip history
   */
  async getTripHistory(): Promise<TripData[]> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const tripsJson = await AsyncStorage.getItem(TRIP_STORAGE_KEY);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error getting trip history:', error);
      return [];
    }
  }

  /**
   * Sync pending trips to backend
   */
  async syncPendingTrips(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const pendingTripsJson = await AsyncStorage.getItem('@pending_trips');
      if (!pendingTripsJson) return;

      const pendingTrips: TripData[] = JSON.parse(pendingTripsJson);
      const { tripsAPI } = require('@/services/api/endpoints');
      
      const syncedTrips: string[] = [];
      
      for (const trip of pendingTrips) {
        try {
          await tripsAPI.submitTrip(trip);
          syncedTrips.push(trip.id);
          console.log('Synced pending trip:', trip.id);
        } catch (error) {
          console.warn('Failed to sync trip:', trip.id, error);
        }
      }

      // Remove synced trips from pending list
      const remainingTrips = pendingTrips.filter(trip => !syncedTrips.includes(trip.id));
      if (remainingTrips.length > 0) {
        await AsyncStorage.setItem('@pending_trips', JSON.stringify(remainingTrips));
      } else {
        await AsyncStorage.removeItem('@pending_trips');
      }
    } catch (error) {
      console.error('Error syncing pending trips:', error);
    }
  }

  /**
   * Check if tracking is active
   */
  isTrackingActive(): boolean {
    return this.isTracking;
  }

  /**
   * Get active trip
   */
  getActiveTrip(): ActiveTrip | null {
    return this.activeTrip;
  }
}

// Define background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    // Process background location updates
    // The foreground monitoring will handle trip tracking
  }
});

export const tripTracker = new TripTrackerService();

