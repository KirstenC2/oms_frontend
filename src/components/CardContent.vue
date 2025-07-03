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
      <button v-if="props.type === 'user' && props.item.status === 'ACTIVE' " @click="deactivateUser" >Deactivate</button>
      <button v-if="props.type === 'user' && props.item.status === 'INACTIVE' " @click="activateUser" >Activate</button>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { deleteDepartment, fetchDepartments, deleteRole, deleteUser, deactiveUser, activateUser as activateAPI } from './utils/api' // ✅ This is the delete API you're calling

const props = defineProps<{
  item: Record<string, any>,
  type: 'user' | 'department' | 'role',
}>()

const emit = defineEmits<{
  (e: 'refreshRequest'): void
}>()


const title = computed(() => {
  if (props.type === 'user') return props.item.name || props.item.email || 'User'
  if (props.type === 'department') return props.item.name || 'Department'
  if (props.type === 'role') return props.item.name || 'Role'
  return ''
})

const displayFields = computed(() => {
  if (props.type === 'user') {
    // console.log('User item:', props.item)
    return {
      // Name: props.item.name,
      Email: props.item.email,
      'Department Name': props.item.department?.name,
      Role: props.item.role?.name,
      Status: props.item.status || 'N/A' // <-- Access status directly
    }
  }
 if (props.type === 'department') {
    // This assumes your backend returns { id, name, description, userCount, manager }
    const fields: Record<string, any> = {
      ID: props.item.id,
      Name: props.item.name,
      // Only show description if it exists (it's optional in the schema)
      ...(props.item.description && { Description: props.item.description }),
      'Total Members': props.item.userCount || 0, // <-- Access userCount directly
    };

    // Add manager if available
    if (props.item.manager && props.item.manager.name) {
      fields['Manager'] = props.item.manager.name;
    } else {
      fields['Manager'] = 'N/A'; // Or leave undefined, depending on desired display
    }

    return fields;
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

const deactivateUser = async () => {
  try {

    console.log('Deactivating user:', props.item.id)
    await deactiveUser(props.item.id)
    // console.log(`User ${props.item.id} deactivated successfully.`)
    emit('refreshRequest')
  } catch (err) {
    console.error('Error deactivating user:', err)
  }
}
const activateUser = async () => {
  try {

    console.log('Activating user:', props.item.id)
    await activateAPI(props.item.id)
    // console.log(`User ${props.item.id} deactivated successfully.`)
    emit('refreshRequest')
  } catch (err) {
    console.error('Error activating user:', err)
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