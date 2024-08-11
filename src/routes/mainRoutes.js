// Import
const express = require('express');
const router = express.Router();

// Controllers
const indexController = require('../controllers/indexController');

// GET Routes
router.get('/', indexController.indexGet);
router.get('/test-error', (req, res) => {throw new Error('This is a test error!');}); // Show the errorHandler working

// Export
module.exports = router;