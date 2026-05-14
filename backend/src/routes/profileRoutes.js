const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinary');
const { getProfile, updateProfile, changePassword } = require('../controllers/profileControllers');

router.put('/update', authmiddleware, upload.single('profilePicture'), updateProfile);
router.put('/change-password', authmiddleware, changePassword);
router.get('/get', authmiddleware, getProfile);
module.exports = router;
