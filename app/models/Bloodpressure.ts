
import mongoose from 'mongoose';

const BloodPressureSchema = new mongoose.Schema({
    systolic: {
        type: Number,
        required: true,
    },
    diastolic: {
        type: Number,
        required: true,
    },
    measurementTime:  {
        type: Date,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const BloodPressure = mongoose.models.BloodPressure || mongoose.model('BloodPressure', BloodPressureSchema);