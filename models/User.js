import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'owner', 'user'],
        default: 'user' // Роль по умолчанию — обычный пользователь
    },
}, {timestamps: true});

export default mongoose.model('User', userSchema);
