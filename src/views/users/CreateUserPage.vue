<template>
  <div class="page-wrapper">
    <DynamicForm
      title="新增使用者"
      :schema="userSchemaWithDynamicOptions"
      :submitHandler="handleCreateUser"
      submitButtonText="創建使用者"
      purpose="create"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DynamicForm from '@/components/form/DynamicForm.vue';
import { userFormSchema } from '@/schemas/userFormSchema';
import type { FormOption, FormSchema } from '@/types/form';
import { fetchDepartments } from '@/modules/departments/department-api';
import { createUser} from '@/modules/users/api/user-api'; 
import { fetchRoles } from '@/modules/users/api/role-api'; 
const departments = ref<FormOption[]>([]);
const roles = ref<FormOption[]>([]);
const isLoadingOptions = ref(true); 


onMounted(async () => {
  try {
    
    const [deptRes, roleRes] = await Promise.all([
      fetchDepartments(),
      fetchRoles()
    ])

    departments.value = deptRes.data.map((d: any) => ({ value: d.id, label: d.name }));
    roles.value = roleRes.data.map((r: any) => ({ value: r.id, label: r.name }));

} catch (error) {
    console.error('加載部門或角色數據失敗:', error);
    // 在實際應用中，你可能需要顯示一個友好的錯誤消息給用戶
  } finally {
    isLoadingOptions.value = false;
  }
});

// 計算屬性：動態注入部門和角色選項到 userFormSchema
const userSchemaWithDynamicOptions = computed<FormSchema>(() => {
  if (isLoadingOptions.value) {
    // 在選項加載完成之前，返回基本 Schema 或禁用相關欄位
    return userFormSchema.map(field => {
      if (field.name === 'departmentId' || field.name === 'roleId') {
        return { ...field, placeholder: '載入中...' }; // 顯示載入狀態
      }
      return field;
    });
  }

  return userFormSchema.map(field => {
    if (field.name === 'departmentId') {
      return { ...field, options: [{ value: '', label: '請選擇部門' }, ...departments.value] };
    }
    if (field.name === 'roleId') {
      return { ...field, options: [{ value: '', label: '請選擇角色' }, ...roles.value] };
    }
    return field;
  });
});

// 處理創建使用者表單提交的函數
const handleCreateUser = async (formData: Record<string, any>) => {
  console.log('嘗試創建使用者，提交數據:', formData);
  try {
    // 這裡進行任何前端的預處理，例如：移除 confirmPassword
    const { confirmPassword, ...dataToSend } = formData;
    const response = await createUser(dataToSend);
    console.log('使用者創建成功:', response);
    // 在實際應用中，你可能會導航到使用者列表頁面或顯示成功訊息
    return response; // 將響應傳回給 DynamicForm 以顯示成功消息
  } catch (error: any) {
    console.error('API 錯誤：創建使用者失敗:', error);
    // 重新拋出錯誤，讓 DynamicForm 捕獲並顯示錯誤訊息
    throw new Error(error.message || '創建使用者失敗，請稍後再試。');
  }
};
</script>

<style scoped>
.page-wrapper {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}
</style>