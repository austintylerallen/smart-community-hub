const axios = require('axios');

const eventbriteClient = axios.create({
  baseURL: 'https://www.eventbriteapi.com/v3',
  headers: {
    Authorization: `Bearer PJ6TKBGLUR3SI65X24RH`, // Use your Public Token here
  },
});

// Function to get events
const getEvents = async () => {
  try {
    const response = await eventbriteClient.get('/events/');
    return response.data;
  } catch (error) {
    throw new Error(`Eventbrite API Error: ${error.message}`);
  }
};

// Function to create an event
const createEvent = async (eventData) => {
  try {
    const response = await eventbriteClient.post('/events/', eventData);
    return response.data;
  } catch (error) {
    throw new Error(`Eventbrite API Error: ${error.message}`);
  }
};

module.exports = { getEvents, createEvent };
