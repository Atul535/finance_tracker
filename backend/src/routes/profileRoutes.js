const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinary');
const { getProfile, updateProfile, changePassword } = require('../controllers/profileControllers');

router.put('/update', authMiddleware, upload.single('profilePicture'), updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.get('/get', authMiddleware, getProfile);
module.exports = router;
