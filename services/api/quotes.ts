import { useConfigStore } from '@/core/config/store';

let mockQuotes: any[] = [];

export const quotesAPI = {
  // Get all quotes
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: mockQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  },

  // Get quote by ID
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const quote = mockQuotes.find(q => q.id === id);
    if (!quote) throw new Error('Quote not found');
    return { data: quote };
  },

  // Calculate quote
  calculate: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Base premium calculation based on type
    let basePremium = 0;
    const discounts: any[] = [];
    const adjustments: any[] = [];

    switch (data.type) {
      case 'auto':
        basePremium = 1200; // Annual base
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 400 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -200, percentage: -16.67 });
        }
        if (data.details?.deductible && data.details.deductible >= 1000) {
          discounts.push({ name: 'High Deductible', amount: -150, percentage: -12.5 });
        }
        break;
      case 'motorcycle':
        basePremium = 800; // Annual base - typically cheaper than auto
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 300 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -150, percentage: -18.75 });
        }
        if (data.details?.deductible && data.details.deductible >= 1000) {
          discounts.push({ name: 'High Deductible', amount: -120, percentage: -15 });
        }
        break;
      case 'home':
        basePremium = 1500;
        if (data.details?.coverageLevel === 'premium') {
          adjustments.push({ name: 'Premium Coverage', amount: 500 });
        } else if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Coverage', amount: -300, percentage: -20 });
        }
        break;
      case 'life':
        basePremium = (data.details?.coverageAmount || 500000) * 0.001; // 0.1% of coverage
        if (data.details?.healthStatus === 'excellent') {
          discounts.push({ name: 'Excellent Health', amount: -basePremium * 0.2, percentage: -20 });
        }
        if (!data.details?.smoker) {
          discounts.push({ name: 'Non-Smoker', amount: -basePremium * 0.15, percentage: -15 });
        }
        break;
      case 'health':
        basePremium = data.details?.familySize && data.details.familySize > 1 
          ? 6000 
          : 3600;
        if (data.details?.coverageLevel === 'basic') {
          discounts.push({ name: 'Basic Plan', amount: -600, percentage: -10 });
        }
        break;
      case 'travel':
        basePremium = (data.details?.tripDuration || 7) * 15;
        if (data.details?.travelers && data.details.travelers > 1) {
          adjustments.push({ name: 'Multiple Travelers', amount: (data.details.travelers - 1) * 50 });
        }
        break;
    }

    const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
    const adjustmentTotal = adjustments.reduce((sum, a) => sum + a.amount, 0);
    const subtotal = basePremium + discountTotal + adjustmentTotal;
    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + taxes;
    const monthlyPremium = total / 12;
    const annualPremium = total;

    return {
      data: {
        basePremium,
        discounts,
        adjustments,
        subtotal,
        taxes,
        total,
        monthlyPremium: Math.round(monthlyPremium * 100) / 100,
        annualPremium: Math.round(annualPremium * 100) / 100,
      },
    };
  },

  // Create quote
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate quote first
    const calculation = await quotesAPI.calculate(data);
    
    const newQuote = {
      id: `quote_${Date.now()}`,
      userId: '1',
      type: data.type,
      status: 'pending' as const,
      personalInfo: data.personalInfo,
      details: data.details,
      monthlyPremium: calculation.data.monthlyPremium,
      annualPremium: calculation.data.annualPremium,
      coverageAmount: data.details?.coverageAmount,
      deductible: data.details?.deductible,
      expiresAt: new Date(Date.now() + (useConfigStore.getState().config.business.quoteExpirationDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockQuotes.unshift(newQuote);
    return { data: newQuote };
  },

  // Convert quote to policy
  convertToPolicy: async (quoteId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const quote = mockQuotes.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');
    
    // In real app, this would create a policy
    const policyId = `POL-${Date.now()}`;
    quote.status = 'converted';
    quote.convertedToPolicyId = policyId;
    quote.updatedAt = new Date().toISOString();
    
    return {
      data: {
        success: true,
        policyId,
        message: 'Quote converted to policy successfully',
      },
    };
  },

  // Delete quote
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockQuotes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    mockQuotes.splice(index, 1);
    return { data: { success: true } };
  },
};

