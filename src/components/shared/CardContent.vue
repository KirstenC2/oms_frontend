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
      <button @click="deleteItem">Remove</button>
      <button @click="requestEdit">Update</button>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { deleteDepartment, fetchDepartments, deleteRole, deleteUser } from '../utils/api' // ✅ This is the delete API you're calling

const props = defineProps<{
  item: Record<string, any>,
  type: 'user' | 'department' | 'role',
}>()

const emit = defineEmits<{
  (e: 'refreshRequest'): void,
  (e: 'requestEdit', item: Record<string, any>): void
}>()

const requestEdit = () => {
  emit('requestEdit', props.item)
}

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
      // Name: props.item.name,
      Description: props.item.description,
    }
  }
  if (props.type === 'role') {
    return {
      Name: props.item.name,
      Description: props.item.description,
    }
  }
  return {}
})

// ✅ Main API call logic — passes props.item.id to deleteDepartment
const deleteItem = async () => {
  try {
    if (props.type === 'department') {
      await deleteDepartment(props.item.id)
  
      console.log(`Department ${props.item.id} deleted successfully.`)
      emit('refreshRequest')
    }
    else if (props.type === 'user') {
      await deleteUser(props.item.id)
  
      console.log(`User ${props.item.id} deleted successfully.`)
      emit('refreshRequest')
    }
    else if (props.type === 'role') {
      await deleteRole(props.item.id)
  
      console.log(`Role ${props.item.id} deleted successfully.`)
      emit('refreshRequest')
    } else {
      console.warn('Unknown type for deletion:', props.type)
    }

  } catch (err) {
    console.error('Error deleting department:', err)
  }
}

const updateItem = async () => {
  try {
    if (props.type === 'department') {
      // await updateDepartment(props.item.id, props.item)
    } else if (props.type === 'user') {
      console.log('Update user logic here')
      
      // await updateUser(props.item.id, props.item)
    } else if (props.type === 'role') {
      // await updateRole(props.item.id, props.item)
    }
    // emit('updated') // 💡 Notify parent to refresh
  } catch (err) {
    console.error('Error updating:', err)
  }
}
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