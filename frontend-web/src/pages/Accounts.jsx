import React, { useState, useEffect } from "react";
import { fetchAccounts, fetchCustomers, fetchDepositoTypes, handleDeposit, handleWithdraw } from '../services/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDate, setTransactionDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsData = await fetchAccounts();
        setAccounts(accountsData);

        const customersData = await fetchCustomers();
        setCustomers(customersData);

        const depositoTypesData = await fetchDepositoTypes();
        setDepositoTypes(depositoTypesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDepositClick = async (accountId) => {
    try {
      await handleDeposit(accountId, transactionAmount, transactionDate);
      const accountsData = await fetchAccounts();
      setAccounts(accountsData);
      setSelectedAccount(null);
      setTransactionAmount(0);
      setTransactionDate("");
    } catch (error) {
      console.error('Error making deposit:', error);
    }
  };

  const handleWithdrawClick = async (accountId) => {
    try {
      if (!transactionDate) {
        alert("Please select a withdrawal date");
        return;
      }
      const response = await handleWithdraw(accountId, transactionAmount, transactionDate);
      const accountsData = await fetchAccounts();
      setAccounts(accountsData);
      setSelectedAccount(null);
      setTransactionAmount(0);
      setTransactionDate("");
      alert(`Withdrawal successful. Ending balance: ${formatRupiah(response.endingBalance)}`);
    } catch (error) {
      console.error('Error making withdrawal:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatRupiah = (number) => {
    return number ?
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
      : 'Rp 0.00';
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
            <p>Balance: {formatRupiah(parseFloat(account.balance))}</p>
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
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={() => handleDepositClick(account._id)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Deposit
                </button>
                <button
                  onClick={() => handleWithdrawClick(account._id)}
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
