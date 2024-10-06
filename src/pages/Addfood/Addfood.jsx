import React, { useState } from 'react';
import './Addfood.css';
import { toast } from 'react-hot-toast'; // Import toast

export const Addfood = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isVeg: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVegChange = (e) => {
    setFormData({
      ...formData,
      isVeg: e.target.value === 'true'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://cucumber-backend-main.onrender.com/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newFood = await response.json();
        console.log('Food added successfully:', newFood);
        toast.success('Food added successfully!'); // Replace alert with toast
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          category: '',
          isVeg: true,
        });
      } else {
        toast.error('Error adding food'); // Replace alert with error toast
        console.error('Error adding food');
      }
    } catch (error) {
      toast.error('Error: Something went wrong'); // Error toast
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-food-container">
      <h2>Add New Food</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Food Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Is Vegetarian?</label>
          <div>
            <label>
              <input
                type="radio"
                name="isVeg"
                value="true"
                checked={formData.isVeg === true}
                onChange={handleVegChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="isVeg"
                value="false"
                checked={formData.isVeg === false}
                onChange={handleVegChange}
              />
              No
            </label>
          </div>
        </div>

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default Addfood;
