<template>
  <div class="card-content">
    <h3 class="title-name">{{ title }}</h3>
    <ul>
      <li
        v-for="(value, key) in displayFields"
        :key="key"
      >
        <strong>{{ key }}:</strong> {{ value }}
      </li>

    </ul>
    <slot />
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: Record<string, any>,
  type: 'user' | 'department' | 'role',
}>()

const title = computed(() => {
  if (props.type === 'user') return props.item.name || props.item.email || 'User'
  if (props.type === 'department') return props.item.name || 'Department'
  if (props.type === 'role') return props.item.name || 'Role'
  return ''
})

const displayFields = computed(() => {
  if (props.type === 'user') {
    return {
      Name: props.item.name,
      Email: props.item.email,
      'Department Name': props.item.department?.name,
      Role: props.item.role?.name
    }
  }
  if (props.type === 'department') {
    return {
      // ID: props.item.id,
      Name: props.item.name,
      Description: props.item.description,
    }
  }
  if (props.type === 'role') {
    return {
      // ID: props.item.id,
      Name: props.item.name,
      Description: props.item.description,
    }
  }
  return {}
})
</script>

<style scoped>
.card-content {
  border: 1px solid #dddddfdf;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #eef5f8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  color: black;
}
h3 {
  margin-top: 0;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.3rem;
}

.title-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #214276; /* example color */
  margin-bottom: 10px;
}

</style>