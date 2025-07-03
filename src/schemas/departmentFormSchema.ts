// src/schemas/departmentFormSchema.ts
import type { FormSchema } from '@/types/form'; // Ensure this path is correct

export const departmentFormSchema: FormSchema = [
  {
    name: 'name',
    label: 'Department Name',
    type: 'text', // Simple text input
    // require : true, // Department name is essential
    placeholder: 'e.g., Research & Development, Marketing, Human Resources',
    // validation: [
    //   {
    //     type: 'min_length',
    //     value: 2,
    //     message: 'Department name must be at least 2 characters long.',
    //   },
    //   {
    //     type: 'max_length',
    //     value: 50,
    //     message: 'Department name cannot exceed 50 characters.',
    //   },
    //   // For uniqueness validation, it's generally best handled on the backend
    //   // but client-side pre-checks are possible with custom validation.
    // ],
  },
  {
    name: 'description',
    label: 'Department Description',
    type: 'textarea', // Allows for multi-line text input
    // required: false, // Description is optional
    placeholder: 'Provide a detailed description of the department\'s responsibilities and functions.',
    // validation: [
    //   {
    //     type: 'max_length',
    //     value: 500,
    //     message: 'Department description cannot exceed 500 characters.',
    //   },
    // ],
  },
];