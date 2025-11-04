import React, { useState } from 'react';
import { Container, Typography, Paper, Box, IconButton, TextField, Button, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { createOrder } from '../services/orderService';

const CartPage: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQtyChange = (productId: string, qty: number) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  const handleCheckout = async () => {
    if (!user) {
      // In a real app you'd redirect to login
      alert('Please login to checkout');
      return;
    }

    const orderData = {
      userId: user._id,
      products: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
      shippingAddress: {
        street,
        city,
        state: stateField,
        country,
        zipCode,
      },
    };

    setError('');
    setLoading(true);
    try {
      console.log('Creating order with data:', orderData);
      await createOrder(orderData);
      dispatch(clearCart());
      setOrderPlaced(true);
      // Clear form
      setStreet('');
      setCity('');
      setStateField('');
      setCountry('');
      setZipCode('');
      alert('Order created successfully');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to create order');
    }
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Cart</Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          {items.map(item => (
            <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography>{item.name}</Typography>
                <Typography color="text.secondary">${item.price.toFixed(2)}</Typography>
              </Box>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQtyChange(item.productId, parseInt(e.target.value || '1', 10))}
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
              />
              <IconButton onClick={() => handleRemove(item.productId)} aria-label="remove">Remove</IconButton>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Shipping address</Typography>
            <TextField fullWidth label="Street" value={street} onChange={(e) => setStreet(e.target.value)} sx={{ mt: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} sx={{ flex: 1 }} />
              <TextField label="State" value={stateField} onChange={(e) => setStateField(e.target.value)} sx={{ width: 140 }} />
              <TextField label="Zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)} sx={{ width: 140 }} />
            </Box>
            <TextField fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} sx={{ mt: 1 }} />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleCheckout}>Checkout</Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CartPage;
