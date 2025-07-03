<template>
  <div class="page-wrapper">
    <DynamicForm
      title="Create New Role"
      :schema="roleFormSchema"
      :submitHandler="handleCreateRole"
      submitButtonText="Create Role"
      purpose="create"
      />
  </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/form/DynamicForm.vue';
import { roleFormSchema } from '@/schemas/roleFormSchema'; // Import your role form schema
import { createDepartment } from '@/components/utils/api'; 


const handleCreateRole = async (formData: Record<string, any>) => {
  console.log('Attempting to submit role data:', formData);
  try {
    const response = await createDepartment(formData); // Execute the API call
    console.log('Role creation successful (API layer response):', response);
    
    return response; // Return the response; DynamicForm can use this for internal success handling (e.g., clearing form fields)
  } catch (error: any) {
    console.error('API Error: Failed to create role:', error);
    // Crucially, throw the error so DynamicForm can catch it and display an error message
    throw new Error(error.message || 'Failed to create role. Please try again.');
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