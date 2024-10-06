import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext'; // Import CartContext

const stripePromise = loadStripe('pk_test_51Q3g8U2Nr7HCljhocJrdNFFePBiFouinrU2uBJqfuTliEPUvQjzJurhtYApftQpORaG8WYn4yTDJPWbeCdwmCg8p00fl1z4XMb');
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const { setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    setLoading(true); // Set loading to true when starting payment

    try {
      const response = await fetch('https://backend-cucumber-final.onrender.com/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 5000, // Amount in cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setIsSuccess(true);
        setCart([]);
      }
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
    } finally {
      setLoading(false); // Set loading to false after payment processing
    }
  };

  return (
    <div className='payment-container'>
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Mobile Number'
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
        <button type='submit' disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>
      {isSuccess && (
        <div className='popup'>
          <div className='popup-content'>
            <button onClick={() => navigate('/')}>X</button>
            <h3>Payment Successful!</h3>
            <p>Food is on the way.</p>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
