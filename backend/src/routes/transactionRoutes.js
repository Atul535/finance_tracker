const express = require('express');
const router = express.Router();
const { authmiddleware } = require('../middlewares/authMiddleware');
const { createTransaction, getTransaction, deleteTransaction } = require('../controllers/transactionControllers');

router.post('/create', authmiddleware, createTransaction);
router.get('/get', authmiddleware, getTransaction);
router.delete('/delete/:id', authmiddleware, deleteTransaction);

module.exports = router;