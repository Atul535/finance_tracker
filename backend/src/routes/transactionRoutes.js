const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createTransaction, getTransaction, deleteTransaction } = require('../controllers/transactionControllers');

router.post('/create', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

module.exports = router;