import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Извлечение токена из заголовка
    if (!token) {
        return res.status(401).json({message: "Нет токена, доступ запрещён"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Верификация токена
        req.user = decoded; // Данные пользователя из токена
        next(); // Передача управления следующему middleware/обработчику
    } catch (error) {
        res.status(401).json({message: "Неверный токен"});
    }
};

export default authMiddleware;
