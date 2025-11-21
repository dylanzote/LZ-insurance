import { i18n } from '@/core/i18n';
import { z } from 'zod';

// Helper function to get translated validation messages
// This uses the i18n instance directly (not a hook) so it can be used in utility files
const getTranslatedMessage = (key: string): string => {
  return i18n.t(key);
};

// Common validation schemas with translations
// Note: Translations are evaluated at schema creation time based on current locale
export const emailSchema = z
  .string()
  .min(1, getTranslatedMessage('errors.emailRequired'))
  .email(getTranslatedMessage('errors.emailInvalid'));

export const passwordSchema = z
  .string()
  .min(1, getTranslatedMessage('errors.passwordRequired'))
  .min(8, getTranslatedMessage('errors.passwordMinLength'))
  .regex(/[A-Z]/, getTranslatedMessage('errors.passwordUppercase'))
  .regex(/[a-z]/, getTranslatedMessage('errors.passwordLowercase'))
  .regex(/[0-9]/, getTranslatedMessage('errors.passwordNumber'));

export const requiredString = (fieldName: string) => 
  z.string().min(1, `${fieldName} is required`);

export const amountSchema = z
  .string()
  .min(1, 'Amount is required')
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  });

// Form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, getTranslatedMessage('errors.firstNameRequired'))
    .min(2, getTranslatedMessage('errors.firstNameMinLength')),
  lastName: z
    .string()
    .min(1, getTranslatedMessage('errors.lastNameRequired'))
    .min(2, getTranslatedMessage('errors.lastNameMinLength')),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, getTranslatedMessage('errors.confirmPasswordRequired')),
  phoneNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: getTranslatedMessage('errors.confirmPasswordMismatch'),
  path: ['confirmPassword'],
});

export const claimFormSchema = z.object({
  policyId: requiredString('Policy'),
  policyType: z.enum(['auto', 'home', 'life', 'health']),
  title: requiredString('Title'),
  description: requiredString('Description'),
  incidentDate: requiredString('Incident date'),
  amount: amountSchema,
  location: requiredString('Location'),
  category: requiredString('Category'),
  documents: z.array(z.any()).default([]),
  images: z.array(z.any()).default([]),
});

export const policyFormSchema = z.object({
  type: requiredString('Policy type'),
  premium: amountSchema,
  coverageAmount: amountSchema,
  startDate: requiredString('Start date'),
  endDate: requiredString('End date'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, getTranslatedMessage('errors.firstNameRequired'))
    .min(2, getTranslatedMessage('errors.firstNameMinLength')),
  lastName: z
    .string()
    .min(1, getTranslatedMessage('errors.lastNameRequired'))
    .min(2, getTranslatedMessage('errors.lastNameMinLength')),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, getTranslatedMessage('errors.passwordRequired')),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, getTranslatedMessage('errors.confirmPasswordRequired')),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: getTranslatedMessage('errors.confirmPasswordMismatch'),
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClaimFormData = z.infer<typeof claimFormSchema>;
export type PolicyFormData = z.infer<typeof policyFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
