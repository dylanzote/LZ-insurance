import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from './en.json';
import fr from './fr.json';

// Create and configure the i18n instance
export const i18n = new I18n({
  en,
  fr,
});

// Set the locale
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

// Enable fallbacks
i18n.enableFallback = true;

// Set default locale
i18n.defaultLocale = 'en';

export const translate = (key: string, options?: object) => i18n.t(key, options);
export default i18n; 
