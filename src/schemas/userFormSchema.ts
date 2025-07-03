
// src/schemas/userFormSchema.ts
import type { FormSchema } from '@/types/form';

export const userFormSchema: FormSchema = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: '請輸入電子郵件',
  },
  {
    name: 'name',
    label: '姓名',
    type: 'text',
    placeholder: '請輸入使用者姓名',
  },
  {
    name: 'departmentId', // 對應後端模型中的 department_id
    label: '部門',
    type: 'select',
    options: [], // 將由頁面組件動態填充
    defaultValue: '', // 允許初始為空，表示未選擇
  },
  {
    name: 'roleId', // 對應後端模型中的 role_id
    label: '角色',
    type: 'select',
    options: [], // 將由頁面組件動態填充
    defaultValue: '', // 允許初始為空，表示未選擇
  },
  // 假設創建新用戶時需要密碼，編輯時則不需要
  {
    name: 'password',
    label: '密碼',
    type: 'password',
    placeholder: '請輸入密碼',
    isVisible: (formData, purpose) => purpose === 'create', // 僅在創建時顯示
  },
  {
    name: 'confirmPassword', // 用於前端確認密碼，不會提交給後端
    label: '確認密碼',
    type: 'password',
    placeholder: '請再次輸入密碼',
    isVisible: (formData, purpose) => purpose === 'create', // 僅在創建時顯示
  },
];