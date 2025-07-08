interface SelectOption {
  value: string;
  text: string;
}

export const LEAVE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'ANNUAL', text: 'Annual Leave' },
  { value: 'SICK', text: 'Sick Leave' },
  { value: 'UNPAID', text: 'Unpaid Leave' },
  { value: 'MEDICAL', text: 'Medical Leave' }
];