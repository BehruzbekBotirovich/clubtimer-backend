import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    _id: {type: String, required: true},
    location: {type: String, required: true},
    image: {type: String, required: true}, // Ссылка на изображение
}, {timestamps: true});

export default mongoose.model('Building', buildingSchema);