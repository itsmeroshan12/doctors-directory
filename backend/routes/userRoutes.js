const express = require('express');
const { getAllUserListings } = require('../controllers/userController');
const { verifyEmail } = require('../controllers/authController'); // 
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listings', authenticateJWT, getAllUserListings);


router.get('/verify-email', verifyEmail);

module.exports = router;
