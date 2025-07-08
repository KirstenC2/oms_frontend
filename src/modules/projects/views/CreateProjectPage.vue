<template>
  <div class="create-project-form">
    <h2>Create Project</h2>
    <form @submit.prevent="handleSubmit">
      <label>
        Project Name:
        <input type="text" v-model="project.name" required />
      </label>

      <label>
        Description:
        <textarea v-model="project.description" />
      </label>

      <label>
        Start Date:
        <input type="datetime-local" v-model="project.startDate" required />
      </label>

      <label>
        End Date:
        <input type="datetime-local" v-model="project.endDate" required />
      </label>

      <!-- <label>
        Manager ID:
        <input type="text" v-model="project.managerId" />
      </label> -->

      <button type="submit">Submit Project</button>
    </form>

    <div v-if="successMessage" style="color:green;">{{ successMessage }}</div>
    <div v-if="errorMessage" style="color:red;">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createProject } from '@/modules/projects/api/project-api' 

const project = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  managerId: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  try {
    const payload = {
      ...project.value,
      startDate: new Date(project.value.startDate).toISOString(),
      endDate: new Date(project.value.endDate).toISOString()
    }

    await createProject(payload)

    successMessage.value = 'Project created successfully!'
    errorMessage.value = ''
    project.value = {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      managerId: ''
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to create project'
    successMessage.value = ''
  }
}
</script>

<style scoped>
.create-project-form {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  margin: auto;
  color: darkcyan;
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
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 6px 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

</style>
