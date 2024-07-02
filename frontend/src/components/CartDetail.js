import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartDetails = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await axios.get('/api/cart/');
        setCart(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, []);

  if (loading) {
    return <p>Loading cart details...</p>;
  }

  if (error) {
    return <p>Error loading cart details: {error.message}</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cart.total}</p>
    </div>
  );
};

export default CartDetails;
