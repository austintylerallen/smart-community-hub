const axios = require('axios');

// Fetch events from Eventbrite API using the organization ID
const getEventbriteEvents = async (req, res) => {
  const organizationId = '2243350764283'; // Your actual organization ID

  try {
    const response = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/`, {
      headers: {
        'Authorization': `Bearer ${process.env.EVENTBRITE_PRIVATE_TOKEN}`
      },
      params: {
        status: 'live'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching events from Eventbrite:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch events from Eventbrite' });
  }
};

module.exports = {
  getEventbriteEvents,
};
