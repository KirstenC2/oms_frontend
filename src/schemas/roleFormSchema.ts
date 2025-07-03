// src/schemas/departmentFormSchema.ts
import type { FormSchema } from '@/types/form'; // Ensure this path is correct

export const roleFormSchema: FormSchema = [
  {
    name: 'name',
    label: 'Role Name',
    type: 'text', // Simple text input
    // require : true, // Role name is essential
    placeholder: 'e.g., Manager, Consultant, Project Lead',
    // validation: [
    //   {
    //     type: 'min_length',
    //     value: 2,
    //     message: 'Role name must be at least 2 characters long.',
    //   },
    //   {
    //     type: 'max_length',
    //     value: 50,
    //     message: 'Role name cannot exceed 50 characters.',
    //   },
    //   // For uniqueness validation, it's generally best handled on the backend
    //   // but client-side pre-checks are possible with custom validation.
    // ],
  },
  {
    name: 'description',
    label: 'Role Description',
    type: 'textarea', // Allows for multi-line text input
    // required: false, // Description is optional
    placeholder: 'Provide a detailed description of the role\'s responsibilities and functions.',
    // validation: [
    //   {
    //     type: 'max_length',
    //     value: 500,
    //     message: 'Role description cannot exceed 500 characters.',
    //   },
    // ],
  },
];