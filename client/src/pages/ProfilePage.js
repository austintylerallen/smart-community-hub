import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:4001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setName(response.data.name || '');
        setLocation(response.data.location || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('http://localhost:4001/api/auth/me', 
        { email: user.email, name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Profile
      </Typography>
      <TextField
        label="Email"
        value={user.email || ''}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleUpdate} variant="contained" color="primary" fullWidth>
        Update Profile
      </Button>
    </Container>
  );
};

export default ProfilePage;
