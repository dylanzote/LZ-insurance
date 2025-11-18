import type { FAQ } from '../types';

export const faqsData: FAQ[] = [
  // Claims FAQs
  {
    id: 'claim-1',
    category: 'claims',
    question: 'How do I file a new claim?',
    answer: 'To file a new claim, go to the "Start a Claim" section in the app. You\'ll need to provide your policy information, incident details, location, and upload any relevant photos or documents. The process is step-by-step and will guide you through all required information.',
  },
  {
    id: 'claim-2',
    category: 'claims',
    question: 'How can I track my claim status?',
    answer: 'You can track your claim by going to "Track My Claim" in the app. You\'ll see all your claims with their current status, timeline of events, and any updates. Statuses include: Submitted, Document Verification, Surveyor Assigned, Assessment, Settlement, and more.',
  },
  {
    id: 'claim-3',
    category: 'claims',
    question: 'What documents do I need to submit with my claim?',
    answer: 'Required documents vary by claim type. Generally, you should submit photos of the damage, police reports (if applicable), receipts for repairs or replacements, and any other relevant documentation. The app will guide you on what\'s needed for your specific claim type.',
  },
  {
    id: 'claim-4',
    category: 'claims',
    question: 'How long does it take to process a claim?',
    answer: 'Claim processing times vary depending on the complexity and type of claim. Simple claims may be processed within a few days, while more complex cases may take several weeks. You can track the progress in real-time through the app.',
  },
  {
    id: 'claim-5',
    category: 'claims',
    question: 'Can I submit a claim outside business hours?',
    answer: 'Yes! You can submit a claim through the app 24/7. For urgent claims outside business hours, you can also call our 24/7 emergency claims line at 1-800-LZ-CLAIM.',
  },
  
  // Policies FAQs
  {
    id: 'policy-1',
    category: 'policies',
    question: 'How do I view my insurance policies?',
    answer: 'Go to "Manage Policies" in the app menu. You\'ll see all your active policies organized by type (Auto, Home, etc.). Tap on any policy to view detailed information including coverage, vehicle/property details, and policy terms.',
  },
  {
    id: 'policy-2',
    category: 'policies',
    question: 'What information is shown in my policy details?',
    answer: 'Policy details include your policy number, coverage amounts, deductibles, coverage types (liability, collision, comprehensive, etc.), vehicle/property information, drivers, term dates, premium information, and next payment date.',
  },
  {
    id: 'policy-3',
    category: 'policies',
    question: 'How do I understand my coverage breakdown?',
    answer: 'In your policy details, you\'ll see a "Coverage" tab that breaks down each coverage type with its limit, deductible, or whether it\'s included. This helps you understand exactly what\'s covered under your policy.',
  },
  {
    id: 'policy-4',
    category: 'policies',
    question: 'Can I file a claim directly from my policy?',
    answer: 'Yes! When viewing a policy, you\'ll see a "START A CLAIM" button that takes you directly to the claim filing process with your policy information pre-filled.',
  },
  
  // Driving Score FAQs
  {
    id: 'driving-1',
    category: 'driving',
    question: 'What is LZ Advantage and how does it work?',
    answer: 'LZ Advantage is our driving score program that tracks your safe driving habits. By enabling trip tracking, we monitor factors like speed, acceleration, braking, cornering, phone usage, and night driving to calculate your score. Better scores can earn you insurance discounts.',
  },
  {
    id: 'driving-2',
    category: 'driving',
    question: 'How is my driving score calculated?',
    answer: 'Your driving score (0-100) is calculated based on multiple factors: speed compliance, smooth acceleration and braking, safe cornering, trip duration, phone usage while driving, and night driving patterns. Each trip is scored individually, and your overall score is an average.',
  },
  {
    id: 'driving-3',
    category: 'driving',
    question: 'What discounts can I get with a good driving score?',
    answer: 'Driving scores are rated from 0-5 stars, which correspond to discount percentages. Excellent scores (4-5 stars) can earn up to 20% discounts, while good scores (3 stars) typically earn 5-10% discounts. Your discount is applied at policy renewal.',
  },
  {
    id: 'driving-4',
    category: 'driving',
    question: 'Do I need to enable location tracking?',
    answer: 'Yes, location tracking is required to calculate your driving score accurately. The app needs permission to track your trips in the background. This data is used solely for calculating your driving score and potential discounts.',
  },
  {
    id: 'driving-5',
    category: 'driving',
    question: 'How do I review my trips?',
    answer: 'Go to the "LZ Advantage" screen and scroll to "Trips to Review". Tap "Review Trip" on any trip. You\'ll need to confirm you were the driver, then you can see your trip score, duration, and any driving events that occurred.',
  },
  {
    id: 'driving-6',
    category: 'driving',
    question: 'When will my discount be applied?',
    answer: 'Your driving score discount is applied at your next policy renewal. The app shows your current discount (if any) and projected discount based on your current score, along with when it will be applied.',
  },
  
  // Coverage FAQs
  {
    id: 'coverage-1',
    category: 'coverage',
    question: 'How do I view my total coverage?',
    answer: 'Go to "View My Coverage" in the app. You\'ll see a summary of your total coverage amount and a breakdown by policy type (Auto, Home, etc.). Each policy shows its coverage amount and number of policies.',
  },
  {
    id: 'coverage-2',
    category: 'coverage',
    question: 'What types of coverage do I have?',
    answer: 'Coverage types vary by policy. Auto policies typically include liability, collision, comprehensive, uninsured motorist, and accident benefits. Home policies include dwelling, personal property, and liability coverage. Check your individual policy details for specifics.',
  },
  {
    id: 'coverage-3',
    category: 'coverage',
    question: 'Can I see coverage for all my policies in one place?',
    answer: 'Yes! The "View My Coverage" screen shows a comprehensive overview of all your active policies, organized by type, with total coverage amounts and policy counts.',
  },
  
  // Billing FAQs
  {
    id: 'billing-1',
    category: 'billing',
    question: 'How do I view my billing information?',
    answer: 'Go to "View My Billing" in the app menu. Here you can see your payment history, upcoming payments, invoices, and manage your payment methods.',
  },
  {
    id: 'billing-2',
    category: 'billing',
    question: 'When is my next payment due?',
    answer: 'Your next payment date is shown in your policy details under the "Details" tab. You can also see it on the dashboard and in your billing section.',
  },
  {
    id: 'billing-3',
    category: 'billing',
    question: 'How do I update my payment method?',
    answer: 'You can update your payment method in the Billing section. Go to "View My Billing" and select "Payment Methods" to add, edit, or remove payment options.',
  },
  
  // Account FAQs
  {
    id: 'account-1',
    category: 'account',
    question: 'How do I update my profile information?',
    answer: 'Go to "My Profile" in the app menu. Tap the edit icon next to "Personal Information" to update your name, phone number, address, and date of birth.',
  },
  {
    id: 'account-2',
    category: 'account',
    question: 'How do I change my password?',
    answer: 'In your Profile screen, go to the "Security" section and tap "Change Password". You\'ll need to enter your current password and your new password twice for confirmation.',
  },
  {
    id: 'account-3',
    category: 'account',
    question: 'Can I change the app language?',
    answer: 'Yes! In your Profile, go to "Language Settings" and toggle between English and French. The app will immediately update to your selected language.',
  },
  {
    id: 'account-4',
    category: 'account',
    question: 'How do I enable dark mode?',
    answer: 'In your Profile, go to "App Settings" and toggle "Dark Mode" on or off. You can also set it to follow your system theme preference.',
  },
  
  // General FAQs
  {
    id: 'general-1',
    category: 'general',
    question: 'How do I get a new insurance quote?',
    answer: 'Go to "Get a Quote" in the app menu. You can request quotes for different types of insurance (Auto, Home, Life, Health) and compare options.',
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'How do I contact customer support?',
    answer: 'You can contact us through the "Contact Us" section in the app. We offer phone support, email, and live chat during business hours. For urgent claims, call our 24/7 emergency line.',
  },
  {
    id: 'general-3',
    category: 'general',
    question: 'Is my personal information secure?',
    answer: 'Yes, we take security seriously. All your data is encrypted and stored securely. You can learn more in the "Privacy & Security" section of the app.',
  },
  {
    id: 'general-4',
    category: 'general',
    question: 'How do I receive notifications?',
    answer: 'Notifications are sent for important updates like claim status changes, payment reminders, and policy renewals. You can manage notification preferences in your device settings.',
  },
  {
    id: 'general-5',
    category: 'general',
    question: 'What should I do if the app isn\'t working?',
    answer: 'Try closing and reopening the app, or restarting your device. If issues persist, go to "Contact Us" and select "Technical Support" for assistance. Make sure your app is updated to the latest version.',
  },
];

