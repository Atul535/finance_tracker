const bcrypt = require('bcrypt');
const prisma = require('../../prismaClient');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
            }
        });
        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        next(error);
    }
};


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'user not found!' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'invalid password!' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken: refreshToken,
                expiresAt: expiresAt
            }
        });
        return res.status(200).json({
            message: 'Login Successful!',
            accessToken: token, // Rename it to accessToken here
            refreshToken: refreshToken,
            expiresAt: expiresAt,
            user: {             // Send the user details back!
                id: user.id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {
        next(error);
    }
};

const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // 1. Verify the token signature
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 2. Check if this exact session exists in our database
        const session = await prisma.session.findUnique({
            where: { refreshToken }
        });

        if (!session) {
            return res.status(401).json({ message: 'Invalid session. Please log in again.' });
        }

        // 3. Generate a brand new pair of tokens
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // 4. Update the database: delete the old session, create a new one (Rotation!)
        await prisma.session.delete({ where: { id: session.id } });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.session.create({
            data: {
                userId: decoded.userId,
                refreshToken: newRefreshToken,
                expiresAt: expiresAt
            }
        });

        // 5. Send the new tokens to the frontend
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        // If the refresh token is expired or tampered with
        return res.status(403).json({ message: 'Refresh token invalid or expired. Please log in again.' });
    }
};






module.exports = { registerUser, loginUser, refreshAccessToken };