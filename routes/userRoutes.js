import express from "express";
import authMiddleware from "../middleware/auth.js"; // Подключение middleware

const router = express.Router();
// Пример маршрута
router.get('/',  (req, res) => {
    res.send('User routes part ');
});

// Получение всех пользователей с ролью "admin"
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({role: 'admin'}).select('-password'); // Исключаем пароль
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({message: 'Error getting admins', error});
    }
});

export default router;
