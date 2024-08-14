import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Avatar, IconButton, TextField, Button, Tooltip, Box } from '@mui/material';
import axios from 'axios';
import { Favorite, FavoriteBorder, Comment, Delete, Edit, Cancel } from '@mui/icons-material';
import CreatePost from '../components/CreatePost';
import EventsPage from './EventsPage'; // Import the EventsPage component

const NewsfeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

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
      console.log('Fetched posts:', response.data);
      setPosts(response.data || []);
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.get('http://localhost:4001/api/newsfeed', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Fetched posts after token refresh:', response.data);
          setPosts(response.data || []);
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

  const fetchComments = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:4001/api/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreateComment = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:4001/api/comments',
        { content: newComment, postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments(postId);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:4001/api/comments/${commentId}`,
        { content: editingCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingCommentContent('');
      fetchComments(editingCommentId);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:4001/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments(postId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:4001/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNewsfeed();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlikePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:4001/api/posts/${postId}/unlike`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNewsfeed();
    } catch (error) {
      console.error('Error unliking post:', error);
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
        <Box flex={2}>
          <CreatePost fetchNewsfeed={fetchNewsfeed} />
          <Typography variant="h4" component="h2" gutterBottom>
            Posts
          </Typography>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={post.creator?.profilePicture} sx={{ mr: 2 }} />
                    <Typography variant="body1">{post.creator?.name || 'Unknown User'}</Typography>
                    <IconButton onClick={() => handleDeletePost(post._id)} sx={{ ml: 'auto' }}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Typography variant="body1" mb={2}>{post.content}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">{new Date(post.createdAt).toLocaleString()}</Typography>
                    <Box>
                      <Tooltip title={`${post.likes.length} Likes`}>
                        <IconButton onClick={() => post.liked ? handleUnlikePost(post._id) : handleLikePost(post._id)}>
                          {post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Comments">
                        <IconButton onClick={() => fetchComments(post._id)}>
                          <Comment />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    {comments[post._id]?.map((comment) => (
                      <Box key={comment._id} display="flex" alignItems="center" mb={1}>
                        <Avatar src={comment.creator?.profilePicture} sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>{comment.content}</Typography>
                        {editingCommentId === comment._id ? (
                          <>
                            <TextField
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <IconButton onClick={() => handleEditComment(comment._id)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => setEditingCommentId(null)}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => setEditingCommentId(comment._id) && setEditingCommentContent(comment.content)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteComment(comment._id, post._id)}>
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    ))}
                    <Box display="flex" alignItems="center">
                      <TextField
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        size="small"
                        fullWidth
                        placeholder="Add a comment"
                      />
                      <Button onClick={() => handleCreateComment(post._id)} variant="contained" color="primary" sx={{ ml: 1 }}>
                        Post
                      </Button>
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
        <Box flex={1}>
          <EventsPage /> {/* Include the EventsPage component here */}
        </Box>
      </Box>
    </Container>
  );
};

export default NewsfeedPage;
