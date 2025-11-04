import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">You are not logged in.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>First name:</strong> {user.firstName}</Typography>
          <Typography><strong>Last name:</strong> {user.lastName}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
