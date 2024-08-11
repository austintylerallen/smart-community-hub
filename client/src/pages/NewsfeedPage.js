import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Box, Card, CardContent, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import { Favorite, Comment, Delete } from '@mui/icons-material';
import CreatePost from '../components/CreatePost'; // Import the CreatePost component

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
      localStorage.setItem('token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  };

  const fetchNewsfeed = async () => {
    let token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4001/api/newsfeed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched posts:', response.data); // Log fetched data
      setPosts(response.data || []);
      setEvents(response.data.events || []);
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.get('http://localhost:4001/api/newsfeed', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Fetched posts after token refresh:', response.data); // Log fetched data after token refresh
          setPosts(response.data || []);
          setEvents(response.data.events || []);
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

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:4001/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNewsfeed();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`Error deleting post: ${error.response ? error.response.data.message : error.message}`);
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
      <Box display="flex" justifyContent="space-between">
        <Box flex={1} mr={2}>
          <Typography variant="h4" component="h2" gutterBottom>
            Events Near You
          </Typography>
          <Paper elevation={3}>
            <List>
              {events.length > 0 ? (
                events.map((event) => (
                  <ListItem key={event._id}>
                    <ListItemText primary={event.title} secondary={`${new Date(event.date).toLocaleString()} - ${event.location}`} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  No events available
                </Typography>
              )}
            </List>
          </Paper>
        </Box>
        <Box flex={2}>
          <CreatePost fetchNewsfeed={fetchNewsfeed} /> {/* Add CreatePost component */}
          <Typography variant="h4" component="h2" gutterBottom>
            Posts
          </Typography>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>{post.creator?.name ? post.creator.name[0] : 'U'}</Avatar>
                    <Typography variant="body1">{post.creator?.name || 'Unknown User'}</Typography>
                    <IconButton onClick={() => handleDeletePost(post._id)} sx={{ ml: 'auto' }}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Typography variant="body1" mb={2}>{post.content}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">{new Date(post.createdAt).toLocaleString()}</Typography>
                    <Box>
                      <IconButton>
                        <Favorite />
                      </IconButton>
                      <IconButton>
                        <Comment />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No posts available
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default NewsfeedPage;
