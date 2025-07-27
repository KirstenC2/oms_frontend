<script setup lang="ts">
import { ref, onMounted } from 'vue';
import  '@/assets/table.css';
// Import child components
import SubNavBar from '@/components/subcomponent/SubNavBar.vue';
import { fetchAllQuotations } from '../api/quotation-api';
import CardContent from '@/components/CardContent.vue';
import type { ClientQuotation } from '../types/quotation-type';
import CreateQuotationPage from './CreateQuotationPage.vue';
// --- Reactive State ---
const loading = ref(true);
const error = ref<string | null>(null);
const view = ref('list');
const quotationList = ref<ClientQuotation[]>([]);
// Type the projectList explicitly
const quotationTabs = ref([
    { label: 'Clients Quotations', value: 'list', view: 'list' },
      { label: 'Create New Quotation', value: 'create', view: 'create' },

]);
// --- Component Methods ---

const setView = (v: string) => {
    view.value = v;
};


const showDetails = ref(false);
const selectedQuotation = ref<any>(null);

function openDetails(quotation: any) {
    selectedQuotation.value = quotation;
    showDetails.value = true;
}

function closeDetails() {
    showDetails.value = false;
    selectedQuotation.value = null;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
}

const loadQuotations = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await fetchAllQuotations();
        console.log('Quotations response:', response);
        quotationList.value = response as ClientQuotation[]; // Cast for type safety
        console.log('Fetched quotations:', quotationList.value); // ✅ Add this
        if (!quotationList.value || quotationList.value.length === 0) {
            error.value = 'No quotations found.';
        }
        loading.value = false;
    } catch (err) {
        console.error('Failed to load quotations:', err);
        error.value = 'Failed to load quotations. Please try again.';
    } finally {
        loading.value = false;
    }
};



// --- Lifecycle Hook ---
onMounted(() => {
    loadQuotations();
    console.log('Quotations loaded:', quotationList.value);
});
</script>

<template>
    <main>
        <SubNavBar :tabs="quotationTabs" :view="view" @change="setView" />

        <h2>Client Quotations</h2>

        <div v-if="view === 'list'">
            <div v-if="loading">Loading ...</div>
            <div v-else-if="error" style="color:red;">{{ error }}</div>
            <div v-else class="user-container">
                <div v-if="quotationList.length === 0">No quotations found.</div>
                <div v-else>
                    <table class="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="border border-gray-300 px-4 py-2">Reference Code</th>
                                <th class="border border-gray-300 px-4 py-2">Status</th>
                                <th class="border border-gray-300 px-4 py-2">Valid Until</th>
                                <th class="border border-gray-300 px-4 py-2">Total Amount</th>
                                <th class="border border-gray-300 px-4 py-2">Confirmed</th>
                                <th class="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="quotation in quotationList" :key="quotation.id" class="hover:bg-gray-100">
                                <td class="border border-gray-300 px-4 py-2">{{ quotation.referenceCode }}</td>
                                <td class="border border-gray-300 px-4 py-2">{{ quotation.status }}</td>
                                <td class="border border-gray-300 px-4 py-2">{{ formatDate(quotation.validUntil) }}</td>
                                <td class="border border-gray-300 px-4 py-2">${{ quotation.totalAmount.toFixed(2) }}
                                </td>
                                <td class="border border-gray-300 px-4 py-2">{{ quotation.confirmed ? 'Yes' : 'No' }}
                                </td>
                                <td class="border border-gray-300 px-4 py-2">
                                    <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        @click="openDetails(quotation)">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Details modal -->
                    <div v-if="showDetails"
                        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div class="bg-white rounded p-6 max-w-lg w-full relative shadow-lg">
                            <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                @click="closeDetails">
                                ✖
                            </button>

                            <h2 class="text-2xl font-bold mb-4">{{ selectedQuotation.referenceCode }}</h2>
                            <p><strong>Status:</strong> {{ selectedQuotation.status }}</p>
                            <p><strong>Version:</strong> {{ selectedQuotation.version }}</p>
                            <p><strong>Valid Until:</strong> {{ formatDate(selectedQuotation.validUntil) }}</p>
                            <p><strong>Total Amount:</strong> ${{ selectedQuotation.totalAmount.toFixed(2) }}</p>
                            <p v-if="selectedQuotation.notes"><strong>Notes:</strong> {{ selectedQuotation.notes }}</p>
                            <p><strong>Confirmed:</strong> {{ selectedQuotation.confirmed ? '✅ Yes' : '❌ No' }}</p>

                            <h3 class="mt-4 font-semibold">Items</h3>
                            <ul>
                                <li v-for="item in selectedQuotation.items" :key="item.id"
                                    class="border p-2 rounded mb-2">
                                    <p><strong>{{ item.name }}</strong> (x{{ item.quantity }})</p>
                                    <p>Description: {{ item.description || 'No description' }}</p>
                                    <p>Unit Price: ${{ item.unitPrice.toFixed(2) }}</p>
                                    <p>Discount: ${{ item.discount.toFixed(2) }}</p>
                                    <p>Total: ${{ item.total.toFixed(2) }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-else-if="view === 'create'">
            <CreateQuotationPage @quotationCreated="loadQuotations" />
        </div>

    </main>
</template>

<style scoped>
.user-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* horizontal scroll if table too wide */
}

/* Table styles */
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

/* Button */
button {
  background-color: #1d4ed8;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}

/* Modal overlay */
.fixed.inset-0 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Modal box */
.bg-white {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
}

/* Close button */
button.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: #666;
  font-size: 22px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s ease;
}

button.close-btn:hover {
  color: #222;
}

/* Item list inside modal */
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 12px;
}

ul li {
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: #fafafa;
}

ul li p {
  margin: 4px 0;
  font-size: 14px;
}
.details-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

</style>