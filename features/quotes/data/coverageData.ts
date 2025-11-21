// Coverage types and their details
export interface Coverage {
  id: string;
  name: string;
  category: 'mandatory' | 'recommended' | 'optional';
  description: string;
  example?: string;
  price?: number;
  selected?: boolean;
  amountOptions?: number[]; // Preconfigured amount options for this coverage
  selectedAmount?: number; // User-selected amount
}

export const mandatoryCoverages: Coverage[] = [
  {
    id: 'bodily-injury',
    name: 'Bodily Injury',
    category: 'mandatory',
    description: 'Covers medical expenses, lost wages, and other damages for people injured in an accident where you are at fault. This coverage protects you from lawsuits and helps pay for the other party\'s medical bills, rehabilitation costs, and lost income.',
    example: 'If you cause an accident and the other driver requires $50,000 in medical treatment, your Bodily Injury coverage would pay for those expenses up to your policy limit.',
  },
  {
    id: 'property-damage',
    name: 'Property Damage',
    category: 'mandatory',
    description: 'Covers damage you cause to someone else\'s property (like their vehicle, fence, or building) when you are at fault in an accident. This is essential protection that helps pay for repairs or replacement of damaged property.',
    example: 'If you accidentally hit another car and cause $10,000 in damage, your Property Damage coverage would pay for the repairs to the other vehicle.',
  },
  {
    id: 'accident-benefits',
    name: 'Accident Benefits',
    category: 'mandatory',
    description: 'Provides coverage for medical expenses, rehabilitation costs, income replacement, and other benefits for you and your passengers, regardless of who is at fault. This is a no-fault coverage that ensures you receive necessary medical care and financial support after an accident.',
    example: 'If you\'re injured in an accident and need $20,000 in medical treatment and rehabilitation, Accident Benefits would cover these costs even if the other driver was at fault.',
  },
  {
    id: 'uninsured-motorist',
    name: 'Uninsured Motorist',
    category: 'mandatory',
    description: 'Protects you if you\'re involved in an accident with a driver who has no insurance or insufficient coverage. This coverage helps pay for your medical expenses, lost wages, and vehicle damage when the at-fault driver cannot.',
    example: 'If an uninsured driver hits you and causes $15,000 in damages, your Uninsured Motorist coverage would step in to cover your losses.',
  },
  {
    id: 'family-protection',
    name: 'Family Protection',
    category: 'mandatory',
    description: 'Extends your coverage to protect you and your family members when involved in an accident with an underinsured driver. This coverage ensures you receive adequate compensation even when the other driver\'s insurance limits are too low.',
    example: 'If a driver with only $25,000 in coverage causes $75,000 in damages to you, Family Protection would cover the remaining $50,000.',
  },
];

export const recommendedCoverages: Coverage[] = [
  {
    id: 'collision',
    name: 'Collision',
    category: 'recommended',
    description: 'Pays for repairs or replacement of your vehicle if it\'s damaged in a collision with another vehicle or object, regardless of who is at fault. This coverage is essential for protecting your investment in your vehicle.',
    example: 'If you accidentally hit a tree or another car, Collision coverage would pay for the repairs to your vehicle, minus your deductible.',
    price: 500,
    amountOptions: [250, 500, 750, 1000, 1500], // Deductible options
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    category: 'recommended',
    description: 'Protects your car against risks such as vandalism, theft, fire, natural disasters, falling objects, and hitting an animal. This coverage provides peace of mind for non-collision related damages.',
    example: 'If your car is stolen or damaged by hail, Comprehensive coverage would pay for the replacement or repairs, minus your deductible.',
    price: 300,
    amountOptions: [250, 500, 750, 1000, 1500], // Deductible options
  },
  {
    id: 'grand-touring-solution',
    name: 'Grand Touring Solution',
    category: 'recommended',
    description: 'A comprehensive package that combines multiple coverages for enhanced protection. This premium option provides extensive coverage for various scenarios including rental car reimbursement, roadside assistance, and enhanced protection limits.',
    example: 'If you need a rental car while your vehicle is being repaired, or require roadside assistance, Grand Touring Solution would cover these additional expenses.',
    price: 200,
    amountOptions: [150, 200, 250, 300], // Coverage level options
  },
  {
    id: 'accident-forgiveness',
    name: 'Accident Forgiveness',
    category: 'recommended',
    description: 'Protects your insurance rate from increasing after your first at-fault accident. This coverage ensures that one mistake doesn\'t result in significantly higher premiums, providing financial stability and peace of mind.',
    example: 'If you cause an accident, Accident Forgiveness would prevent your insurance premium from increasing, saving you money in the long run.',
    price: 150,
  },
  {
    id: 'dcpd',
    name: 'Direct Compensation - Property Damage',
    category: 'recommended',
    description: 'Allows you to claim directly from your own insurer for damage to your vehicle when you\'re not at fault in an accident. This system streamlines the claims process, ensuring quicker repairs and settlements without having to deal with the other party\'s insurance.',
    example: 'If another driver rear-ends you and is at fault, DCPD allows you to file a claim with your own insurance company for faster processing, rather than waiting for the other driver\'s insurer.',
    price: 100,
  },
];

export const optionalCoverages: Coverage[] = [
  {
    id: 'rental-reimbursement',
    name: 'Rental Reimbursement',
    category: 'optional',
    description: 'Pays for a rental car while your vehicle is being repaired due to a covered loss. This coverage ensures you maintain mobility and don\'t have to pay out-of-pocket for transportation during repairs.',
    example: 'If your car is in the shop for two weeks after an accident, Rental Reimbursement would cover the cost of a rental car up to your policy limit (e.g., $30/day for 30 days).',
    price: 50,
    amountOptions: [30, 50, 75, 100], // Daily limit options
  },
  {
    id: 'roadside-assistance',
    name: 'Roadside Assistance',
    category: 'optional',
    description: 'Provides services like towing, battery jump-starts, flat tire changes, lockout service, and fuel delivery. This coverage offers peace of mind and convenience when you encounter vehicle problems on the road.',
    example: 'If your car breaks down on the highway, Roadside Assistance would cover the cost of towing to the nearest repair shop, typically up to a certain distance (e.g., 25 km).',
    price: 75,
  },
  {
    id: 'waiver-depreciation',
    name: 'Waiver of Depreciation',
    category: 'optional',
    description: 'Ensures you receive the full purchase price of your new vehicle if it\'s written off within the first few years, rather than the depreciated value. This coverage is especially valuable for new vehicles.',
    example: 'If you buy a new car for $30,000 and it\'s totaled in the first year, Waiver of Depreciation would pay the full $30,000 instead of the depreciated value of $25,000.',
    price: 250,
    amountOptions: [200, 250, 300, 350], // Coverage level options
  },
  {
    id: 'loss-of-use',
    name: 'Loss of Use',
    category: 'optional',
    description: 'Covers additional transportation expenses beyond rental reimbursement, such as taxi fares, ride-sharing services, or public transportation costs while your vehicle is being repaired.',
    example: 'If you need to take taxis to work while your car is being repaired, Loss of Use would cover those expenses up to your policy limit.',
    price: 40,
  },
  {
    id: 'enhanced-accident-benefits',
    name: 'Enhanced Accident Benefits',
    category: 'optional',
    description: 'Increases the limits and coverage for accident benefits beyond the mandatory minimum. This provides additional protection for medical expenses, income replacement, and other benefits.',
    example: 'If you require extensive rehabilitation that costs more than the standard Accident Benefits limit, Enhanced Accident Benefits would cover the additional expenses.',
    price: 120,
  },
];

