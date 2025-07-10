<template>
    <div class="create-leave-form">
        <h2>Create Leave Request</h2>
        <form @submit.prevent="handleSubmit">
            <label>
                Employee:
                <select v-model="leave.employeeId" required>
                    <option value="">-- Select Employee --</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
            </label>
            <br />
            <label>
                Type:
                <select v-model="leave.type" required>ß
                    <option value="">-- Select Type --</option>
                    <option v-for="option in LEAVE_TYPE_OPTIONS" :key="option.value" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </label>
            <br />

            <label>
                Start Date:
                <input type="datetime-local" v-model="leave.startDate" required />
            </label>
            <br />

            <label>
                End Date:
                <input type="datetime-local" v-model="leave.endDate" required />
            </label>
            <br />

            <label>
                Reason:
                <textarea v-model="leave.reason" placeholder="Optional..."></textarea>
            </label>
            <br />

            <button type="submit">Submit Leave Request</button>
        </form>

        <div v-if="successMessage" style="color:green;">{{ successMessage }}</div>
        <div v-if="errorMessage" style="color:red;">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchUsers } from '@/modules/users/api/user-api'
import { createLeaveRequest } from '@/modules/leaves/api/leave-api'
import { LEAVE_TYPE_OPTIONS } from '@/modules/leaves/utils/leave-constants'
import type { User } from '@/modules/users/types/user-types'
const users = ref<User[]>([])
const leave = ref({
    employeeId: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
})

const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
    try {
        const [userList] = await Promise.all([
            fetchUsers()
        ])
        users.value = userList.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email
        }))
    } catch (err) {
        errorMessage.value = 'Failed to fetch users'
    }
})

const handleSubmit = async () => {
    try {
        let payload = {
            ...leave.value,
            startDate: new Date(leave.value.startDate).toISOString(),
            endDate: new Date(leave.value.endDate).toISOString()
        }
        console.log('Submitting leave request:', payload)
        await createLeaveRequest(payload)

        successMessage.value = 'Leave request submitted successfully!'
        errorMessage.value = ''

        payload = {
            employeeId: '',
            type: '',
            startDate: '',
            endDate: '',
            reason: ''
        } // Reset form
        leave.value = payload

    } catch (err: any) {
        errorMessage.value = err.response?.data?.message || 'Failed to submit leave request'
        successMessage.value = ''
    }
}
</script>

<style scoped>
.create-leave-form {
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

button {
    padding: 6px 14px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
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
