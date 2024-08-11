import React, { useState } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const CreatePost = ({ fetchNewsfeed }) => {
  const [content, setContent] = useState('');

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:4001/api/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchNewsfeed();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" flexDirection="column">
        <TextField
          label="What's on your mind?"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Post
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
