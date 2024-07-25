import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-600 h-screen">
      <div className="p-4">
        <Link to="/" className="text-white text-xl font-bold">Bank Saving System</Link>
      </div>
      <nav className="mt-10">
        <ul>
          <li className="mb-2">
            <Link to="/customers" className="text-white hover:text-blue-200 block p-4">Customers</Link>
          </li>
          <li className="mb-2">
            <Link to="/accounts" className="text-white hover:text-blue-200 block p-4">Accounts</Link>
          </li>
          <li className="mb-2">
            <Link to="/deposito-types" className="text-white hover:text-blue-200 block p-4">Deposito Types</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
