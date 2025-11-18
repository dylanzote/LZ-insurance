import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/services/api/endpoints';
import type { UserProfile } from '../types';

export const useProfile = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profileData = await profileAPI.getProfile();
        setProfile({
          id: profileData.id,
          email: profileData.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phoneNumber,
          address: profileData.address,
          dateOfBirth: profileData.dateOfBirth,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to user data from auth
        if (user) {
          setProfile({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phoneNumber,
          });
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
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  return {
    user,
    profile,
    isLoading,
    isLoadingProfile,
    handleLogout,
    updateProfile,
  };
};
