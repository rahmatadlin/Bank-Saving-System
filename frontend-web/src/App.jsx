import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Accounts from './pages/Accounts';
import DepositoTypes from './pages/DepositoTypes';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/deposito-types" element={<DepositoTypes />} />
      </Routes>
    </div>
  );
}

export default App;