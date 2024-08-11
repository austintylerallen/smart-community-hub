import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Avatar, Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post('http://localhost:4001/api/auth/refresh-token', { token });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  };

  const fetchUserData = async () => {
    let token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4001/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setName(response.data.name || '');
      setLocation(response.data.location || '');
      setBio(response.data.bio || '');
      setProfilePicture(response.data.profilePicture || '');
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.get('http://localhost:4001/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setName(response.data.name || '');
          setLocation(response.data.location || '');
          setBio(response.data.bio || '');
        } else {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else {
        console.error('Error fetching user data:', error);
        toast.error(`Error fetching user data: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    let token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:4001/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.put('http://localhost:4001/api/users/me', formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          setUser(response.data);
          toast.success('Profile updated successfully');
        } else {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else {
        console.error('Error updating profile:', error);
        toast.error(`Failed to update profile: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h3" component="h1" gutterBottom>
        Profile
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar src={user.profilePicture} sx={{ width: 100, height: 100, mb: 2 }} />
      </Box>
      <TextField
        label="Email"
        value={user.email || ''}
        fullWidth
        margin="dense"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        margin="dense"
        multiline
        rows={4}
      />
      <Button
        variant="contained"
        component="label"
        fullWidth
        sx={{ mt: 2 }}
      >
        Upload Profile Picture
        <input
          type="file"
          hidden
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
      </Button>
      <Button onClick={handleUpdate} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Container>
  );
};

export default ProfilePage;
