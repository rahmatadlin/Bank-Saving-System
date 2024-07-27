// src/pages/CustomerDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch customer details',
        text: error.message,
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-4xl font-bold mb-4 text-center">Customer Details</h2>
      {customer && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <tbody>
              <tr>
                <td className="py-2 border-b border-gray-200 font-bold">Name:</td>
                <td className="py-2 border-b border-gray-200">{customer.name}</td>
              </tr>
              {customer.accounts.map((account, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="py-2 border-b border-gray-200 font-bold">Account {index + 1} Packet:</td>
                    <td className="py-2 border-b border-gray-200">{account.packet}</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200 font-bold">Account {index + 1} Balance:</td>
                    <td className="py-2 border-b border-gray-200">{account.balance}</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200 font-bold">Account {index + 1} Deposito Type:</td>
                    <td className="py-2 border-b border-gray-200">{account.depositoType?.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200 font-bold">Account {index + 1} Yearly Return:</td>
                    <td className="py-2 border-b border-gray-200">{account.depositoType?.yearlyReturn}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
