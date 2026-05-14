const prisma = require('../../prismaClient');
const bcrypt = require('bcrypt');

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, removePicture } = req.body;

        let dataToUpdate = {};
        if (name) dataToUpdate.name = name;

        if (req.file) {
            dataToUpdate.profilePictureUrl = req.file.path;
        } else if (removePicture === 'true') {
            dataToUpdate.profilePictureUrl = null;
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                profilePictureUrl: true,
                createdAt: true
            }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'please enter both old and new password' });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect Current Password' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.status(200).json({ message: 'password changed successfully' });
    }
    catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { // Exclude password!
                id: true,
                name: true,
                email: true,
                profilePictureUrl: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Don't forget to export it!
module.exports = { getProfile, updateProfile, changePassword };
