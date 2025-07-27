interface QuotationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface ClientQuotation {
  id: string;
  referenceCode: string;
  clientId: string;
  projectId: string;
  version: number;
  status: string;
  validUntil: string;
  totalAmount: number;
  notes?: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  items: QuotationItem[];
}
