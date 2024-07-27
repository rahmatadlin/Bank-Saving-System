import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-56 bg-blue-600 flex flex-col h-screen">
      <div className="p-4 flex-shrink-0">
        <Link to="/" className="text-white text-4xl font-bold">
          Bank Saving System
        </Link>
      </div>
      <nav className="flex-1 mt-10">
        <ul>
          <li className="mb-2">
            <Link
              to="/customers"
              className="text-white hover:text-blue-200 block p-4"
            >
              Customers
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/accounts"
              className="text-white hover:text-blue-200 block p-4"
            >
              Accounts
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/deposito-types"
              className="text-white hover:text-blue-200 block p-4"
            >
              Deposito Types
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
