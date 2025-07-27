<template>
  <main>
    <SubNavBar :tabs="vendorTabs" :view="view" @change="setView" />
    <h2>vendor</h2>
    <div v-if="view === 'list'">
      <div v-if="loading">Loading vendors...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else>
        <div class="vendor-container">
          <CardContent v-for="vendor in vendorList" :key="vendor.id" :item="vendor" type="vendor" @refreshRequest="() => {
            console.log('Event received ✅');
            loadvendors()
          }"/>
        </div>
        <div v-if="!vendorList.length">No vendors found.</div>
      </div>
    </div>
    <!-- <div v-else-if="view === 'create'">
      <CreatevendorPage title="Create vendor" />
    </div> -->
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/CardContent.vue'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import type { Field } from '@/components/form/types'
import { fetchVendors } from '../api/crm-api';

const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}


const vendorTabs = [
  { view: 'list', label: 'vendor List' },
  { view: 'create', label: 'Create New vendor' }
]



const vendorFields = ref<Field[]>([])
const vendorList = ref<any[]>([])

const loadvendors = async () => {
  loading.value = true
  error.value = null
  try {
    const [vendorResponse ] = await Promise.all([
      fetchVendors()
    ])
    vendorList.value = vendorResponse.data
    vendorFields.value = [
      { name: 'name', label: 'vendor Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text' }
    ]
    if (!vendorList.value.length) {
      error.value = 'No vendors found'
    }
    loading.value = false
    // console.log('vendors loaded:', vendorList.value)

  } catch (err) {
    console.error('Failed to load departments or roles', err)
  }
}

onMounted(async () => {
  loadvendors()
  console.log('vendors loaded:', vendorList.value)
})

</script>

<style scoped>
.vendor-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.vendor-card {
  flex: 1 1 calc(33.333% - 16px);
  box-sizing: border-box;
}
</style>
