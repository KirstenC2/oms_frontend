<template>
  <span :class="['status-badge', status.toLowerCase()]">
    {{ formattedStatus }}
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const formattedStatus = computed(() => {
      return props.status.split('_').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ')
    })

    return { formattedStatus }
  }
})
</script>