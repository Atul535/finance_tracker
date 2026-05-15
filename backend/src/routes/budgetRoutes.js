const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { setBudget, getBudget, deleteBudget } = require('../controllers/budgetControllers');


router.post('/create', authmiddleware, setBudget);
router.get('/get', authmiddleware, getBudget);
router.delete('/delete/:id', authmiddleware, deleteBudget);

module.exports = router;