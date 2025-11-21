// Coverage data organized by insurance type
import type { Coverage } from './coverageData';
import { mandatoryCoverages, recommendedCoverages, optionalCoverages } from './coverageData';

// Auto and Motorcycle share the same coverage structure
export const getCoveragesByType = (type: string): {
  mandatory: Coverage[];
  recommended: Coverage[];
  optional: Coverage[];
} => {
  switch (type) {
    case 'auto':
    case 'motorcycle':
      return {
        mandatory: mandatoryCoverages,
        recommended: recommendedCoverages,
        optional: optionalCoverages,
      };
    
    case 'home':
      return {
        mandatory: [
          {
            id: 'dwelling',
            name: 'Dwelling Coverage',
            category: 'mandatory',
            description: 'Protects the structure of your home, including walls, roof, foundation, and built-in appliances. This is the primary coverage that pays to rebuild or repair your home if it\'s damaged by a covered peril.',
            example: 'If a fire damages your home and it costs $200,000 to rebuild, your Dwelling Coverage would pay for the reconstruction up to your policy limit.',
          },
          {
            id: 'liability',
            name: 'Personal Liability',
            category: 'mandatory',
            description: 'Protects you if someone is injured on your property or if you accidentally damage someone else\'s property. This coverage helps pay for medical expenses, legal fees, and damages if you\'re found liable.',
            example: 'If a guest slips and falls on your property and sues you for $50,000, your Personal Liability coverage would help pay for their medical expenses and legal costs.',
          },
          {
            id: 'medical-payments',
            name: 'Medical Payments',
            category: 'mandatory',
            description: 'Covers medical expenses for guests injured on your property, regardless of fault. This is a no-fault coverage that provides quick payment for minor injuries without determining liability.',
            example: 'If a visitor trips on your steps and needs $2,000 in medical treatment, Medical Payments would cover those expenses without requiring a lawsuit.',
          },
        ],
        recommended: [
          {
            id: 'personal-property',
            name: 'Personal Property',
            category: 'recommended',
            description: 'Covers your belongings such as furniture, electronics, clothing, and other personal items if they\'re stolen or damaged by a covered peril.',
            example: 'If your home is burglarized and $15,000 worth of electronics and jewelry are stolen, Personal Property coverage would help replace those items.',
            price: 300,
          },
          {
            id: 'loss-of-use',
            name: 'Loss of Use',
            category: 'recommended',
            description: 'Pays for additional living expenses if your home becomes uninhabitable due to a covered loss. This includes hotel costs, restaurant meals, and other expenses above your normal living costs.',
            example: 'If a fire makes your home unlivable for 3 months, Loss of Use would cover your hotel stay and increased food costs during that time.',
            price: 200,
          },
          {
            id: 'other-structures',
            name: 'Other Structures',
            category: 'recommended',
            description: 'Covers structures on your property that aren\'t attached to your home, such as detached garages, sheds, fences, and guest houses.',
            example: 'If a tree falls and damages your detached garage, Other Structures coverage would pay for the repairs.',
            price: 150,
          },
        ],
        optional: [
          {
            id: 'water-backup',
            name: 'Water Backup Coverage',
            category: 'optional',
            description: 'Covers damage from water backing up through sewers or drains, or from sump pump failure. Standard home insurance typically excludes this type of damage.',
            example: 'If your sump pump fails and water floods your basement, causing $10,000 in damage, Water Backup Coverage would pay for the repairs.',
            price: 100,
          },
          {
            id: 'earthquake',
            name: 'Earthquake Coverage',
            category: 'optional',
            description: 'Protects your home and belongings from earthquake damage. This is typically excluded from standard home insurance policies.',
            example: 'If an earthquake causes structural damage to your home, Earthquake Coverage would pay for repairs.',
            price: 400,
          },
          {
            id: 'flood',
            name: 'Flood Insurance',
            category: 'optional',
            description: 'Covers damage from flooding, including overflow of bodies of water, heavy rain, and storm surge. Standard home insurance does not cover flood damage.',
            example: 'If heavy rains cause flooding that damages your home, Flood Insurance would cover the repair costs.',
            price: 500,
          },
        ],
      };
    
    case 'life':
      return {
        mandatory: [
          {
            id: 'death-benefit',
            name: 'Death Benefit',
            category: 'mandatory',
            description: 'The primary benefit paid to your beneficiaries upon your death. This is the core coverage of any life insurance policy.',
            example: 'If you have a $500,000 policy and pass away, your beneficiaries would receive the full $500,000 death benefit.',
          },
        ],
        recommended: [
          {
            id: 'accelerated-death-benefit',
            name: 'Accelerated Death Benefit',
            category: 'recommended',
            description: 'Allows you to access a portion of your death benefit if you\'re diagnosed with a terminal illness. This helps cover medical expenses and other costs during your lifetime.',
            example: 'If you\'re diagnosed with a terminal illness and have a $500,000 policy, you might be able to access $250,000 while still alive to cover medical expenses.',
            price: 0, // Usually included
          },
          {
            id: 'waiver-of-premium',
            name: 'Waiver of Premium',
            category: 'recommended',
            description: 'Waives your premium payments if you become disabled and unable to work. This ensures your policy remains in force even if you can\'t pay premiums.',
            example: 'If you become permanently disabled, Waiver of Premium would ensure your life insurance policy continues without requiring premium payments.',
            price: 50,
          },
        ],
        optional: [
          {
            id: 'accidental-death',
            name: 'Accidental Death Benefit',
            category: 'optional',
            description: 'Pays an additional benefit if death occurs due to an accident. This is added on top of your base death benefit.',
            example: 'If you have a $500,000 policy with a $250,000 accidental death benefit and die in an accident, your beneficiaries would receive $750,000 total.',
            price: 100,
          },
          {
            id: 'child-rider',
            name: 'Child Rider',
            category: 'optional',
            description: 'Provides life insurance coverage for your children. This is typically a small amount of coverage that can be converted to a full policy when they reach adulthood.',
            example: 'If you add a Child Rider for $25,000 and your child passes away, you would receive the $25,000 benefit.',
            price: 75,
          },
        ],
      };
    
    case 'health':
      return {
        mandatory: [
          {
            id: 'preventive-care',
            name: 'Preventive Care',
            category: 'mandatory',
            description: 'Covers routine checkups, vaccinations, screenings, and preventive services. This is typically covered at 100% with no deductible.',
            example: 'Your annual physical exam, flu shot, and mammogram would be fully covered under Preventive Care.',
          },
          {
            id: 'emergency-services',
            name: 'Emergency Services',
            category: 'mandatory',
            description: 'Covers emergency room visits, ambulance services, and urgent care. This ensures you\'re protected in medical emergencies.',
            example: 'If you have a medical emergency and need to go to the ER, Emergency Services coverage would help pay for the visit and ambulance.',
          },
        ],
        recommended: [
          {
            id: 'prescription-drugs',
            name: 'Prescription Drug Coverage',
            category: 'recommended',
            description: 'Helps pay for prescription medications. Coverage varies by plan and may include generic, brand-name, and specialty drugs.',
            example: 'If you need a prescription that costs $200, your Prescription Drug Coverage might cover 80%, leaving you to pay $40.',
            price: 150,
          },
          {
            id: 'mental-health',
            name: 'Mental Health Coverage',
            category: 'recommended',
            description: 'Covers therapy, counseling, and mental health services. This is essential for comprehensive health coverage.',
            example: 'If you need therapy sessions that cost $150 each, Mental Health Coverage would help pay for these visits.',
            price: 100,
          },
        ],
        optional: [
          {
            id: 'dental',
            name: 'Dental Coverage',
            category: 'optional',
            description: 'Covers dental exams, cleanings, fillings, and other dental procedures. This is typically separate from medical insurance.',
            example: 'If you need a root canal that costs $1,200, Dental Coverage might cover 50%, leaving you to pay $600.',
            price: 200,
          },
          {
            id: 'vision',
            name: 'Vision Coverage',
            category: 'optional',
            description: 'Covers eye exams, glasses, contact lenses, and vision correction procedures.',
            example: 'If you need new glasses that cost $300, Vision Coverage might cover $200, leaving you to pay $100.',
            price: 120,
          },
        ],
      };
    
    case 'travel':
      return {
        mandatory: [
          {
            id: 'emergency-medical',
            name: 'Emergency Medical',
            category: 'mandatory',
            description: 'Covers medical expenses if you get sick or injured while traveling. This is essential coverage for international travel.',
            example: 'If you break your leg while skiing abroad and need $15,000 in medical treatment, Emergency Medical coverage would pay for those expenses.',
          },
          {
            id: 'emergency-evacuation',
            name: 'Emergency Evacuation',
            category: 'mandatory',
            description: 'Covers the cost of emergency evacuation to a medical facility or back home if you\'re seriously injured or ill.',
            example: 'If you have a medical emergency in a remote location and need to be airlifted to a hospital, Emergency Evacuation would cover the $50,000+ cost.',
          },
        ],
        recommended: [
          {
            id: 'trip-cancellation',
            name: 'Trip Cancellation',
            category: 'recommended',
            description: 'Reimburses you for prepaid, non-refundable trip costs if you need to cancel for a covered reason, such as illness, weather, or family emergency.',
            example: 'If you prepaid $3,000 for a cruise and need to cancel due to illness, Trip Cancellation would reimburse you for the full amount.',
            price: 150,
          },
          {
            id: 'trip-interruption',
            name: 'Trip Interruption',
            category: 'recommended',
            description: 'Covers additional costs if you need to cut your trip short and return home early due to a covered reason.',
            example: 'If you need to return home early from a $5,000 vacation due to a family emergency, Trip Interruption would cover the additional costs.',
            price: 100,
          },
          {
            id: 'baggage',
            name: 'Baggage Coverage',
            category: 'recommended',
            description: 'Covers lost, stolen, or damaged luggage and personal belongings while traveling.',
            example: 'If the airline loses your luggage with $2,000 worth of belongings, Baggage Coverage would reimburse you for the lost items.',
            price: 75,
          },
        ],
        optional: [
          {
            id: 'cancel-for-any-reason',
            name: 'Cancel For Any Reason',
            category: 'optional',
            description: 'Allows you to cancel your trip for any reason and receive a partial refund, typically 50-75% of your trip cost.',
            example: 'If you simply change your mind about a trip, Cancel For Any Reason would give you a partial refund even though it\'s not a covered reason.',
            price: 200,
          },
          {
            id: 'adventure-sports',
            name: 'Adventure Sports Coverage',
            category: 'optional',
            description: 'Covers injuries from adventure activities like skiing, scuba diving, bungee jumping, and other high-risk activities that may be excluded from standard travel insurance.',
            example: 'If you\'re injured while skiing and need $10,000 in medical treatment, Adventure Sports Coverage would pay for it even though standard coverage might exclude it.',
            price: 150,
          },
        ],
      };
    
    default:
      return {
        mandatory: [],
        recommended: [],
        optional: [],
      };
  }
};

