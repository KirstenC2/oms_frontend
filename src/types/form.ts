// src/types/form.ts

export type FormOption = {
  value: string | number;
  label: string;
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  defaultValue?: any;
  options?: FormOption[];
  isVisible?: (formData: Record<string, any>, purpose: 'create' | 'update' | 'any') => boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
};

export type FormSchema = FormField[];