import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Bank Saving System</Link>
        <div className="space-x-4">
          <Link to="/customers" className="text-white hover:text-blue-200">Customers</Link>
          <Link to="/accounts" className="text-white hover:text-blue-200">Accounts</Link>
          <Link to="/deposito-types" className="text-white hover:text-blue-200">Deposito Types</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;