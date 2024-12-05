import { connectDB } from "@/lib/mongodb";
import { Sleep } from "@/app/models/Sleep"; // Ensure you have a Sleep model
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Mark the route as dynamic
export const dynamic = "force-dynamic";

// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in `.env.local`
});

// Helper: Calculate sleep duration
const calculateSleepDuration = (start: Date, end: Date): string => {
    const msDiff = end.getTime() - start.getTime();
    const totalMinutes = Math.floor(msDiff / (1000 * 60)); // Convert milliseconds to minutes
    const hours = Math.floor(totalMinutes / 60); // Get total hours
    const minutes = totalMinutes % 60; // Get remaining minutes
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`; // Return as HH:MM
};

// GET Request: Fetch All Sleep Entries Sorted by Start Time
export async function GET() {
    try {
        await connectDB(); // Connect to MongoDB

        const allData = await Sleep.find().sort({ sleepStart: -1 }); // Descending order (most recent first)

        if (!allData || allData.length === 0) {
            return NextResponse.json({ error: "No sleep data found." }, { status: 404 });
        }

        // AI Analysis for the most recent entry
        const latestEntry = allData[0];
        const aiPrompt = `Provide a brief health analysis based on the following sleep data:
        - Sleep Start: ${latestEntry.sleepStart}
        - Sleep End: ${latestEntry.sleepEnd}
        - Sleep Quality: ${latestEntry.sleepQuality}`;

        let aiAnalysis = "AI response unavailable.";
        try {
            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Update based on your access
                messages: [
                    {
                        role: "system",
                        content: "You are a health expert. Provide concise insights about sleep data.",
                    },
                    { role: "user", content: aiPrompt },
                ],
                max_tokens: 50,
            });
            aiAnalysis = aiResponse.choices[0]?.message?.content?.trim() || aiAnalysis;
        } catch (aiError) {
            console.error("Error generating AI analysis:", aiError);
        }

        return NextResponse.json({ allData, latestAnalysis: aiAnalysis });
    } catch (error) {
        console.error("Error fetching sleep data:", error);
        return NextResponse.json(
            { error: "Failed to fetch sleep data.", details: error.message },
            { status: 500 }
        );
    }
}

// POST Request: Add New Sleep Entry
export async function POST(req: Request) {
    try {
        await connectDB(); // Connect to MongoDB

        const { sleepStart, sleepEnd, sleepQuality } = await req.json();

        if (!sleepStart || !sleepEnd || !sleepQuality) {
            return NextResponse.json(
                { error: "Missing required fields: sleepStart, sleepEnd, sleepQuality." },
                { status: 400 }
            );
        }

        const start = new Date(sleepStart);
        const end = new Date(sleepEnd);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return NextResponse.json(
                { error: "Invalid sleep times. Ensure start is before end and both are valid dates." },
                { status: 400 }
            );
        }

        // Calculate sleep duration
        const sleepDuration = calculateSleepDuration(start, end);

        // Create the sleep entry with the sleep duration
        const sleepEntry = await Sleep.create({
            sleepStart: start,
            sleepEnd: end,
            sleepQuality,
            sleepDuration, // Store the sleep duration in the database
        });

        return NextResponse.json(sleepEntry, { status: 201 });
    } catch (error) {
        console.error("Error creating sleep entry:", error);
        return NextResponse.json(
            {
                error: "Failed to create sleep entry.",
                details: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
