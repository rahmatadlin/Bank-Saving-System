// src/pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchCustomers, addCustomer, deleteCustomer, editCustomer } from '../services/api'; // Adjust path if needed

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch customers',
        text: error.message,
      });
    }
  };

  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addCustomer(newCustomer);
      setNewCustomer({ name: '' });
      fetchCustomersData();
      Swal.fire({
        icon: 'success',
        title: 'Customer Added',
        text: 'Customer has been added successfully!',
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      fetchCustomersData();
      Swal.fire({
        icon: 'success',
        title: 'Customer Deleted',
        text: 'Customer has been deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete customer',
      });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await editCustomer(editingCustomer._id, editingCustomer.name);
      fetchCustomersData();
      handleModalClose();
      Swal.fire({
        icon: 'success',
        title: 'Customer Updated',
        text: 'Customer has been updated successfully!',
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An unexpected error occurred',
      });
    }
  };

  // Get current customers for pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(customers.length / customersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-4xl font-bold mb-4 text-center">Customers</h2>
      <div className="mb-4 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Customer Name"
              className="border p-2 w-auto"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-1.5 rounded w-full h-full"
            >
              Add
            </button>
          </form>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Customers"
            className="border p-2 w-full max-w-md"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 border-b border-gray-200">Name</th>
              <th className="py-2 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer._id} className="text-center border-t border-gray-200">
                <td className="py-2 border-r border-gray-200">{customer.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => navigate(`/customers/${customer._id}`)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'text-blue-500' : ''}`}>
                <button onClick={() => paginate(number)} className="px-4 py-2 border rounded">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Edit Customer</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="name"
                value={editingCustomer?.name || ''}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                className="border p-2 mb-4 w-full"
                placeholder="Customer Name"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
