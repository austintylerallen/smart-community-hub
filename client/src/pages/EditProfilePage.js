import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:4001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setEmail(response.data.email);
        setName(response.data.name);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:4001/api/auth/me', { email, name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle successful update
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      alert('Profile update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Profile
      </Typography>
      <form onSubmit={handleUpdate}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Profile
        </Button>
      </form>
    </Container>
  );
};

export default EditProfilePage;
