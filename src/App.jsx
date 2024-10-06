import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/Place Order/PlaceOrder';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Footer from './components/Footer/Footer';
import About from './pages/About/About';
import Menu from './pages/Menu/Menu';
import Allfood from './components/Allfood/Allfood';
import Payment from './components/Payment/Payment';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';
import UserProfile from './pages/userprofile/userprofile';

import Addfood from './pages/Addfood/Addfood';



const App = () => {
  const [showLogin, setShowLogin] = useState(false); // State to control login popup visibility
  const [token, setToken] = useState(localStorage.getItem("token") || "");  // Initialize token with localStorage
  const [role, setRole] = useState("");  // State to store user role (admin/user)
  const [cart, setCart] = useState([]);  // State to manage cart items
  console.log("checking role in app.js", role)
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      // Fetch the user's role from the backend
      fetch('https://cucumber-backend-main.onrender.com/checkRole/checkRole', { 
        method: "GET",
        headers: {
          'Authorization': token, // Include token in the request header
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setRole(data.role); // Set role based on the response
          localStorage.setItem("role", data.role);
        } else {
          console.error("Failed to fetch role:", data.message);
        }
      })
      .catch(err => console.error("Error fetching role:", err));
    }
  }, [token]); // Depend on token so it refetches role when the token changes
   
  return (
    <>
    <Toaster /> {/* Add the Toaster component here */}
      {/* Show the LoginPopup if the login state is true */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setToken={setToken} role={role} />} {/* Pass setToken */}

      <div className='headpart'>
        {/* Pass down login, token, and cart-related props to Navbar */}
        <Navbar 
          setShowLogin={setShowLogin} 
          token={token}  // Pass token to Navbar
          setToken={setToken} 
          cart={cart} 
          setCart={setCart} 
          role={role}
        />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/all-food' element={<Allfood cart={cart} setCart={setCart} />} />
          <Route path='/cart' element={<Cart cart={cart} setCart={setCart} />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/menu' element={<Header />} />
         
          <Route path='/userprofile' element={<UserProfile role={role} />} />
      
          <Route path='/addfoodpage' element={<Addfood />} />
          {/* Only show the dashboard if the user has an admin role */}
          {role === "admin" && (
            <Route path='/dashboard' element={<Dashboard />} />
          )}
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;