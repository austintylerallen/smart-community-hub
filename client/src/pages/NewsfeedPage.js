import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import axios from 'axios';

const NewsfeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);

  const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post('http://localhost:4001/api/auth/refresh-token', { token });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  };

  const fetchNewsfeed = async () => {
    let token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:4001/api/newsfeed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.posts);
      setEvents(response.data.events);
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.get('http://localhost:4001/api/newsfeed', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPosts(response.data.posts);
          setEvents(response.data.events);
        } else {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else {
        console.error('Error fetching newsfeed:', error);
        alert(`Error fetching newsfeed: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchNewsfeed();
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Newsfeed
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Events Near You
      </Typography>
      <List component={Paper}>
        {events.map((event) => (
          <ListItem key={event._id}>
            <ListItemText primary={event.title} secondary={`${new Date(event.date).toLocaleString()} - ${event.location}`} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" component="h2" gutterBottom>
        Posts
      </Typography>
      <List component={Paper}>
        {posts.map((post) => (
          <ListItem key={post._id}>
            <ListItemText primary={post.content} secondary={`By ${post.creator.name} at ${new Date(post.createdAt).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default NewsfeedPage;
