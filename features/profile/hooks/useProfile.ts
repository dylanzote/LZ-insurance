import { useAuth } from '@/contexts/AuthContext';
import type { UserResponse } from '@/core/types/backend';
import { userProfileAPI } from '@/services/api/endpoints';
import { useEffect, useState } from 'react';

export const useProfile = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from real API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError(null);
        
        // Use real API to get profile
        const profileData = await userProfileAPI.getProfile();
        setProfile(profileData);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setError(error?.message || 'Failed to load profile');
        
        // Fallback to user data from auth store
        if (user) {
          setProfile(user);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await logout();
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error?.message || 'Logout failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setIsLoadingProfile(true);
      setError(null);
      const profileData = await userProfileAPI.getProfile();
      setProfile(profileData);
      return profileData;
    } catch (error: any) {
      console.error('Failed to refresh profile:', error);
      setError(error?.message || 'Failed to refresh profile');
      throw error;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateProfile = (updatedProfile: UserResponse) => {
    setProfile(updatedProfile);
  };

  return {
    user: profile || user, // Primary: profile from API, Fallback: user from auth
    profile,
    isLoading,
    isLoadingProfile,
    error,
    handleLogout,
    updateProfile,
    refreshProfile,
  };
};
