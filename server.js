import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import cors from "cors";

dotenv.config(); // Загрузка переменных окружения

const app = express();
app.use(express.json());

app.use(cors()); // Разрешить все источники
// Или с настройками:
const allowedOrigins = [
    "http://localhost:3000", // Для локальной разработки
    "https://clubtimer.vercel.app" // Для продакшена
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
// Логирование запросов (только в разработке)
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Подключение к MongoDB
const connectToDatabase = async () => {
    try {
        mongoose.set('strictQuery', false); // Avoid deprecation warnings
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
// Call the function to connect to the database
connectToDatabase().then(r => {

});


// Маршруты
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
