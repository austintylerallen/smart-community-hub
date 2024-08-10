import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4001/api/events', { title, description, date, location }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle successful event creation
    } catch (error) {
      console.error('Create event error:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Event
      </Typography>
      <form onSubmit={handleCreateEvent}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Event
        </Button>
      </form>
    </Container>
  );
};

export default EventForm;
