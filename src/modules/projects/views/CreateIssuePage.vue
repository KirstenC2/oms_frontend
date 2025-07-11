<template>
  <div class="create-issue-form">
    <h2>Report New Issue</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="issueName">Issue Title:</label>
        <input type="text" id="issueName" v-model="issue.title" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="issue.description" placeholder="Enter issue description..."></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="issue.status" required>
          <option value="">-- Status Of Issue --</option>
          <option v-for="statusOption in ISSUE_STATUS_OPTIONS" :key="statusOption.value" :value="statusOption.value">
            {{ statusOption.text }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priority:</label>
        <select id="priority" v-model="issue.priority" required>
          <option value="">-- Priority Of Issue --</option>
          <option v-for="priorityOption in ISSUE_PRIORITY_OPTIONS" :key="priorityOption.value" :value="priorityOption.value">
            {{ priorityOption.text }}
          </option>
        </select>
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
import type { IssuesFormState } from '@/modules/projects/types/issue-type'; // Adjust path to your Issues type
import { IssuePriority, IssueStatus } from '@/modules/projects/types/issue-type'; // Adjust path to your enums
// import type { TaskFormState } from '@/modules/projects/types/project-types'; // Import Task type
import { createIssue } from '@/modules/projects/api/issue-api'; // Adjust path to your API function
import '@/assets/form.css'; // Import your button styles
const props = defineProps<{
  projectId: string; // Expecting a project ID to associate the issue with
}>();



// Options for the Issue Status dropdown
const ISSUE_STATUS_OPTIONS = [
  { value: IssueStatus.OPEN, text: 'Opened' },
  { value: IssueStatus.IN_PROGRESS, text: 'In progress' },
  { value: IssueStatus.RESOLVED, text: 'Resolved' },
  { value: IssueStatus.CLOSED, text: 'Closed' },
];

const ISSUE_PRIORITY_OPTIONS = [
  { value: IssuePriority.LOW, text: 'Low' },
  { value: IssuePriority.MEDIUM, text: 'Medium' },
  { value: IssuePriority.HIGH, text: 'High' },
];

// Reactive state for the form data
const issue = ref<IssuesFormState>({
  title: '', // Required, but initialize as empty string
  description: '', // Optional, but initialize as empty string
  projectId: props.projectId, // Set from props
  priority: IssuePriority.LOW, // Default priority, adjust as needed
  status: IssueStatus.OPEN, // Default status
});

const isSubmitting = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const emit = defineEmits<{
  (event: 'issue-created', issue: IssuesFormState): void; // Emit event when issue is created
}>();

const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Prepare payload, ensuring assignedToId is undefined if empty string
    const payload = {
      ...issue.value,
    }


    payload.projectId = props.projectId; // Ensure projectId is set from props

    if (!payload.projectId) {
      throw new Error('請輸入任務所屬的專案 ID。');
    }

    console.log('提交任務請求:', payload);
    await createIssue(payload); 

    successMessage.value = '任務已成功建立！';
    errorMessage.value = null;
    
    // Reset form fields after successful submission
    issue.value = {
      projectId: '',
      title: '',
      description: '',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
    };

    // Emit event to notify parent component
    emit('issue-created', payload);
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

.create-issue-form {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  max-width: 600px;
  margin: 40px auto;
  color: #34495e;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e6ed;
}
</style>