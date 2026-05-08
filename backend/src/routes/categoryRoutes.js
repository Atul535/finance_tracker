const express = require('express');
const router = express.Router();
const { createCategory, getCategories, deleteCategory, updateCategory } = require('../controllers/categoryControllers');
const { authmiddleware } = require('../middlewares/authMiddleware');

router.use(authmiddleware);

router.post('/create', createCategory);
router.get('/get', getCategories);
router.delete('/delete/:id', deleteCategory);
router.put('/update/:id', updateCategory);

module.exports = router;