<template>
  <nav class="sub-navbar">
    <button
      v-for="tab in tabs"
      :key="tab.view"
      :class="{ active: view === tab.view }"
      @click="$emit('change', tab.view)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  tabs: Array,     // [{ view: 'list', label: 'User List' }, ...]
  view: String     // current active view
})

defineEmits(['change']) // emits 'change' with selected view
</script>

<style scoped>
.sub-navbar {
  display: flex;
  gap: 8px;
}
button.active {
  font-weight: bold;
  border-bottom: 2px solid #333;
}
</style>
