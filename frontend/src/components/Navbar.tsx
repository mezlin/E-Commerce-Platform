import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
          E-Commerce
        </Typography>
        <Button color="inherit" component={RouterLink} to="/products">
          Products
        </Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={RouterLink} to="/orders">
              Orders
            </Button>
            <Button color="inherit" component={RouterLink} to="/profile">
              Profile
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
        <IconButton color="inherit" component={RouterLink} to="/cart">
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;