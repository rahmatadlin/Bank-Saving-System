import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Add useNavigate hook
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAccount, setNewAccount] = useState({
    depositoTypeId: "",
    balance: "",
  });
  const [editAccount, setEditAccount] = useState(null);
  const [depositoTypes, setDepositoTypes] = useState([]);

  useEffect(() => {
    fetchCustomerDetails();
    fetchDepositoTypes();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customers/${id}`
      );
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch customer details",
        text: error.message,
      });
    }
  };

  const fetchDepositoTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/deposito-types"
      );
      setDepositoTypes(response.data);
    } catch (error) {
      console.error("Error fetching deposito types:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch deposito types",
        text: error.message,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editAccount) {
      setEditAccount({ ...editAccount, [name]: value });
    } else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/accounts", {
        customerId: id,
        depositoTypeId: newAccount.depositoTypeId,
        balance: parseFloat(newAccount.balance),
      });
      Swal.fire({
        icon: "success",
        title: "Account Added",
        text: "The account has been added successfully!",
      });
      // Redirect to refresh the page
      navigate(0);
    } catch (error) {
      console.error("Error adding account:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add account",
        text: error.message,
      });
    }
  };

  const handleEditAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/accounts/${editAccount._id}`,
        {
          depositoTypeId: editAccount.depositoTypeId,
          balance: parseFloat(editAccount.balance),
        }
      );
      Swal.fire({
        icon: "success",
        title: "Account Updated",
        text: "The account has been updated successfully!",
      });
      // Redirect to refresh the page
      navigate(0);
    } catch (error) {
      console.error("Error updating account:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update account",
        text: error.message,
      });
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`http://localhost:5000/api/accounts/${accountId}`);
      Swal.fire({
        icon: "success",
        title: "Account Deleted",
        text: "The account has been deleted successfully!",
      });
      // Refresh the page after deletion
      navigate(0);
    } catch (error) {
      console.error("Error deleting account:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete account",
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
          <table className="min-w-full border-gray-200 mb-6">
            <tbody>
              <tr>
                <td className="py-2 border-b border-gray-200 font-bold">
                  Name:
                </td>
                <td className="py-2 border-b border-gray-200">
                  {customer.name}
                </td>
              </tr>
              {customer.accounts.map((account, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="py-2 border-b border-gray-200 font-bold">
                      Account {index + 1} Packet:
                    </td>
                    <td className="py-2 border-b border-gray-200">
                      {account.packet}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200">
                      Account {index + 1} Balance:
                    </td>
                    <td className="py-2 border-b border-gray-200">
                      {account.balance}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200">
                      Account {index + 1} Deposito Type:
                    </td>
                    <td className="py-2 border-b border-gray-200">
                      {account?.depositoType?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 border-b border-gray-200">
                      Account {index + 1} Yearly Return:
                    </td>
                    <td className="py-2 border-b border-gray-200">
                      {account.depositoType?.yearlyReturn}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="py-2 border-b border-gray-200">
                      <button
                        onClick={() => setEditAccount(account)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>

          </table>
          <br />

          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">
              {editAccount ? "Edit Account" : "Add New Account"}
            </h3>
            <form
              onSubmit={editAccount ? handleEditAccount : handleAddAccount}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deposito Type
                </label>
                <select
                  name="depositoTypeId"
                  value={
                    editAccount
                      ? editAccount.depositoTypeId
                      : newAccount.depositoTypeId
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Deposito Type</option>
                  {depositoTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={editAccount ? editAccount.balance : newAccount.balance}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter balance"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                {editAccount ? "Update Account" : "Add Account"}
              </button>
              {editAccount && (
                <button
                  type="button"
                  onClick={() => setEditAccount(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 ml-2"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
