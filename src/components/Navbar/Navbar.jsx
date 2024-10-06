import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Image from '../../assets/placeholder.png';
import Logout from '../../assets/logout.png';
import Userprofileimage from '../../assets/userprofile.png';
import SamImage from '../../assets/sam.png';
import { CartContext } from '../CartContext'; // Import CartContext

const Navbar = ({ setShowLogin, token, setToken, role }) => {
  const [menubar, setMenubar] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart, setCart } = useContext(CartContext); // Access the cart and setCart from CartContext
  const navigate = useNavigate();

  useEffect(() => {
    // This effect will trigger a re-render whenever the token or role changes
  }, [token, role]);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (menu) => {
    setMenubar(menu);
    if (menu === "home") {
      navigate('/');
    } else if (menu === "menu") {
      navigate('/menu');
    } else if (menu === "about") {
      navigate('/about');
    } else if (menu === "dashboard") {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(""); // Clear the token

    // Clear the cart in the state and from localStorage
    setCart([]); 
    localStorage.removeItem('cart'); 

    navigate('/');
    window.location.reload(); // Reload the page to reset the state
  };

  const handleSignin = () => {
    setShowLogin(true);
  };

  const handleUser = () => {
    navigate("/userprofile");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='navbar'>
      <h1 style={{color:"green"}} onClick={handleLogoClick}>Cucumber</h1>
      <ul className='navbar-menu'>
        <li onClick={() => handleMenuClick("home")} className={menubar === "home" ? "active" : ""}>Home</li>
        <li onClick={() => handleMenuClick("menu")} className={menubar === "menu" ? "active" : ""}>Menu</li>
        <li onClick={() => handleMenuClick("about")} className={menubar === "about" ? "active" : ""}>About</li>
        {role === "admin" && <li onClick={() => handleMenuClick("dashboard")} className={menubar === "dashboard" ? "active" : ""}>Dashboard</li>}
      </ul>
      <div className='navbar-right'>
        <span onClick={handleCartClick} className="material-symbols-outlined">
          shopping_cart
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </span>

        {!token ? (
          <button className='navbar-button' onClick={handleSignin}>Sign in</button>
        ) : (
          <div className='navbar-profile'>
            {role === "admin" ? (
              <img className='imageprofile' src={SamImage} alt="Admin Profile" onClick={toggleDropdown} />
            ) : (
              <img className='imageprofile' src={Image} alt="User Profile" onClick={toggleDropdown} />
            )}
            {showDropdown && (
              <ul className='nav-profile-dropdown'>
                <li onClick={handleLogout}><img className='imageicon' src={Logout} alt="Logout" /></li>
                <li onClick={handleUser}><img className='imageicon' src={Userprofileimage} alt="User Profile" /></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
