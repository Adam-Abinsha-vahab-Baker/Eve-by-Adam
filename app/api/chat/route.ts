import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const { question } = await request.json();

    // Validate input
    if (!question || question.trim() === '') {
      return NextResponse.json(
          { error: 'Question is required' },
          { status: 400 }
      );
    }

    // Make a request to your Flask backend
    const flaskResponse = await fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    // Check if the response is successful
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(
          { error: errorData.error || 'Failed to fetch response' },
          { status: flaskResponse.status }
      );
    }

    // Parse the response from Flask
    const data = await flaskResponse.json();

    // Return the response
    return NextResponse.json({
      answer: data.answer,
      sources: data.sources || []
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
  }
}