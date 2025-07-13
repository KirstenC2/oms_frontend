<template>
  <div class="create-client-form page-wrapper">
    <h2>Create Client</h2>
    <form @submit.prevent="handleSubmit">
      <label>
        Name:
        <input type="text" v-model="client.name" required />
      </label>

      <label>
        Email:
        <input type="email" v-model="client.email" />
      </label>

      <label>
        Phone:
        <input type="tel" v-model="client.phone" />
      </label>

      <label>
        Company:
        <input type="text" v-model="client.company" />
      </label>

      <label>
        Notes:
        <textarea v-model="client.notes" placeholder="Optional notes..."></textarea>
      </label>

      <button type="submit">Create Client</button>
    </form>

    <div v-if="successMessage" style="color: green;">{{ successMessage }}</div>
    <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createClient } from '@/modules/clients/api/client-api'

const client = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  try {
    await createClient(client.value)
    successMessage.value = 'Client created successfully!'
    errorMessage.value = ''

    // Reset form
    client.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to create client'
    successMessage.value = ''
  }
}
</script>

<style scoped>
.create-client-form {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  margin: auto;
  color: #005b66;
}

label {
  display: block;
  margin-bottom: 12px;
}

input,
textarea {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 6px 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-wrapper {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}
</style>
