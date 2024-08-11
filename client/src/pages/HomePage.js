import React from 'react';
import { Container, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Smart Community Hub
      </Typography>
      <Typography variant="body1">
        This is the home page. Use the navigation bar to explore the site.
      </Typography>
    </Container>
  );
};

export default HomePage;
