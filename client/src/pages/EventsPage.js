import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/events/eventbrite`);
      console.log('Events fetched:', response.data); // Debug: log fetched events
      setEvents(response.data.events || []);
    } catch (err) {
      const errorMsg = err.response ? err.response.data.message : err.message;
      setError(`Failed to fetch events: ${errorMsg}`);
      console.error('Error fetching events:', errorMsg); // Debug: log error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <Button variant="contained" color="primary" onClick={fetchEvents}>
        Fetch Events
      </Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {events.length > 0 ? (
        <List>
          {events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText primary={event.name.text} secondary={event.start.local} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No events available</Typography>
      )}
    </Container>
  );
};

export default EventsPage;
