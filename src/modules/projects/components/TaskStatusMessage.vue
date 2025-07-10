<template>
  <div class="status-messages">
    <!-- Loading State -->
    <div v-if="loading" class="status-message loading">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <span>{{ loadingMessage || 'Loading tasks...' }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="status-message error">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <div>
        <h4>{{ errorTitle || 'Error' }}</h4>
        <p>{{ error || 'Failed to load tasks' }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="showEmptyState" class="status-message empty">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
      </svg>
      <div>
        <h4>{{ emptyTitle || 'No Tasks Found' }}</h4>
        <p>{{ emptyMessage || 'There are no tasks for this project yet.' }}</p>
        <button 
          v-if="showCreateButton" 
          class="create-button"
          @click="$emit('create-task')"
        >
          Create First Task
        </button>
      </div>
    </div>

    <!-- Success State (hidden by default) -->
    <div v-if="showSuccess" class="status-message success">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <div>
        <h4>{{ successTitle || 'Success' }}</h4>
        <p>{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TasksStatusMessage',
  props: {
    loading: Boolean,
    error: String,
    tasks: {
      type: Array,
      default: () => []
    },
    // Custom messages
    loadingMessage: String,
    errorTitle: String,
    emptyTitle: String,
    emptyMessage: String,
    successTitle: String,
    successMessage: String,
    // Flags
    showCreateButton: Boolean,
    showSuccess: Boolean
  },
  emits: ['create-task'],
  setup(props) {
    const showEmptyState = computed(() => {
      return !props.loading && !props.error && (!props.tasks || props.tasks.length === 0)
    })

    return {
      showEmptyState
    }
  }
})
</script>

<style scoped>
.status-messages {
  margin: 2rem 0;
  text-align: center;
}

.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
}

.status-message svg {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.status-message.loading svg {
  color: var(--primary-color);
}

.status-message.error svg {
  color: #ef4444;
}

.status-message.empty svg {
  color: #64748b;
}

.status-message.success svg {
  color: #10b981;
}

.status-message h4 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.status-message p {
  margin: 0;
  color: #64748b;
}

.create-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: var(--primary-dark-color);
}

/* Spinner animation */
.spinner {
  animation: rotate 2s linear infinite;
  margin-bottom: 1rem;
}

.spinner .path {
  stroke: var(--primary-color);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>