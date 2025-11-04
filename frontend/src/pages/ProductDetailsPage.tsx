import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, TextField, CardMedia } from '@mui/material';
import { getProductById } from '../services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    void fetch();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: qty }));
    alert('Added to cart');
  };

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <CardMedia
              component="img"
              height={400}
              image={product.image ? `http://localhost:4001${product.image}` : 'https://via.placeholder.com/400'}
              alt={product.name}
              sx={{ width: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">{product.name}</Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${product.price.toFixed(2)}</Typography>
            <Typography sx={{ mt: 2 }}>{product.description}</Typography>
            <Typography sx={{ mt: 2 }}>Available: {product.quantity}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
              <TextField type="number" label="Qty" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))} sx={{ width: 100 }} />
              <Button variant="contained" color="primary" onClick={handleAdd}>Add to cart</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductDetailsPage;
