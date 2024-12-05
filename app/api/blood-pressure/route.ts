import { connectDB } from "@/lib/mongodb";
import { BloodPressure} from "@/app/models/Bloodpressure";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Mark the route as dynamic
export const dynamic = "force-dynamic";

// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in `.env.local`
});

// GET Request: Fetch Latest Blood Sugar Entry with Optional AI Analysis
// GET Request: Fetch All Blood Pressure Entries Sorted by Time
export async function GET() {
    try {
        await connectDB(); // Connect to MongoDB

        // Retrieve and sort all blood pressure data by `measurementTime`
        const allData = await BloodPressure.find().sort({ measurementTime: -1 }); // Descending order by time

        if (!allData || allData.length === 0) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        // Optional: Add AI analysis for the most recent data
        let aiMessage = "";
        try {
            const latestData = allData[0]; // The most recent entry (already sorted)
            const aiPrompt = `Provide a brief health analysis based on the following blood pressure reading:
      - systolic: ${latestData.systolic} mmHg
      - diastolic: ${latestData.diastolic} mmHg`;

            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini", // or "gpt-4" if you have access
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant providing a one-sentence analysis of blood pressure readings.",
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
        return NextResponse.json({ allData, latestAnalysis: aiMessage });
    } catch (error) {
        console.error("Error fetching blood pressure data:", error);
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

        const { systolic, diastolic, measurementTime } = body;

        if (!systolic || !diastolic || !measurementTime) {
            console.error("Validation failed: Missing required fields", body);
            return NextResponse.json(
                {
                    error: "Missing required fields: systolic, diastolic, measurementTime",
                },
                { status: 400 }
            );
        }

        // Validate systolic and diastolic pressure
        if (isNaN(systolic) || systolic < 50 || systolic > 250) {
            console.error("Validation failed: Invalid systolic pressure", systolic);
            return NextResponse.json(
                {
                    error: "Invalid systolic pressure. It should be a number between 50 and 250 mmHg.",
                },
                { status: 400 }
            );
        }

        if (isNaN(diastolic) || diastolic < 30 || diastolic > 150) {
            console.error("Validation failed: Invalid diastolic pressure", diastolic);
            return NextResponse.json(
                {
                    error: "Invalid diastolic pressure. It should be a number between 30 and 150 mmHg.",
                },
                { status: 400 }
            );
        }

        // Create the blood sugar entry
        console.log("Creating blood sugar entry...");
        const bloodPressure = await BloodPressure.create({
            systolic: Number(systolic),
            measurementTime: new Date(measurementTime),
            diastolic: Number(diastolic),
        });

        console.log("Successfully created entry:", bloodPressure);

        // Return a success response
        return NextResponse.json(bloodPressure, { status: 201 });
    } catch (error) {
        console.error("Error in blood pressure API:", error);

        // Handle and respond to errors
        return NextResponse.json(
            {
                error: "Failed to create blood pressure entry",
                details: error instanceof Error ? error.message : "Unknown error",
                stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
            },
            { status: 500 }
        );
    }
}

