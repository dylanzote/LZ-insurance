import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from '@/core/i18n';

const LANGUAGE_STORAGE_KEY = 'app:language';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: object) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(i18n.locale);

  // Load language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
          setLocaleState(savedLocale);
          i18n.locale = savedLocale;
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const setLocale = async (newLocale: string) => {
    if (newLocale !== locale && (newLocale === 'en' || newLocale === 'fr')) {
      try {
        setLocaleState(newLocale);
        i18n.locale = newLocale;
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  };

  const t = (key: string, options?: object) => i18n.t(key, options);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};