import mongoose from 'mongoose';

const BloodSugarSchema = new mongoose.Schema({
    glucoseLevel: {
        type: Number,
        required: true,
    },
    measurementTime: {
        type: Date,
        required: true,
    },
    mealStatus: {
        type: String,
        required: true,
        enum: ['before', 'after', 'fasting'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const BloodSugar = mongoose.models.BloodSugar || mongoose.model('BloodSugar', BloodSugarSchema);