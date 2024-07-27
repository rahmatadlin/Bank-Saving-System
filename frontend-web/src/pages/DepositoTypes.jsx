import React, { useState, useEffect } from 'react';
import {
  fetchDepositoTypes,
  addDepositoType,
  editDepositoType,
  deleteDepositoType
} from '../services/api'; // Adjust the path as necessary

const DepositoTypes = () => {
  const [depositoTypes, setDepositoTypes] = useState([]);
  const [newDepositoType, setNewDepositoType] = useState({ name: '', yearlyReturn: 0 });
  const [editingDepositoType, setEditingDepositoType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDepositoTypes = async () => {
      try {
        const data = await fetchDepositoTypes();
        setDepositoTypes(data);
      } catch (error) {
        console.error('Error fetching deposito types:', error);
      }
    };

    loadDepositoTypes();
  }, []);

  const handleInputChange = (e) => {
    setNewDepositoType({ ...newDepositoType, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingDepositoType({ ...editingDepositoType, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepositoType) {
        const { _id, ...updateData } = editingDepositoType;
        await editDepositoType(_id, updateData);
        setEditingDepositoType(null);
      } else {
        await addDepositoType(newDepositoType);
        setNewDepositoType({ name: '', yearlyReturn: 0 });
      }
      const data = await fetchDepositoTypes();
      setDepositoTypes(data);
    } catch (error) {
      console.error('Error saving deposito type:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (type) => {
    setEditingDepositoType(type);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepositoType(id);
      const data = await fetchDepositoTypes();
      setDepositoTypes(data);
    } catch (error) {
      console.error('Error deleting deposito type:', error.response ? error.response.data : error.message);
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
          value={editingDepositoType ? editingDepositoType.name : newDepositoType.name}
          onChange={editingDepositoType ? handleEditChange : handleInputChange}
          placeholder="Deposito Type Name"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="yearlyReturn"
          value={editingDepositoType ? editingDepositoType.yearlyReturn : newDepositoType.yearlyReturn}
          onChange={editingDepositoType ? handleEditChange : handleInputChange}
          placeholder="Yearly Return (%)"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingDepositoType ? 'Update Deposito Type' : 'Add Deposito Type'}
        </button>
        {editingDepositoType && (
          <button
            type="button"
            onClick={() => setEditingDepositoType(null)}
            className="bg-gray-500 text-white p-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
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
          <div key={type._id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <h3 className="text-lg font-bold text-center mb-2">{type.name}</h3>
            <p className="text-gray-700 text-center mb-4">Yearly Return: {type.yearlyReturn}%</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(type)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(type._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositoTypes;
