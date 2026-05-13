const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

app.use(cors({
    origin: ['http://localhost:5173', 'https://finance-tracker-7o3o.onrender.com'], // Add your future frontend URL here later!
    credentials: true, // This allows cookies/tokens to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/profile',profileRoutes);


app.get('/', (req, res) => {
    res.send('Finance Tracker API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
