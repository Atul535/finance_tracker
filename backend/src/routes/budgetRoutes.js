const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { setBudget, getBudget, deleteBudget } = require('../controllers/budgetControllers');


router.post('/', authmiddleware, setBudget);
router.get('/', authmiddleware, getBudget);
router.delete('/:id', authmiddleware, deleteBudget);

module.exports = router;