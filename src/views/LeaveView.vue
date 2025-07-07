<template>
  <main>
    <SubNavBar :tabs="leaveTabs" :view="view" @change="setView" />
    <h2>Leave</h2>
    <!-- <UsersUpdateForm v-if="view === 'update'" />
    <CreateUserPage v-else-if="view === 'create'" title="Create Leave" :fields="userFields"
      :submitHandler="createUser" /> -->
    <div v-if="view === 'list'">
      <div v-if="loading">Loading leave request...</div>
      <div v-else-if="error" style="color:red;">{{ error }}</div>
      <div v-else class="user-container">
        <div v-if="leaveList.length === 0">No users found.</div>

        <!-- Leave Requests Table Section -->
        <div class="leave-section">
          <h3>All Leave Requests</h3>
          <table class="leave-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="leave in leaveList" :key="leave.id">
                <td>{{ leave.employee.name }}</td>
                <td>{{ leave.employee.email }}</td>
                <td>{{ leave.type }}</td>
                <td>{{ leave.startDate }}</td>
                <td>{{ leave.endDate }}</td>
                <td>{{ leave.reason }}</td>
                <td>{{ leave.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '../components/CardContent.vue'
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import type { Field } from '@/components/form/types'
import { fetchLeaveRequests } from '@/components/utils/api'


const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const view = ref('list')
const setView = (v: string) => {
  view.value = v
}


const leaveTabs = [
  { view: 'list', label: 'Leave List' },
  { view: 'update', label: 'Update Leave Info' },
  { view: 'create', label: 'Create New Leave' }
]


function navigate(target: string) {
  if (target === 'leaves') router.push('/leaves')
  if (target === 'departments') router.push('/departments')
  if (target === 'roles') router.push('/roles')
}

// function setView(target: 'list' | 'update' | 'create') {
//   view.value = target
// }

const userFields = ref<Field[]>([])
const leaveList = ref<any[]>([])

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const [leaveResponse] = await Promise.all([
      fetchLeaveRequests()
    ])

    const leaves = leaveResponse.data

    // check for listing status
    if (!leaves || leaves.length === 0) {
      error.value = 'No leaves found'
    } else {
      loading.value = false
      leaveList.value = leaves
    }
  } catch (err) {
    console.error('Failed to load leave', err)
  }
}

onMounted(async () => {
  loadUsers()
  console.log('leaves loaded:', leaveList.value)
})

</script>

<style scoped>
.leave-table {
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  color: cadetblue;
}

.leave-table th,
.leave-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.leave-table th {
  background-color: #eee;
}
</style>

