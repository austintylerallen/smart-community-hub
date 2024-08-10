const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const newEvent = new Event({ title, description, date, location, creator: req.userId });
    await newEvent.save();

    // Emit new event to all connected clients
    req.io.emit('newEvent', newEvent);

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNearbyEvents = async (req, res) => {
  const { lat, lng } = req.query;
  
  try {
    const events = await Event.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 10000 // Distance in meters
        }
      }
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
