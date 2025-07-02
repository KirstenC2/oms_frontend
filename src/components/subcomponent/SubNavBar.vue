<template>
  <nav class="sub-navbar" role="tablist">
    <ul class="tab-list">
      <li
        v-for="tab in tabs"
        :key="tab.view"
        role="presentation"
      >
        <button
          role="tab"
          :aria-selected="view === tab.view ? 'true' : 'false'"
          :tabindex="view === tab.view ? 0 : -1"
          :class="{ active: view === tab.view, disabled: tab.disabled }"
          @click="selectTab(tab)"
          :disabled="tab.disabled"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Tab {
  view: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  tabs: Tab[]
  view: string
}>()

const emit = defineEmits<{
  (e: 'change', view: string): void
}>()

function selectTab(tab: Tab) {
  if (!tab.disabled && tab.view !== props.view) {
    emit('change', tab.view)
  }
}
</script>

<style scoped>
.sub-navbar {
  overflow-x: auto;
  border-bottom: 2px solid #eee;
}
.tab-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 12px;
}
button {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 1rem;
  color: #aca8c6;
  position: relative;
  transition: color 0.3s;
}
button:focus {
  outline: 2px solid #677f9c;
  outline-offset: 2px;
}
button.active {
  color: #1feff3;
  font-weight: 700;
}
button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 3px;
  background-color: #4a90e2;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
}
button.disabled {
  color: #aaa;
  cursor: not-allowed;
}
</style>
