import { connectDB } from "@/lib/mongodb";
import { BloodSugar } from "@/app/models/Bloodsugar";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Mark the route as dynamic
export const dynamic = "force-dynamic";

// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in `.env.local`
});

// GET Request: Fetch All Blood Sugar Entries Sorted by Time
export async function GET() {
    try {
        await connectDB(); // Connect to MongoDB

        // Retrieve and sort all blood sugar entries by `measurementTime`
        const allData = await BloodSugar.find().sort({ measurementTime: -1 }); // Descending order (most recent first)

        if (!allData || allData.length === 0) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        // Optional: Add AI analysis for the most recent entry
        let aiMessage = "";
        try {
            const latestData = allData[0]; // The most recent entry (already sorted)
            const aiPrompt = `Provide a brief health analysis based on the following blood sugar reading:
      - Glucose Level: ${latestData.glucoseLevel} mg/dL
      - Meal Status: ${latestData.mealStatus}`;

            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini", // or "gpt-4" if you have access
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that provides a one sentence analysis of the blood sugar readings.",
                    },
                    {
                        role: "user",
                        content: aiPrompt,
                    },
                ],
                max_tokens: 50,
            });

            aiMessage = aiResponse.choices[0]?.message?.content?.trim() || "AI response unavailable.";
        } catch (aiError) {
            console.error("Error generating AI response:", aiError);
            aiMessage = "AI response could not be generated.";
        }

        // Include AI analysis for the latest data and return the full dataset
        return NextResponse.json({
            allData,
            latestAnalysis: aiMessage,
        });
    } catch (error) {
        console.error("Error fetching blood sugar data:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch data",
                details: error.message,
            },
            { status: 500 }
        );
    }
}


// POST Request: Add New Blood Sugar Entry
export async function POST(req: Request) {
    console.log("Received blood sugar POST request");

    try {
        // Connect to the database
        console.log("Attempting to connect to MongoDB...");
        await connectDB();
        console.log("MongoDB connection successful");

        // Parse and validate the request body
        const body = await req.json();
        console.log("Received data:", body);

        const { glucoseLevel, measurementTime, mealStatus } = body;

        if (!glucoseLevel || !measurementTime || !mealStatus) {
            console.error("Validation failed: Missing required fields", body);
            return NextResponse.json(
                {
                    error: "Missing required fields: glucoseLevel, measurementTime, mealStatus",
                },
                { status: 400 }
            );
        }

        // Validate glucose level (e.g., should be a number within a realistic range)
        if (isNaN(glucoseLevel) || glucoseLevel < 20 || glucoseLevel > 1000) {
            console.error("Validation failed: Invalid glucose level", glucoseLevel);
            return NextResponse.json(
                {
                    error: "Invalid glucose level. It should be a number between 20 and 1000 mg/dL.",
                },
                { status: 400 }
            );
        }

        // Create the blood sugar entry
        console.log("Creating blood sugar entry...");
        const bloodSugar = await BloodSugar.create({
            glucoseLevel: Number(glucoseLevel),
            measurementTime: new Date(measurementTime),
            mealStatus,
        });

        console.log("Successfully created entry:", bloodSugar);

        // Return a success response
        return NextResponse.json(bloodSugar, { status: 201 });
    } catch (error) {
        console.error("Error in blood sugar API:", error);

        // Handle and respond to errors
        return NextResponse.json(
            {
                error: "Failed to create blood sugar entry",
                details: error instanceof Error ? error.message : "Unknown error",
                stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
            },
            { status: 500 }
        );
    }
}

