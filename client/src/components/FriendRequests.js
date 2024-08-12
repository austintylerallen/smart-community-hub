// components/FriendRequests.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4001/api/friends/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:4001/api/friends/accept', { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineFriendRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:4001/api/friends/decline', { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h5" component="h3">
        Friend Requests
      </Typography>
      <List>
        {friendRequests.map((request) => (
          <ListItem key={request._id}>
            <ListItemText primary={request.requester.name} secondary={request.requester.email} />
            <Button variant="contained" color="primary" onClick={() => handleAcceptFriendRequest(request._id)}>
              Accept
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeclineFriendRequest(request._id)}>
              Decline
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendRequests;
