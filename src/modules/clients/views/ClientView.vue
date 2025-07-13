<template>
  <main>
    <SubNavBar :tabs="clientTabs" :view="view" @change="setView" />
    <h2>Client</h2>
    <div v-if="view === 'list'">
      <div v-if="loading">Loading clients...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <div class="client-container">
          <CardContent v-for="client in clientList" :key="client.id" :item="client" type="client" @refreshRequest="() => {
            console.log('Event received ✅');
            loadClients()
          }"/>
        </div>
        <div v-if="!clientList.length">No clients found.</div>
      </div>
    </div>
    <div v-else-if="view === 'create'">
      <CreateClientPage title="Create Client" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/CardContent.vue'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import type { Field } from '@/components/form/types'
import { fetchClients } from '@/modules/clients/api/client-api'
import CreateClientPage from '@/modules/clients/views/CreateClientPage.vue'

const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}


const clientTabs = [
  { view: 'list', label: 'Client List' },
  { view: 'create', label: 'Create New Client' }
]



const clientFields = ref<Field[]>([])
const clientList = ref<any[]>([])

const loadClients = async () => {
  loading.value = true
  error.value = null
  try {
    const [clientResponse ] = await Promise.all([
      fetchClients()
    ])
    clientList.value = clientResponse.data
    clientFields.value = [
      { name: 'name', label: 'Client Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text' }
    ]
    if (!clientList.value.length) {
      error.value = 'No clients found'
    }
    loading.value = false
    

  } catch (err) {
    console.error('Failed to load departments or roles', err)
  }
}

onMounted(async () => {
  loadClients()
  console.log('Clients loaded:', clientList.value)
})

</script>

<style scoped>
.client-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.client-card {
  flex: 1 1 calc(33.333% - 16px);
  box-sizing: border-box;
}
</style>
