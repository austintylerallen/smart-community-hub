const express = require('express');
const { getEventbriteEvents } = require('../controllers/eventController');

const router = express.Router();

router.get('/eventbrite', getEventbriteEvents); // Ensure this is a GET route

module.exports = router;
