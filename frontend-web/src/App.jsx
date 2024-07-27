// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetail";
import Accounts from "./pages/Accounts";
import DepositoTypes from "./pages/DepositoTypes";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/deposito-types" element={<DepositoTypes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
