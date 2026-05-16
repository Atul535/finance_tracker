const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { createReminder, getReminder, markAsPaid, deleteReminder } = require('../controllers/reminderControllers');

router.post('/create', authmiddleware, createReminder);
router.get('/get', authmiddleware, getReminder);
router.patch('/mark-paid/:id', authmiddleware, markAsPaid);
router.delete('/delete/:id', authmiddleware, deleteReminder);

module.exports = router;