export type FAQCategory = 'all' | 'claims' | 'policies' | 'driving' | 'coverage' | 'billing' | 'account' | 'general';

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

