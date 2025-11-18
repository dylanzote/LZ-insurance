import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { t, locale, setLocale } = useLanguage();
  
  return {
    t,
    locale,
    setLocale,
  };
};