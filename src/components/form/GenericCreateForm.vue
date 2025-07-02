<template>
  <div>
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit">
      <div
        v-for="field in fields"
        :key="field.name"
        class="form-group"
        style="margin-bottom: 12px"
      >
        <label :for="field.name">{{ field.label }}</label>

        <input
          v-if="!field.options"
          :type="field.type || 'text'"
          :id="field.name"
          v-model="formData[field.name]"
          :placeholder="field.placeholder || ''"
          :required="field.required"
        />

        <select
          v-else
          :id="field.name"
          v-model="formData[field.name]"
          :required="field.required"
        >
          <option disabled value="">-- Select {{ field.label }} --</option>
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="result">
      <h3>Result:</h3>
      <pre>{{ result }}</pre>
    </div>

    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Field } from './types'

const props = defineProps<{
  title: string
  fields: Field[]
  submitHandler: (data: Record<string, any>) => Promise<any>
}>()

const result = ref<any>(null)
const error = ref<string | null>(null)
const formData = reactive<Record<string, any>>({})

// Initialize formData keys
watch(
  () => props.fields,
  (fields) => {
    fields.forEach((field) => {
      if (!(field.name in formData)) {
        formData[field.name] = ''
      }
    })
  },
  { immediate: true }
)

const handleSubmit = async () => {
  try {
    const res = await props.submitHandler({ ...formData })
    result.value = res
    error.value = null
  } catch (err: any) {
    result.value = null
    error.value = err?.response?.data?.message || err.message || 'Submission failed'
  }
}
</script>
