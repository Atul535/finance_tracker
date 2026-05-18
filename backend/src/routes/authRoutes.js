const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshAccessToken, forgetPassword, resetPassword } = require('../controllers/authControllers');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

module.exports = router;