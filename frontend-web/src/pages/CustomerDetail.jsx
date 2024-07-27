import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  fetchCustomerDetails, 
  fetchDepositoTypes, 
  addAccount, 
  editAccount, 
  deleteAccount 
} from "../services/api";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAccount, setNewAccount] = useState({
    depositoTypeId: "",
    balance: "",
  });
  const [editAccountData, setEditAccountData] = useState(null);
  const [depositoTypes, setDepositoTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerData = await fetchCustomerDetails(id);
        setCustomer(customerData);
        const depositoTypesData = await fetchDepositoTypes();
        setDepositoTypes(depositoTypesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch data",
          text: error.message,
        });
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editAccountData) {
      setEditAccountData({ ...editAccountData, [name]: value });
    } else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await addAccount(id, newAccount.depositoTypeId, newAccount.balance);
      Swal.fire({
        icon: "success",
        title: "Account Added",
        text: "The account has been added successfully!",
      });
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
      await editAccount(editAccountData._id, editAccountData.depositoTypeId, editAccountData.balance);
      Swal.fire({
        icon: "success",
        title: "Account Updated",
        text: "The account has been updated successfully!",
      });
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
      await deleteAccount(accountId);
      Swal.fire({
        icon: "success",
        title: "Account Deleted",
        text: "The account has been deleted successfully!",
      });
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

  const formatRupiah = (number) => {
    return number ? 
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number) 
      : 'Rp 0.00';
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
                      {formatRupiah(account.balance)}
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
                      {(account.depositoType?.yearlyReturn)}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="py-2 border-b border-gray-200">
                      <button
                        onClick={() => setEditAccountData(account)}
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
              {editAccountData ? "Edit Account" : "Add New Account"}
            </h3>
            <form
              onSubmit={editAccountData ? handleEditAccount : handleAddAccount}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deposito Type
                </label>
                <select
                  name="depositoTypeId"
                  value={
                    editAccountData
                      ? editAccountData.depositoTypeId
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
                  value={editAccountData ? editAccountData.balance : newAccount.balance}
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
                {editAccountData ? "Update Account" : "Add Account"}
              </button>
              {editAccountData && (
                <button
                  type="button"
                  onClick={() => setEditAccountData(null)}
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
