export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  gender?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}