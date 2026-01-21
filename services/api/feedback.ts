// Mock feedback data
const mockFeedbacks = [
  {
    id: 'feedback_1',
    userId: '1',
    category: 'feature' as const,
    title: 'Dark mode support',
    message: 'Would love to see dark mode support in the app. It would be easier on the eyes during night time usage.',
    rating: 5,
    status: 'resolved' as const,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    response: 'Thank you for your feedback! Dark mode has been implemented and is now available in the app settings.',
    respondedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback_2',
    userId: '1',
    category: 'improvement' as const,
    title: 'Faster claim processing',
    message: 'The claim submission process could be streamlined. Currently it takes too many steps.',
    rating: 4,
    status: 'in-review' as const,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback_3',
    userId: '1',
    category: 'compliment' as const,
    title: 'Great app design!',
    message: 'I really love the modern design and user-friendly interface. Keep up the great work!',
    rating: 5,
    status: 'submitted' as const,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const feedbackAPI = {
  // Get all feedbacks for the current user
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [...mockFeedbacks],
    };
  },

  // Get feedback statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const total = mockFeedbacks.length;
    const byCategory: Record<string, number> = {
      bug: 0,
      feature: 0,
      improvement: 0,
      complaint: 0,
      compliment: 0,
      other: 0,
    };
    let totalRating = 0;
    let ratingCount = 0;
    let resolved = 0;
    let pending = 0;

    mockFeedbacks.forEach(feedback => {
      byCategory[feedback.category] = (byCategory[feedback.category] || 0) + 1;
      if (feedback.rating) {
        totalRating += feedback.rating;
        ratingCount++;
      }
      if (feedback.status === 'resolved') {
        resolved++;
      } else if (feedback.status === 'in-review' || feedback.status === 'submitted') {
        pending++;
      }
    });

    return {
      data: {
        total,
        byCategory,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        resolved,
        pending,
      },
    };
  },

  // Submit new feedback
  submit: async (data: {
    category: string;
    title: string;
    message: string;
    rating?: number;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newFeedback = {
      id: `feedback_${Date.now()}`,
      userId: '1',
      category: data.category as any,
      title: data.title,
      message: data.message,
      rating: data.rating ?? 0,
      status: 'submitted' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFeedbacks.unshift(newFeedback);
    return {
      data: newFeedback,
    };
  },

  // Delete feedback
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockFeedbacks.findIndex(f => f.id === id);
    if (index > -1) {
      mockFeedbacks.splice(index, 1);
    }
    return {
      data: { success: true },
    };
  },
};

