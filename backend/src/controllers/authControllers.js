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
                fullName,
                email,
                password: hashedPassword,
            }
        });
        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
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
        return res.status(200).json({ message: 'Login Successful!', token });

    } catch (error) {
        next(error);
    }
};





module.exports = { registerUser, loginUser };