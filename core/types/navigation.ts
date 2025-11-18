// Navigation types for Expo Router
import { RootStackParamList as RootParamList } from '@/app';

export type RootStackParamList = {
  '(tabs)': undefined;
  'auth': undefined;
  'claims': { id?: string } | undefined;
  'policies': { id?: string } | undefined;
  'profile': undefined;
  'settings': undefined;
  'billing': undefined;
  'quotes': undefined;
  'support': undefined;
  'advantages': undefined;
};

export type TabParamList = {
  index: undefined;
  insurance: undefined;
  driving: undefined;
  profile: undefined;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
