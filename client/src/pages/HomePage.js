import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to the Smart Community Hub
      </Typography>
      <Typography variant="body1">
        This is the homepage. More features coming soon!
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        Login
      </Button>
      <Button variant="contained" color="secondary" component={Link} to="/register">
        Register
      </Button>
    </div>
  );
};

export default HomePage;
