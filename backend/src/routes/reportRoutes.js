const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { getMonthlySummary, getCategoryBreakdown } = require('../controllers/reportControllers');

router.get('/monthly', authmiddleware, getMonthlySummary);
router.get('/category', authmiddleware, getCategoryBreakdown);

module.exports = router;