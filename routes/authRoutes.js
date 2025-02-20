import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Auth routes part ');
});
// Регистрация
router.post('/register', async (req, res) => {
    const {fullname, email, password} = req.body;

    try {
        // Проверяем, есть ли пользователь с таким email
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: 'Email already exists'});

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём пользователя
        const newUser = new User({fullname, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: 'Registration failed', error});
    }
});

// Вход
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        // Проверяем, существует ли пользователь
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: 'User not found'});

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({message: 'Invalid password'});

        // Генерируем токен
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '12h'});

        res.status(200).json({message: 'Login successful', token});
    } catch (error) {
        res.status(500).json({message: 'Login failed', error});
    }
});

// Проверка токена
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({message: 'No token provided'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({message: 'Invalid token'});
    }
});

export default router;
