const express = require('express');
const { createEvent, getEvents, getNearbyEvents } = require('../controllers/eventController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createEvent);
router.get('/', getEvents);
router.get('/nearby', getNearbyEvents); // Add this route

module.exports = router;
