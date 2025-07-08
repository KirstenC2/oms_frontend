<template>
  <div class="page-wrapper">
    <DynamicForm
      title="Create New Department"
      :schema="departmentFormSchema"
      :submitHandler="handleCreateDepartment"
      submitButtonText="Create Department"
      purpose="create"
      />
  </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/form/DynamicForm.vue';
import { departmentFormSchema } from '@/schemas/departmentFormSchema'; // Import your department form schema
import { createDepartment } from '@/modules/departments/department-api'; 


const handleCreateDepartment = async (formData: Record<string, any>) => {
  console.log('Attempting to submit department data:', formData);
  try {
    const response = await createDepartment(formData); // Execute the API call
    console.log('Department creation successful (API layer response):', response);
    
    return response; // Return the response; DynamicForm can use this for internal success handling (e.g., clearing form fields)
  } catch (error: any) {
    console.error('API Error: Failed to create department:', error);
    // Crucially, throw the error so DynamicForm can catch it and display an error message
    throw new Error(error.message || 'Failed to create department. Please try again.');
  }
};


</script>

<style scoped>
.page-wrapper {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}
</style>