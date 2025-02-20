import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // Установим роль, если она передана
        });

        await newUser.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error });
    }
};
