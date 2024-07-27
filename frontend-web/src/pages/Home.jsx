import React, { useState, useEffect } from 'react';

const Home = () => {
  const [customers, setCustomers] = useState(0);
  const [accounts, setAccounts] = useState(0);
  const [depositoTypes, setDepositoTypes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch('http://localhost:5000/api/customers');
        const customersData = await customersResponse.json();
        setCustomers(customersData.length);

        const accountsResponse = await fetch('http://localhost:5000/api/accounts');
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData.length);

        const depositoTypesResponse = await fetch('http://localhost:5000/api/deposito-types');
        const depositoTypesData = await depositoTypesResponse.json();
        setDepositoTypes(depositoTypesData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Bank Saving System</h1>
      <p className="text-lg mb-8">Manage your customers, accounts, and deposito types with ease.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
          <p className="text-2xl">{customers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Accounts</h2>
          <p className="text-2xl">{accounts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Deposito Types</h2>
          <p className="text-2xl">{depositoTypes}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
