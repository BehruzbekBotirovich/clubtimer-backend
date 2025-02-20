import mongoose from "mongoose";

const {Schema} = mongoose; // Импортируем Schema

const ItemSchema = new Schema({
    type: {
        type: String,
        enum: ['table', 'PS4', 'PS5', 'karaoke'],
        required: true
    },
    activeTime: {
        type: String // Время доступности
    },
    pricePerTime: {
        type: Number,
        required: true
    },
    buildingId: {
        type: Schema.Types.String,
        ref: 'Building' // Связь с Building
    },
});

export default mongoose.model('Item', ItemSchema);