// Import
const express = require('express');
const router = express.Router();

// Controllers
const pageController = require('../controllers/pageController');

// GET Routes
router.get('/', pageController.indexGet);
router.get('/game',  pageController.gameGet);
router.get('/test',  pageController.testGet);
router.get('/test-error', (req, res) => {throw new Error('This is a test error!');}); // Show the errorHandler working

// Export
module.exports = router;