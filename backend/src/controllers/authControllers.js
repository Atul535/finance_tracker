const bcrypt = require('bcrypt');
const prisma = require('../../prismaClient');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/emailService')

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

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required!' });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // generate secure token
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        //save token to the user record
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: otp,
                resetTokenExpiry: expiry
            }
        });
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'Otp sent to your email!' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken: otp,
                resetTokenExpiry: { gte: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        next(error);
    }
};





module.exports = { registerUser, loginUser, refreshAccessToken, forgetPassword, resetPassword };