import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepositoTypes = () => {
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [newDepositoType, setNewDepositoType] = useState({ name: '', yearlyReturn: 0 });

  useEffect(() => {
    fetchDepositoTypes();
  }, []);

  const fetchDepositoTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deposito-types');
      setDepositoTypes(response.data);
    } catch (error) {
      console.error('Error fetching deposito types:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewDepositoType({ ...newDepositoType, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/deposito-types', newDepositoType);
      setNewDepositoType({ name: '', yearlyReturn: 0 });
      fetchDepositoTypes();
    } catch (error) {
      console.error('Error creating deposito type:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Deposito Types</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          value={newDepositoType.name}
          onChange={handleInputChange}
          placeholder="Deposito Type Name"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="yearlyReturn"
          value={newDepositoType.yearlyReturn}
          onChange={handleInputChange}
          placeholder="Yearly Return (%)"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Deposito Type</button>
      </form>
      <ul>
        {depositoTypes.map((type) => (
          <li key={type._id} className="mb-2">
            {type.name} - Yearly Return: {type.yearlyReturn}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepositoTypes;