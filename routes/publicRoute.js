// routes/publicRoute.js

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Define public routes

// Ping route to check if server is alive
router.get('/ping', publicController.ping);

// Add more public routes here

module.exports = router;
