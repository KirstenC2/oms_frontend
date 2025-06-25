<template>
  <div>
    <h2>Departments</h2>
    <div v-if="loading">Loading departments...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else>
      <div class="role-container">
        <CardContent v-for="dept in departments" :key="dept.id" :item="dept" type="department" />
      </div>
    <div v-if="departments.length === 0">No departments found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CardContent from '../components/CardContent.vue'
import axios from 'axios'

const departments = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5001/departments')
    departments.value = res.data
    error.value = null
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch departments'
    departments.value = []
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.role-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.role-card {
  flex: 1 1 calc(33.333% - 16px); /* 3 in a row with gap considered */
  box-sizing: border-box;
}
</style>
