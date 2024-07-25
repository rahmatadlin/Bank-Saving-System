import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepositoTypes = () => {
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [newDepositoType, setNewDepositoType] = useState({ name: '', yearlyReturn: 0 });
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const filteredDepositoTypes = depositoTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Deposito Types</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex justify-center">
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
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Deposito Types"
          className="border p-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredDepositoTypes.map((type) => (
          <div key={type._id} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-center">{type.name}</h3>
            <p className="text-gray-700 text-center">Yearly Return: {type.yearlyReturn}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositoTypes;
