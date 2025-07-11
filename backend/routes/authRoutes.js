const express = require('express');
const { registerUser, verifyEmail, loginUser, logoutUser, forgotPassword, resetPassword,  } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // logout route
router.post('/user/forgot-password', forgotPassword); // forgot password route
router.post('/user/reset-password/:token', resetPassword);

module.exports = router;
