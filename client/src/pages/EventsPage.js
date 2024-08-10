import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import GoogleMapComponent from '../components/GoogleMapComponent';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('http://localhost:4001/api/events');
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Events
      </Typography>
      <List>
        {events.map((event) => (
          <ListItem
            key={event._id}
            button
            onClick={() => setSelectedEvent(event)}
          >
            <ListItemText primary={event.title} secondary={event.date} />
          </ListItem>
        ))}
      </List>
      {selectedEvent && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            {selectedEvent.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedEvent.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {new Date(selectedEvent.date).toLocaleDateString()}
          </Typography>
          <GoogleMapComponent destination={selectedEvent.location} />
        </div>
      )}
    </Container>
  );
};

export default EventsPage;
