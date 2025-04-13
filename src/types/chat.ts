
// Types for chat messages and context
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatFormData {
  fullName: string;
  propertyAddress: string;
  loanAmount: string;
  email: string;
  phone: string;
  dealType?: string;
  businessName?: string;
  investmentGoals?: string;
  propertyType?: string;
  targetLocation?: string;
  timeframe?: string;
  serviceRequested?: string;
}
