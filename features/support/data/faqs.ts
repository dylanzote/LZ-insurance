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
    id: 'driving-7',
    category: 'driving',
    question: 'How long do I have to review my trips?',
    answer: 'You have a maximum of 6 days from when a trip is recorded to review it. After 6 days, the trip will be automatically processed. The number of days remaining is shown on each trip card in the "Trips to Review" section. If you don\'t recognize a trip or weren\'t the driver, you can reject it during the review process.',
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
  
  // Quotes FAQs
  {
    id: 'quote-1',
    category: 'quotes',
    question: 'How do I get an insurance quote?',
    answer: 'Go to "Get a Quote" in the app menu or browse the Insurance Marketplace. Select the type of insurance you need (Auto, Home, Life, Health, Travel, or Motorcycle), fill in the required information through our step-by-step form, and receive your personalized quote instantly.',
  },
  {
    id: 'quote-2',
    category: 'quotes',
    question: 'What information do I need to provide for a quote?',
    answer: 'The information varies by insurance type. For auto/motorcycle: vehicle details (year, make, model), usage, driving history, and coverage preferences. For home: property details, square footage, construction type, and security features. For life: coverage amount, health status, and personal information. For health: family size, age, and coverage level. For travel: destination, trip dates, and number of travelers.',
  },
  {
    id: 'quote-3',
    category: 'quotes',
    question: 'How long is my quote valid?',
    answer: 'Quotes are typically valid for 30 days from the date they are generated. You can view your quote anytime during this period. After expiration, you\'ll need to request a new quote as rates may have changed.',
  },
  {
    id: 'quote-4',
    category: 'quotes',
    question: 'Can I modify my quote after receiving it?',
    answer: 'Yes! In the quote review section, you can select or deselect optional coverages, adjust coverage amounts where applicable, change payment frequency (monthly or yearly), and recalculate your quote. Changes are reflected immediately in your premium.',
  },
  {
    id: 'quote-5',
    category: 'quotes',
    question: 'What are mandatory, recommended, and optional coverages?',
    answer: 'Mandatory coverages are required by law (e.g., Bodily Injury, Property Damage for auto). Recommended coverages are highly advised for better protection (e.g., Collision, Comprehensive). Optional coverages provide additional protection you can choose (e.g., Rental Reimbursement, Roadside Assistance). You can view details and examples for each coverage in the quote review section.',
  },
  {
    id: 'quote-6',
    category: 'quotes',
    question: 'What is a coverage limit and deductible?',
    answer: 'A coverage limit is the maximum amount your insurance will pay for a covered loss (e.g., $1,000,000 for Bodily Injury Liability). A deductible is the amount you pay out-of-pocket before your insurance coverage kicks in (e.g., $500 for Collision). Higher deductibles typically lower your premium, while higher limits provide more protection.',
  },
  {
    id: 'quote-7',
    category: 'quotes',
    question: 'Can I convert my quote to a policy?',
    answer: 'Yes! Once your quote is approved, you can convert it directly to a policy from the quote details screen. This will create your insurance policy and you can start making payments.',
  },
  {
    id: 'quote-8',
    category: 'quotes',
    question: 'What payment frequency options are available?',
    answer: 'You can choose to pay monthly or yearly. Monthly payments are convenient for budgeting, while yearly payments often provide a discount. Your quote shows both options, and you can toggle between them to see the difference.',
  },
  {
    id: 'quote-9',
    category: 'quotes',
    question: 'Why do I need to provide my personal information for a quote?',
    answer: 'Your personal information (name, email, phone, address, date of birth, marital status) helps us calculate accurate premiums based on your location, age, and other risk factors. This information is read-only in quotes (you can update it in your profile) and ensures your quote reflects your specific circumstances.',
  },
  
  // Marketplace FAQs
  {
    id: 'marketplace-1',
    category: 'marketplace',
    question: 'What is the Insurance Marketplace?',
    answer: 'The Insurance Marketplace allows you to browse and compare different insurance products across all insurance types (Auto, Home, Life, Health, Travel, Motorcycle). Each product shows coverage details, features, pricing, and ratings to help you make informed decisions.',
  },
  {
    id: 'marketplace-2',
    category: 'marketplace',
    question: 'How do I get a quote from the marketplace?',
    answer: 'Browse products in the marketplace, filter by insurance type, and click "Get Quote" on any product. You\'ll be taken to the quote form with the insurance type pre-selected, making it faster to get your personalized quote.',
  },
  {
    id: 'marketplace-3',
    category: 'marketplace',
    question: 'What information is shown for each product?',
    answer: 'Each product displays: coverage details with limits and deductibles, monthly and annual premiums, features, provider information, customer ratings, and whether it\'s a popular choice. You can tap on coverage items to see detailed explanations.',
  },
  {
    id: 'marketplace-4',
    category: 'marketplace',
    question: 'Are marketplace prices final?',
    answer: 'Marketplace prices are starting premiums for reference. Your actual premium will be calculated based on your specific information and requirements when you complete the quote form. Factors like your location, vehicle/property details, coverage selections, and risk factors will determine your final rate.',
  },
  
  // Privacy & Security FAQs
  {
    id: 'privacy-1',
    category: 'privacy',
    question: 'How is my personal information protected?',
    answer: 'We use industry-standard encryption (AES-256) to protect your data both in transit and at rest. All communications are secured with TLS protocols. We follow strict access controls, regular security audits, and comply with privacy regulations to ensure your information remains safe.',
  },
  {
    id: 'privacy-2',
    category: 'privacy',
    question: 'What information do you collect and why?',
    answer: 'We collect personal information (name, contact details, date of birth), policy information, claims data, driving behavior (for LZ Advantage), and usage data. This information is used to provide insurance services, calculate premiums, process claims, and improve our services. We only collect what is necessary for these purposes.',
  },
  {
    id: 'privacy-3',
    category: 'privacy',
    question: 'Who has access to my information?',
    answer: 'Only authorized LZ Insurance personnel and service providers who need your information to provide insurance services have access. We use role-based access controls and multi-factor authentication. We do not sell your personal information to third parties for marketing purposes.',
  },
  {
    id: 'privacy-4',
    category: 'privacy',
    question: 'Can I access, update, or delete my personal information?',
    answer: 'Yes! You can access and update your personal information through your Profile section in the app. For deletions or data export requests, please contact our Privacy Office through the Contact Us section. We will respond to your request within 30 days.',
  },
  {
    id: 'privacy-5',
    category: 'privacy',
    question: 'How is my location data used?',
    answer: 'Location data is used solely for LZ Advantage driving score calculation and trip tracking. This data helps calculate your driving score and potential discounts. Location data is encrypted, stored securely, and only accessible by authorized personnel. You can disable location tracking anytime in settings.',
  },
  {
    id: 'privacy-6',
    category: 'privacy',
    question: 'What happens if there is a data breach?',
    answer: 'We have a comprehensive incident response plan. In the unlikely event of a data breach affecting your information, we will notify affected users and relevant authorities within 72 hours as required by law. We\'ll provide details about what happened, what information was affected, and steps you can take to protect yourself.',
  },
  
  // General FAQs
  {
    id: 'general-1',
    category: 'general',
    question: 'How do I contact customer support?',
    answer: 'You can contact us through the "Contact Us" section in the app. We offer phone support (1-800-LZ-HELP), email support, and live chat during business hours (Monday-Friday, 8 AM - 8 PM). For urgent claims, call our 24/7 emergency line at 1-800-LZ-CLAIM.',
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'How do I receive notifications?',
    answer: 'Notifications are sent for important updates like claim status changes, payment reminders, policy renewals, and quote updates. You can manage notification preferences in your device settings. Go to Settings > Notifications to customize what notifications you receive.',
  },
  {
    id: 'general-3',
    category: 'general',
    question: 'What should I do if the app isn\'t working?',
    answer: 'Try closing and reopening the app, or restarting your device. Clear the app cache if issues persist. Make sure your app is updated to the latest version. For persistent issues, go to "Contact Us" and select "Technical Support" for assistance. We\'re here to help!',
  },
  {
    id: 'general-4',
    category: 'general',
    question: 'Can I use the app offline?',
    answer: 'Some features like viewing your policies, quotes, and claims history are available offline. However, actions like submitting claims, requesting quotes, or making payments require an internet connection. The app will let you know when you\'re offline.',
  },
  {
    id: 'general-5',
    category: 'general',
    question: 'What insurance types does LZ Insurance offer?',
    answer: 'We offer comprehensive insurance coverage for: Auto Insurance, Motorcycle Insurance, Home Insurance, Life Insurance, Health Insurance, and Travel Insurance. You can browse all options in the Insurance Marketplace or get personalized quotes for any type.',
  },
];

