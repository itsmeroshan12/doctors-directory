const express = require('express');
const { getAllUserListings } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');// Adjust path as needed

const router = express.Router();

router.get('/listings', authenticateJWT, getAllUserListings);

module.exports = router;
