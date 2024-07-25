import React, { useState, useEffect } from "react";
import axios from "axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [newAccount, setNewAccount] = useState({
    packet: "",
    customer: "",
    balance: 0,
    depositoType: "",
  });

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);

  useEffect(() => {
    fetchAccounts();
    fetchCustomers();
    fetchDepositoTypes();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
    }
  };

  const handleInputChange = (e) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/accounts", newAccount);
      setNewAccount({ packet: "", customer: "", balance: 0, depositoType: "" });
      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleDeposit = async (accountId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/accounts/${accountId}/deposit`,
        {
          amount: parseFloat(transactionAmount),
          depositDate: new Date().toISOString(),
        }
      );
      fetchAccounts();
      setSelectedAccount(null);
      setTransactionAmount(0);
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const handleWithdraw = async (accountId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/accounts/${accountId}/withdraw`,
        {
          amount: parseFloat(transactionAmount),
          withdrawalDate: new Date().toISOString(),
        }
      );
      fetchAccounts();
      setSelectedAccount(null);
      setTransactionAmount(0);
    } catch (error) {
      console.error("Error making withdrawal:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Accounts</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="packet"
          value={newAccount?.packet}
          onChange={handleInputChange}
          placeholder="Packet"
          className="border p-2 mr-2"
        />
        <select
          name="customer"
          value={newAccount?.customer}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="balance"
          value={newAccount?.balance}
          onChange={handleInputChange}
          placeholder="Balance"
          className="border p-2 mr-2"
        />
        <select
          name="depositoType"
          value={newAccount?.depositoType}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        >
          <option value="">Select Deposito Type</option>
          {depositoTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Account
        </button>
      </form>
      <ul>
        {accounts.map((account) => (
          <li key={account._id} className="mb-4 p-4 border rounded">
            <p>Packet: {account?.packet}</p>
            <p>Customer: {account?.customer?.name}</p>
            <p>Balance: {account?.balance}</p>
            <p>Deposito Type: {account?.depositoType?.name}</p>
            <button
              onClick={() => setSelectedAccount(account._id)}
              className="bg-green-500 text-white p-2 rounded mt-2"
            >
              Make Transaction
            </button>
            {selectedAccount === account._id && (
              <div className="mt-2">
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Amount"
                  className="border p-2 mr-2"
                />
                <button
                  onClick={() => handleDeposit(account._id)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Deposit
                </button>
                <button
                  onClick={() => handleWithdraw(account._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Withdraw
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;
