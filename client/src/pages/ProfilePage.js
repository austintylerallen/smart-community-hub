import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Ensure this import is correct

const ProfilePage = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        This is your profile page. More features coming soon!
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/newsfeed">
        Go to Newsfeed
      </Button>
      <LogoutButton />
    </Container>
  );
};

export default ProfilePage;
