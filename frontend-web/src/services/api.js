import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://bank-saving-system.vercel.app/api'
    : 'http://localhost:5000/api';

export const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/accounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const fetchDepositoTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/deposito-types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deposito types:', error);
    throw error;
  }
};

export const handleDeposit = async (accountId, amount, date) => {
  try {
    await axios.post(`${BASE_URL}/accounts/${accountId}/deposit`, {
      amount: parseFloat(amount),
      date: date,
    });
  } catch (error) {
    console.error('Error making deposit:', error);
    throw error;
  }
};

export const handleWithdraw = async (accountId, amount, date) => {
  try {
    const response = await axios.post(`${BASE_URL}/accounts/${accountId}/withdraw`, {
      amount: parseFloat(amount),
      date: date,
    });
    return response.data;
  } catch (error) {
    console.error('Error making withdrawal:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchCustomerDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
};

export const addAccount = async (customerId, depositoTypeId, balance) => {
  try {
    const payload = {
      customerId,
      depositoTypeId,
      balance: parseFloat(balance), // Ensure balance is a number
    };
    console.log('Adding account with payload:', payload);  // Debugging
    const response = await axios.post(`${BASE_URL}/accounts`, payload);
    console.log('Add account response:', response.data);  // Debugging
    return response.data;
  } catch (error) {
    console.error('Error adding account:', error.response?.data || error.message);  // Debugging
    throw error;
  }
};

export const editAccount = async (accountId, depositoTypeId, balance) => {
  try {
    const payload = {
      depositoTypeId,
      balance: parseFloat(balance),
    };
    console.log('Editing account with payload:', payload);  // Debugging
    const response = await axios.put(`${BASE_URL}/accounts/${accountId}`, payload);
    console.log('Edit account response:', response.data);  // Debugging
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error.response?.data || error.message);  // Debugging
    throw error;
  }
};

export const deleteAccount = async (accountId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/accounts/${accountId}`);
    console.log('Delete account response:', response.data);  // Debugging
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error.response?.data || error.message);  // Debugging
    throw error;
  }
};

export const addCustomer = async (customer) => {
  try {
    const response = await axios.post(`${BASE_URL}/customers`, customer);
    return response.data;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const editCustomer = async (id, name) => {
  try {
    const response = await axios.put(`${BASE_URL}/customers/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Add these functions for deposito types

export const addDepositoType = async (depositoType) => {
  try {
    const response = await axios.post(`${BASE_URL}/deposito-types`, depositoType);
    return response.data;
  } catch (error) {
    console.error('Error adding deposito type:', error);
    throw error;
  }
};

export const editDepositoType = async (id, depositoType) => {
  try {
    const response = await axios.put(`${BASE_URL}/deposito-types/${id}`, depositoType);
    return response.data;
  } catch (error) {
    console.error('Error updating deposito type:', error);
    throw error;
  }
};

export const deleteDepositoType = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deposito-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deposito type:', error);
    throw error;
  }
};
