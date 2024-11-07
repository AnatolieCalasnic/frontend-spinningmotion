import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Product from './pages/Product';
import Basket from './pages/Basket';
import SingleProduct from './pages/SingleProduct';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/genre/:genre" element={<Product />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/basket" element={<Basket />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;