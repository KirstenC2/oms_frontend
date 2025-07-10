<template>
  <div class="create-task-form">
    <h2>建立新任務</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="taskName">任務名稱:</label>
        <input type="text" id="taskName" v-model="task.name" required />
      </div>

      <div class="form-group">
        <label for="description">任務描述:</label>
        <textarea id="description" v-model="task.description" placeholder="輸入任務描述..."></textarea>
      </div>

      <!-- <div class="form-group">
        <label for="projectId">所屬專案 ID:</label>
        <input type="text" id="projectId" v-model="task.projectId" required placeholder="輸入任務所屬專案的 ID" />
        <small>(此任務將屬於此專案)</small>
      </div> -->

      <div class="form-group">
        <label for="startDate">開始日期時間:</label>
        <!-- Use datetime-local for full timestamp input -->
        <input type="datetime-local" id="startDate" v-model="task.startDate" required />
      </div>

      <div class="form-group">
        <label for="endDate">結束日期時間:</label>
        <!-- Use datetime-local for full timestamp input -->
        <input type="datetime-local" id="endDate" v-model="task.endDate" required />
      </div>

      <div class="form-group">
        <label for="status">狀態:</label>
        <select id="status" v-model="task.status" required>
          <option value="">-- 請選擇狀態 --</option>
          <option v-for="statusOption in TASK_STATUS_OPTIONS" :key="statusOption.value" :value="statusOption.value">
            {{ statusOption.text }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="assignedToId">指派給 (用戶 ID):</label>
        <input type="text" id="assignedToId" v-model="task.assignedToId" placeholder="輸入指派用戶的 ID (可選)" />
        <small>(可選，輸入現有用戶的 ID)</small>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '建立中...' : '送出任務請求' }}
      </button>
    </form>

    <div v-if="successMessage" class="message success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="message error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TaskStatus } from '@/modules/projects/types/project-types'; // Adjust path to your enums
import type { TaskFormState } from '@/modules/projects/types/project-types'; // Import Task type
import { createTask } from '@/modules/projects/api/project-api'; // Adjust path to your API function

const props = defineProps<{
  projectId: string; // Expecting a project ID to associate the task with
}>();



// Options for the Task Status dropdown
const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.NOT_STARTED, text: '未開始' },
  { value: TaskStatus.IN_PROGRESS, text: '進行中' },
  { value: TaskStatus.COMPLETED, text: '已完成' },
  { value: TaskStatus.ON_HOLD, text: '暫停' },
  { value: TaskStatus.CANCELLED, text: '已取消' },
];

// Reactive state for the form data
const task = ref<TaskFormState>({
  projectId: '', // Required
  name: '',      // Required
  description: '', // Optional, but initialize as empty string
  startDate: '', // Will be YYYY-MM-DDTHH:mm from datetime-local input
  endDate: '',   // Will be YYYY-MM-DDTHH:mm from datetime-local input
  status: TaskStatus.NOT_STARTED, // Default status
  assignedToId: undefined, // Use undefined for optional fields that are not set
});

const isSubmitting = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const emit = defineEmits<{
  (event: 'task-created', task: TaskFormState): void; // Emit event when task is created
}>();

const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Prepare payload, ensuring assignedToId is undefined if empty string
    const payload = {
      ...task.value,
      startDate: new Date(task.value.startDate).toISOString(),
      endDate: new Date(task.value.endDate).toISOString()
    }
    // console.log("props:", props.projectId);
    // payload.projectId = props.projectId;
    console.log("payload:", payload);
    if (typeof payload.assignedToId === 'string' && payload.assignedToId.trim() === '') {
      payload.assignedToId = undefined;
    }
    payload.projectId = props.projectId; // Ensure projectId is set from props
    // CRITICAL: Ensure projectId is not empty
    if (!payload.projectId) {
      throw new Error('請輸入任務所屬的專案 ID。');
    }

    // Dates from datetime-local are already in ISO-like string format (YYYY-MM-DDTHH:mm)
    // NestJS DTO with @IsDateString() should handle this directly.
    // No need for .toISOString() here if input type is datetime-local.
    // If your backend expects YYYY-MM-DDTHH:mm:ss.sssZ, you might need to convert.
    // For now, assuming NestJS handles YYYY-MM-DDTHH:mm from datetime-local.

    console.log('提交任務請求:', payload);
    await createTask(payload); // Use projectService.createTask

    successMessage.value = '任務已成功建立！';
    errorMessage.value = null;
    
    // Reset form fields after successful submission
    task.value = {
      projectId: '',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: TaskStatus.NOT_STARTED,
      assignedToId: undefined,
    };

    // Emit event to notify parent component
    emit('task-created', payload);
    console.log('event emitted');

  } catch (err: any) {
    console.error('提交任務請求失敗:', err);
    errorMessage.value = err.response?.data?.message || err.message || '提交任務請求失敗。';
    successMessage.value = null;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.create-task-form {
  background: #f0f8ff;
  padding: 30px;
  border-radius: 10px;
  max-width: 550px;
  margin: 30px auto;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #0056b3;
  margin-bottom: 25px;
  font-size: 1.8em;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="datetime-local"],
textarea,
select {
  width: calc(100% - 24px); /* Account for padding and border */
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus,
input[type="datetime-local"]:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

small {
  color: #888;
  font-size: 0.85em;
  margin-top: 5px;
  display: block;
}

button[type="submit"] {
  padding: 12px 25px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.2s ease, transform 0.1s ease;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  background-color: #a0c8f5;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>