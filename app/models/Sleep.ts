import mongoose from "mongoose";

const SleepSchema = new mongoose.Schema({
    sleepStart: {
        type: Date,
        required: true,
    },
    sleepEnd: {
        type: Date,
        required: true,
    },
    sleepQuality: {
        type: String,
        enum: ["excellent", "good", "fair", "poor"], // Predefined quality values
        required: true,
    },
    sleepDuration: {
        type: String, // Storing as HH:mm format
        required: true, // Calculated and mandatory
    },
    notes: {
        type: String, // Optional field for additional comments or observations
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Sleep = mongoose.models.Sleep || mongoose.model("Sleep", SleepSchema);
