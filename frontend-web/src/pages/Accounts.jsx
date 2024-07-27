import React, { useState, useEffect } from "react";
import axios from "axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
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

  const handleDeposit = async (accountId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/accounts/${accountId}/deposit`,
        {
          amount: parseFloat(transactionAmount),
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
      <ul>
        {accounts.map((account) => (
          <li key={account._id} className="mb-4 p-4 border rounded">
            <p className="font-bold">
              Customer:{" "}
              {customers.find((c) => c._id === account.customerId)?.name}
            </p>
            <p>Balance: {account.balance}</p>
            <p>
              Deposito Type:{" "}
              {
                depositoTypes.find((t) => t._id === account.depositoTypeId)
                  ?.name
              }
            </p>
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
