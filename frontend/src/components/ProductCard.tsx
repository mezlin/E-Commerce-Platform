import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Link as RouterLink } from 'react-router-dom';
import { deleteProduct } from '../services/productService';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, image }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: id,
      name,
      price,
      quantity: 1,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        window.location.reload(); // Refresh the page to show updated list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={image ? `http://localhost:4001${image}` : 'https://via.placeholder.com/200'}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button size="small" component={RouterLink} to={`/products/${id}`}>
          View
        </Button>
        <Button size="small" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;