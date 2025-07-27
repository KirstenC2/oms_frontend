<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">Create Quotation</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <label>
          Reference Code:
          <input v-model="form.referenceCode" type="text" required />
        </label>

        <label>
          Client ID:
          <input v-model="form.clientId" type="text" required />
        </label>

        <label>
          Project ID:
          <input v-model="form.projectId" type="text" required />
        </label>

        <label>
          Version:
          <input v-model.number="form.version" type="number" required min="1" />
        </label>

        <label>
          Valid Until:
          <input v-model="form.validUntil" type="date" />
        </label>

        <label>
          Notes:
          <input v-model="form.notes" type="text" />
        </label>

        <label>
          Confirmed:
          <input v-model="form.confirmed" type="checkbox" />
        </label>
      </div>

      <div>
        <h3 class="text-lg font-semibold mt-6 mb-2">Items</h3>
        <div
          v-for="(item, index) in form.items"
          :key="index"
          class="border p-3 rounded space-y-2 mb-3"
        >
          <label>
            Name:
            <input v-model="item.name" type="text" required />
          </label>
          <label>
            Description:
            <input v-model="item.description" type="text" />
          </label>
          <label>
            Quantity:
            <input v-model.number="item.quantity" type="number" min="1" required />
          </label>
          <label>
            Unit Price:
            <input v-model.number="item.unitPrice" type="number" step="0.01" required />
          </label>
          <label>
            Discount:
            <input v-model.number="item.discount" type="number" step="0.01" />
          </label>
          <label>
            Total:
            <input v-model.number="item.total" type="number" step="0.01" required />
          </label>

          <button type="button" @click="removeItem(index)" class="text-red-600">
            Remove Item
          </button>
        </div>

        <button type="button" @click="addItem" class="bg-blue-500 text-white px-2 py-1 rounded">
          Add Item
        </button>
      </div>

      <div>
        <label>
          Total Amount:
          <input v-model.number="form.totalAmount" type="number" step="0.01" required />
        </label>
      </div>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">
        Submit Quotation
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import axios from 'axios';

interface QuotationItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

interface QuotationForm {
  referenceCode: string;
  clientId: string;
  projectId: string;
  version: number;
  validUntil?: string;
  notes?: string;
  confirmed?: boolean;
  totalAmount: number;
  items: QuotationItem[];
}

const form = reactive<QuotationForm>({
  referenceCode: '',
  clientId: '',
  projectId: '',
  version: 1,
  validUntil: '',
  notes: '',
  confirmed: false,
  totalAmount: 0,
  items: [],
});

function addItem() {
  form.items.push({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    total: 0,
  });
}

function removeItem(index: number) {
  form.items.splice(index, 1);
}

async function handleSubmit() {
  try {
    const response = await axios.post('http://localhost:5001/client-quotations', form);
    alert('Quotation created successfully!');
    console.log('Success:', response.data);
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to create quotation.');
  }
}
</script>

<style scoped>
input[type='text'],
input[type='number'],
input[type='date'] {
  width: 100%;
  padding: 6px;
  margin-top: 2px;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
label {
  display: flex;
  flex-direction: column;
}
</style>
