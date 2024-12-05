// src/lib/mongodb.ts
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Connecting to MongoDB...');
        console.log('URI:', MONGODB_URI.replace(/:[^:@]{1,}@/, ':****@')); // Logs URI with hidden password

        try {
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                console.log('Connected to MongoDB successfully');
                return mongoose;
            });
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error('Failed to establish MongoDB connection:', error);
        throw error;
    }

    return cached.conn;
}