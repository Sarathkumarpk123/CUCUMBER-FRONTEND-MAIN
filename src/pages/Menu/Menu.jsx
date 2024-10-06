import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu = () => {
  const [foods, setFoods] = useState([]);

  // Fetching food data from API
  useEffect(() => {
    fetch('https://entri-final-project-cucumber-backend.onrender.com/foods')
      .then(response => response.json())
      .then(data => setFoods(data))
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  return (
    <div>
      <h1>Explore Our Top Menus</h1>
      <div className='food-list'>
        {foods.map(food => (
          <article key={food._id} className='topfoods'> {/* Changed id to _id */}
            <img src={food.image} alt={food.name} className='food-image' />
            <div className='food-details'>
              <h2>{food.name}</h2>
              <p>{food.description}</p>
              <p><strong>Price:</strong>{food.price}</p>
              <p><strong>Category:</strong> {food.category}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Menu;
