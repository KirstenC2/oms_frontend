<template>
  <form @submit.prevent="handleSubmit" class="dynamic-form-container">
    <h2 v-if="title">{{ title }}</h2>

    <div v-for="field in visibleFields" :key="field.name" class="form-group">
      <label :for="field.name">{{ field.label }}</label>

      <input
        v-if="['text', 'email', 'password', 'number', 'date'].includes(field.type)"
        :type="field.type"
        :id="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :disabled="isSubmitting"
      />

      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        :disabled="isSubmitting"
      ></textarea>

      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        v-model="formData[field.name]"
        :disabled="isSubmitting"
      >
        <option disabled value="">-- Select {{ field.label }} --</option>
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <div v-else-if="field.type === 'checkbox'" class="checkbox-wrapper">
        <input
          type="checkbox"
          :id="field.name"
          v-model="formData[field.name]"
          :disabled="isSubmitting"
        />
        <label :for="field.name" class="checkbox-label">{{ field.label }}</label>
      </div>

      <div v-else-if="field.type === 'radio'" class="radio-group-wrapper">
        <div class="radio-options">
          <div v-for="opt in field.options" :key="opt.value" class="radio-option">
            <input
              type="radio"
              :id="`${field.name}-${opt.value}`"
              :name="field.name"
              :value="opt.value"
              v-model="formData[field.name]"
              :disabled="isSubmitting"
            />
            <label :for="`${field.name}-${opt.value}`">{{ opt.label }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : (submitButtonText || 'Submit') }}
      </button>
      <p v-if="submissionError" class="submission-message error">{{ submissionError }}</p>
      <p v-if="submissionSuccess" class="submission-message success">{{ submissionSuccess }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import type { FormField, FormSchema } from '@/types/form'; // Adjust path if needed

// define emits for submission refresh
const emit = defineEmits(['submitSuccess', 'submitError']); // 新增 submitSuccess 和 submitError 事件

const props = defineProps<{
  title?: string; // Optional title for the form
  schema: FormSchema; // The blueprint for this form
  initialData?: Record<string, any>; // Optional data to pre-fill the form (e.g., for updates)
  submitHandler: (data: Record<string, any>) => Promise<any>; // Function to call on successful submission
  submitButtonText?: string;
  purpose?: 'create' | 'update'; // 'create' or 'update' to control conditional fields
}>();

const formData = reactive<Record<string, any>>({});
const isSubmitting = ref(false);
const submissionError = ref<string | null>(null);
const submissionSuccess = ref<string | null>(null);

// Initialize formData based on schema and initialData
const initializeFormData = () => {
  props.schema.forEach(field => {
    // If initialData has a value for this field, use it
    if (props.initialData && Object.prototype.hasOwnProperty.call(props.initialData, field.name)) {
      formData[field.name] = props.initialData[field.name];
    }
    // Else, if the schema has a defaultValue, use that
    else if (field.defaultValue !== undefined) {
      formData[field.name] = field.defaultValue;
    }
    // Else, set default for checkboxes or an empty string for others
    else if (field.type === 'checkbox') {
      formData[field.name] = false;
    } else {
      formData[field.name] = '';
    }
  });
};

// Watch for changes in schema or initialData to re-initialize the form
// This is crucial if your schema or initial data changes after the component is mounted
watch(() => [props.schema, props.initialData], ([newSchema, newInitialData]) => {
  // Clear existing formData properties to ensure clean re-initialization
  for (const key in formData) {
    delete formData[key];
  }
  initializeFormData(); // Re-run initialization
}, { immediate: true, deep: true }); // `immediate` to run on mount, `deep` for nested initialData

// Filters fields based on their 'isVisible' property
const visibleFields = computed(() => {
  return props.schema.filter(field => {
    return field.isVisible ? field.isVisible(formData, props.purpose || 'any') : true;
  });
});

// Handles the form submission
const handleSubmit = async () => {
  isSubmitting.value = true;
  submissionError.value = null; // Clear previous errors
  submissionSuccess.value = null; // Clear previous success messages

  try {
    // Only include data for fields that are currently visible
    const dataToSubmit: Record<string, any> = {};
    visibleFields.value.forEach(field => {
      dataToSubmit[field.name] = formData[field.name];
    });

    // Call the submitHandler provided by the parent component
    const response = await props.submitHandler(dataToSubmit);
    submissionSuccess.value = 'Form submitted successfully!';

    emit('submitSuccess', response); // Emit success event

    // If it's a 'create' purpose, clear the form for new entry
    if (props.purpose === 'create') {
      // Clear reactive formData and re-initialize with defaults
      for (const key in formData) {
        delete formData[key];
      }
      initializeFormData();
    }
  } catch (error: any) {
    console.error('Form submission failed:', error);
    submissionError.value = error.message || 'An unexpected error occurred during submission.';

    // Emit error event
    emit('submitError', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.dynamic-form-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #333;
}

input:not([type='checkbox']),
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

/* Checkbox specific styles */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-top: 1rem; /* Adjust spacing as needed */
}

.checkbox-wrapper input[type='checkbox'] {
  width: auto; /* Override 100% width */
  margin-right: 0.5rem;
  width: 1.1rem; /* Size of the checkbox */
  height: 1.1rem; /* Size of the checkbox */
  cursor: pointer;
}

.checkbox-label {
  margin-bottom: 0; /* Remove default label margin */
  font-weight: normal; /* Make checkbox label less bold */
  cursor: pointer;
}

/* Radio group specific styles */
.radio-group-wrapper {
  margin-top: 1rem;
}

.radio-group-wrapper > label { /* This targets the label if you had one directly above the group */
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.radio-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
}

.radio-option input[type='radio'] {
  width: auto; /* Override 100% width */
  margin-right: 0.5rem;
  width: 1.1rem; /* Size of the radio button */
  height: 1.1rem; /* Size of the radio button */
  cursor: pointer;
}

.radio-option label {
  font-weight: normal;
  cursor: pointer;
}


/* Form actions and messages */
.form-actions {
  margin-top: 2rem;
  text-align: center;
}

button {
  padding: 0.8rem 1.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submission-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.submission-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.submission-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>