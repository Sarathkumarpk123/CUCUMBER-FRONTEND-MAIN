import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Allfood.css';
import { CartContext } from '../CartContext';
import { toast } from 'react-hot-toast';

export const Allfood = () => {
  const { cart, setCart } = useContext(CartContext); 
  const [vegFood, setVegFood] = useState([]);
  const [nonVegFood, setNonVegFood] = useState([]);
  const location = useLocation();
  const { restaurantName, restaurantCategory } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const url = restaurantCategory === "veg"
      ? 'https://entri-final-project-cucumber-backend.onrender.com/foods?vegOnly=true'
      : 'https://entri-final-project-cucumber-backend.onrender.com/foods?vegOnly=false';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        restaurantCategory === "veg" ? setVegFood(data) : setNonVegFood(data);
      })
      .catch(error => console.error('Error fetching food:', error));
  }, [restaurantCategory]);

  const handleAddToCart = async (foodItem) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    const username = localStorage.getItem('name'); // Assuming username is stored in localStorage after login
    console.log("username from cart" , username)
    if (!token) {
      toast.error('Please login to add items to the cart.');
      navigate('/login'); // Redirect to login if no token
      return;
    }
  
    const existingItem = cart.find(item => item._id === foodItem._id);
    console.log("fooditem", foodItem)
  
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === foodItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...foodItem, quantity: 1 }];
    }
  
    setCart(updatedCart);
    toast.success(`${foodItem.name} has been added to your cart!`);
  
    // Prepare the payload for API
    const cartItem = {
      foodId: foodItem._id,
      name: foodItem.name,
      price: foodItem.price,
      quantity: existingItem ? existingItem.quantity + 1 : 1,
      image: foodItem.image,
      username: username, // Add the username to the cart item
    };
  
    // Send the cart item to the API
    try {
      const response = await fetch('https://backend-cucumber-final.onrender.com/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token in the request
        },
        body: JSON.stringify(cartItem),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Item successfully added to cart in MongoDB:', result);
      } else {
        console.error('Failed to add item to cart in MongoDB:', response.statusText);
        toast.error('Failed to add item to the cart in the database.');
      }
    } catch (error) {
      console.error('Error adding item to cart in MongoDB:', error);
      toast.error('An error occurred while adding item to the cart in the database.');
    }
  };
  

  const foodItems = restaurantCategory === "veg" ? vegFood : nonVegFood;

  return (
    <div>
      <h1>{restaurantCategory === "veg" ? "Veg Food" : "Non-Veg Food"}</h1>
      {restaurantName ? (
        <h2>Restaurant: {restaurantName}</h2>
      ) : (
        <p>No restaurant selected</p>
      )}

      <div className="food-list">
        {foodItems.length > 0 ? (
          foodItems.map((food) => (
            <div key={food._id} className="food-item">
              <img src={food.image} alt={food.name} className="food-image" />
              <div className="food-details">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p><strong>Price:</strong> ₹{food.price}</p>
                <button onClick={() => handleAddToCart(food)}>Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading food items...</p>
        )}
      </div>
    </div>
  );
};

export default Allfood;
