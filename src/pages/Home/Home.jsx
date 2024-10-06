import React, { useEffect, useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreRestaurent from '../../components/ExploreRestaurent/ExploreRestaurent';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetching restaurant data from API
  useEffect(() => {
    fetch('https://entri-final-project-cucumber-backend.onrender.com/restaurents')
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  const handleRestaurantClick = (name, category) => {
    // Passing both restaurant name and category
    navigate('/all-food', { state: { restaurantName: name, restaurantCategory: category } });
  };

  return (
    <div>
      <Header />
      <ExploreRestaurent />
      <div className='restaurant-list'>
        {restaurants.map(restaurant => (
          <article
            key={restaurant._id}
            className='restaurant'
            onClick={() => handleRestaurantClick(restaurant.name, restaurant.category)} // Add onClick handler with both name and category
          >
            <img src={restaurant.image} alt={restaurant.name} className='restaurant-image' />
            <div className='restaurant-details'>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <p><strong>Place:</strong> {restaurant.place}</p>
              <p><strong>Category:</strong> {restaurant.category}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Home;
