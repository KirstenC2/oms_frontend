interface Employee {
  name: string;
  email: string;
}


export interface LeaveRequest {
  id: string;
  employee: Employee;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface Tab { // If you define Tab here or import it
  label: string;
  value: string;
  view: string; // The property that TypeScript is complaining about
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'textarea';
  required: boolean;
  options?: string[]; // Optional property for 'select' type fields
}