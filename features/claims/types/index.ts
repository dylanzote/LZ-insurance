export type ClaimStatus = 
  | 'submitted' 
  | 'document-verification' 
  | 'surveyor-assigned' 
  | 'assessment' 
  | 'settlement' 
  | 'approved' 
  | 'rejected' 
  | 'processing'
  | 'in-review';

export interface ClaimTimelineEvent {
  id: string;
  status: ClaimStatus;
  date: string;
  description?: string;
  assignedTo?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  policyType: 'auto' | 'home' | 'life' | 'health';
  status: ClaimStatus;
  title: string;
  description: string;
  date: string;
  incidentDate: string;
  amount: number;
  location?: string;
  assignedTo?: string;
  documents: Array<{ uri: string; name: string; type: string; size?: number }>;
  images: Array<{ uri: string; name: string; type: string; size?: number }>;
  category: string;
  createdAt: string;
  updatedAt: string;
  timeline?: ClaimTimelineEvent[];
}

export interface ClaimFormData {
  policyId: string;
  policyType: 'auto' | 'home' | 'life' | 'health';
  title: string;
  description: string;
  incidentDate: string;
  amount: string;
  location: string;
  category: string;
  documents: any[];
  images: any[];
}

export interface ClaimCategory {
  id: string;
  name: string;
  description: string;
  policyType: 'auto' | 'home' | 'life' | 'health';
}