import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Avatar, Box, IconButton, Badge, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PersonAdd, Check, Close, Notifications } from '@mui/icons-material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4001');

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
      setFriendRequests(response.data.friendRequests || []);
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
          setFriendRequests(response.data.friendRequests || []);
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

  const fetchNotifications = async () => {
    let token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4001/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(`Error fetching notifications: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNotifications();

    socket.on('friendRequestReceived', (data) => {
      fetchUserData();
      toast.info(`You have a new friend request from ${data.requesterId}`);
    });

    socket.on('postLiked', (data) => {
      fetchNotifications();
      toast.info(`Your post was liked by ${data.likerId}`);
    });

    socket.on('postCommented', (data) => {
      fetchNotifications();
      toast.info(`Your post was commented on by ${data.commenterId}`);
    });

    return () => {
      socket.off('friendRequestReceived');
      socket.off('postLiked');
      socket.off('postCommented');
    };
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

  const handleSendFriendRequest = async (recipientId) => {
    let token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:4001/api/friends/send', { recipientId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      socket.emit('sendFriendRequest', { recipientId, requesterId: user._id });
      toast.success('Friend request sent successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(`Failed to send friend request: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleAcceptFriendRequest = async (requesterId) => {
    let token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:4001/api/friends/accept', { requesterId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserData();
      toast.success('Friend request accepted successfully');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(`Failed to accept friend request: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleDeclineFriendRequest = async (requesterId) => {
    let token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:4001/api/friends/decline', { requesterId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserData();
      toast.success('Friend request declined successfully');
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error(`Failed to decline friend request: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <Container>
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

      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Friend Requests
        </Typography>
        <List>
          {friendRequests.map((request) => (
            <ListItem key={request._id}>
              <ListItemText primary={request.requester.name} secondary={request.requester.email} />
              <IconButton onClick={() => handleAcceptFriendRequest(request.requester._id)}>
                <Check />
              </IconButton>
              <IconButton onClick={() => handleDeclineFriendRequest(request.requester._id)}>
                <Close />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Notifications
        </Typography>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification._id}>
              <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
              {!notification.read && <Badge color="secondary" variant="dot" />}
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ProfilePage;
