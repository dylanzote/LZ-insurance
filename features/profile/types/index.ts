export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}