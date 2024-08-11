// import React, { useEffect, useState } from 'react';
// import { Container, Typography, List, ListItem, ListItemText, Paper, Box, Card, CardContent, Avatar, IconButton, TextField, Button } from '@mui/material';
// import axios from 'axios';
// import { Favorite, FavoriteBorder, Comment, Delete, Edit } from '@mui/icons-material';
// import CreatePost from '../components/CreatePost';

// const NewsfeedPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [comments, setComments] = useState({});
//   const [newComment, setNewComment] = useState('');
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editingCommentContent, setEditingCommentContent] = useState('');

//   const refreshToken = async () => {
//     const token = localStorage.getItem('refreshToken');
//     if (!token) {
//       return null;
//     }

//     try {
//       const response = await axios.post('http://localhost:4001/api/auth/refresh-token', { token });
//       const newAccessToken = response.data.accessToken;
//       localStorage.setItem('token', newAccessToken);
//       return newAccessToken;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       return null;
//     }
//   };

//   const fetchNewsfeed = async () => {
//     let token = localStorage.getItem('token');
//     try {
//       const response = await axios.get('http://localhost:4001/api/newsfeed', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log('Fetched posts:', response.data);
//       setPosts(response.data || []);
//       setEvents(response.data.events || []);
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
//         token = await refreshToken();
//         if (token) {
//           const response = await axios.get('http://localhost:4001/api/newsfeed', {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           console.log('Fetched posts after token refresh:', response.data);
//           setPosts(response.data || []);
//           setEvents(response.data.events || []);
//         } else {
//           alert('Session expired. Please log in again.');
//           window.location.href = '/login';
//         }
//       } else {
//         console.error('Error fetching newsfeed:', error);
//         alert(`Error fetching newsfeed: ${error.response ? error.response.data.message : error.message}`);
//       }
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`http://localhost:4001/api/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchNewsfeed();
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       alert(`Error deleting post: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   const fetchComments = async (postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get(`http://localhost:4001/api/comments/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComments((prev) => ({ ...prev, [postId]: response.data }));
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   const handleCreateComment = async (postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.post(
//         'http://localhost:4001/api/comments',
//         { content: newComment, postId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNewComment('');
//       fetchComments(postId);
//     } catch (error) {
//       console.error('Error creating comment:', error);
//     }
//   };

//   const handleEditComment = async (commentId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(
//         `http://localhost:4001/api/comments/${commentId}`,
//         { content: editingCommentContent },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditingCommentId(null);
//       setEditingCommentContent('');
//       fetchComments(editingCommentId);
//     } catch (error) {
//       console.error('Error editing comment:', error);
//     }
//   };

//   const handleDeleteComment = async (commentId, postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`http://localhost:4001/api/comments/${commentId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchComments(postId);
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//     }
//   };

//   const handleLikePost = async (postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(`http://localhost:4001/api/posts/${postId}/like`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchNewsfeed();
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//   };

//   const handleUnlikePost = async (postId) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(`http://localhost:4001/api/posts/${postId}/unlike`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchNewsfeed();
//     } catch (error) {
//       console.error('Error unliking post:', error);
//     }
//   };

//   useEffect(() => {
//     fetchNewsfeed();
//   }, []);

//   return (
//     <Container>
//       <Typography variant="h3" component="h1" gutterBottom>
//         Newsfeed
//       </Typography>
//       <Box display="flex" justifyContent="space-between">
//         <Box flex={1} mr={2}>
//           <Typography variant="h4" component="h2" gutterBottom>
//             Events Near You
//           </Typography>
//           <Paper elevation={3}>
//             <List>
//               {events.length > 0 ? (
//                 events.map((event) => (
//                   <ListItem key={event._id}>
//                     <ListItemText primary={event.title} secondary={`${new Date(event.date).toLocaleString()} - ${event.location}`} />
//                   </ListItem>
//                 ))
//               ) : (
//                 <Typography variant="body2" color="textSecondary" align="center">
//                   No events available
//                 </Typography>
//               )}
//             </List>
//           </Paper>
//         </Box>
//         <Box flex={2}>
//           <CreatePost fetchNewsfeed={fetchNewsfeed} />
//           <Typography variant="h4" component="h2" gutterBottom>
//             Posts
//           </Typography>
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <Card key={post._id} variant="outlined" sx={{ mb: 2 }}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={2}>
//                     <Avatar src={post.creator?.profilePicture} sx={{ mr: 2 }} />
//                     <Typography variant="body1">{post.creator?.name || 'Unknown User'}</Typography>
//                     <IconButton onClick={() => handleDeletePost(post._id)} sx={{ ml: 'auto' }}>
//                       <Delete />
//                     </IconButton>
//                   </Box>
//                   <Typography variant="body1" mb={2}>{post.content}</Typography>
//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="body2" color="textSecondary">{new Date(post.createdAt).toLocaleString()}</Typography>
//                     <Box>
//                       <IconButton onClick={() => post.likes.includes(localStorage.getItem('userId')) ? handleUnlikePost(post._id) : handleLikePost(post._id)}>
//                         {post.likes.includes(localStorage.getItem('userId')) ? <Favorite /> : <FavoriteBorder />}
//                       </IconButton>
//                       <IconButton onClick={() => fetchComments(post._id)}>
//                         <Comment />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                   {comments[post._id] && (
//                     <Box mt={2}>
//                       {comments[post._id].map((comment) => (
//                         <Card key={comment._id} variant="outlined" sx={{ mb: 1 }}>
//                           <CardContent>
//                             <Box display="flex" alignItems="center">
//                               <Avatar sx={{ mr: 2 }}>{comment.creator?.name ? comment.creator.name[0] : 'U'}</Avatar>
//                               <Typography variant="body1">{comment.creator?.name || 'Unknown User'}</Typography>
//                               <IconButton onClick={() => setEditingCommentId(comment._id)} sx={{ ml: 'auto' }}>
//                                 <Edit />
//                               </IconButton>
//                               <IconButton onClick={() => handleDeleteComment(comment._id, post._id)}>
//                                 <Delete />
//                               </IconButton>
//                             </Box>
//                             {editingCommentId === comment._id ? (
//                               <Box display="flex" alignItems="center" mt={2}>
//                                 <TextField
//                                   value={editingCommentContent}
//                                   onChange={(e) => setEditingCommentContent(e.target.value)}
//                                   variant="outlined"
//                                   fullWidth
//                                   sx={{ mr: 2 }}
//                                 />
//                                 <Button variant="contained" color="primary" onClick={() => handleEditComment(comment._id)}>
//                                   Save
//                                 </Button>
//                               </Box>
//                             ) : (
//                               <>
//                                 <Typography variant="body1" mt={2}>{comment.content}</Typography>
//                                 <Typography variant="body2" color="textSecondary">{new Date(comment.createdAt).toLocaleString()}</Typography>
//                               </>
//                             )}
//                           </CardContent>
//                         </Card>
//                       ))}
//                       <Box display="flex" alignItems="center" mt={2}>
//                         <TextField
//                           label="Add a comment"
//                           value={newComment}
//                           onChange={(e) => setNewComment(e.target.value)}
//                           variant="outlined"
//                           fullWidth
//                           sx={{ mr: 2 }}
//                         />
//                         <Button variant="contained" color="primary" onClick={() => handleCreateComment(post._id)}>
//                           Comment
//                         </Button>
//                       </Box>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <Typography variant="body2" color="textSecondary" align="center">
//               No posts available
//             </Typography>
//           )}
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default NewsfeedPage;



import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Box, Card, CardContent, Avatar, IconButton, TextField, Button, Tooltip } from '@mui/material';
import axios from 'axios';
import { Favorite, FavoriteBorder, Comment, Delete, Edit } from '@mui/icons-material';
import CreatePost from '../components/CreatePost';

const NewsfeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
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
      setEvents(response.data.events || []);
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Authentication failed: Invalid token') {
        token = await refreshToken();
        if (token) {
          const response = await axios.get('http://localhost:4001/api/newsfeed', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Fetched posts after token refresh:', response.data);
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
                        <IconButton onClick={() => post.likes.includes(localStorage.getItem('userId')) ? handleUnlikePost(post._id) : handleLikePost(post._id)}>
                          {post.likes.includes(localStorage.getItem('userId')) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Tooltip>
                      <IconButton onClick={() => fetchComments(post._id)}>
                        <Comment />
                      </IconButton>
                    </Box>
                  </Box>
                  {post.likes.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Liked by {post.likes.map((like, index) => (
                        <span key={like._id}>{like.name}{index < post.likes.length - 1 ? ', ' : ''}</span>
                      ))}
                    </Typography>
                  )}
                  {comments[post._id] && (
                    <Box mt={2}>
                      {comments[post._id].map((comment) => (
                        <Card key={comment._id} variant="outlined" sx={{ mb: 1 }}>
                          <CardContent>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2 }}>{comment.creator?.name ? comment.creator.name[0] : 'U'}</Avatar>
                              <Typography variant="body1">{comment.creator?.name || 'Unknown User'}</Typography>
                              <IconButton onClick={() => setEditingCommentId(comment._id)} sx={{ ml: 'auto' }}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteComment(comment._id, post._id)}>
                                <Delete />
                              </IconButton>
                            </Box>
                            {editingCommentId === comment._id ? (
                              <Box display="flex" alignItems="center" mt={2}>
                                <TextField
                                  value={editingCommentContent}
                                  onChange={(e) => setEditingCommentContent(e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  sx={{ mr: 2 }}
                                />
                                <Button variant="contained" color="primary" onClick={() => handleEditComment(comment._id)}>
                                  Save
                                </Button>
                              </Box>
                            ) : (
                              <>
                                <Typography variant="body1" mt={2}>{comment.content}</Typography>
                                <Typography variant="body2" color="textSecondary">{new Date(comment.createdAt).toLocaleString()}</Typography>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      <Box display="flex" alignItems="center" mt={2}>
                        <TextField
                          label="Add a comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          variant="outlined"
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={() => handleCreateComment(post._id)}>
                          Comment
                        </Button>
                      </Box>
                    </Box>
                  )}
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
