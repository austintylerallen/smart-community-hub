import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4001/api/friends/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendRequests(response.data);
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (userId) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:4001/api/friends/accept', { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFriendRequests(friendRequests.filter(request => request._id !== userId));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Friend Requests
      </Typography>
      <List>
        {friendRequests.map(request => (
          <ListItem key={request._id}>
            <ListItemText primary={request.name} secondary={request.email} />
            <Button variant="contained" color="primary" onClick={() => handleAcceptRequest(request._id)}>
              Accept
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FriendRequestsPage;
