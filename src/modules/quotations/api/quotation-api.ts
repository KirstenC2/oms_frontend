import axios from 'axios';

export const fetchAllQuotations = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5001/client-quotations');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
}

// export const createQuotation = async (quotationData) => {
//   try {
//     const response = await axios.post('http://127.0.0.1:5001/client-quotations', quotationData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating quotation:', error);
//     throw error;
//   }
// }