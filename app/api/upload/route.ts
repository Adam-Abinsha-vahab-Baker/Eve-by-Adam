import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Configuration for file upload
export const config = {
    api: {
        bodyParser: false,
    },
};

// POST handler for file upload
export async function POST(req: NextRequest) {
    try {
        // Parse form data
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Allowed types: PDF, JPEG, PNG, JPG, TXT'
            }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 10MB'
            }, { status: 400 });
        }

        // Create form data for upload
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        // Upload to Python backend
        try {
            const response = await axios.post('http://localhost:5000/upload', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Return successful response
            return NextResponse.json({
                message: 'File uploaded successfully',
                fileId: response.data.file_id,
                filename: response.data.filename
            }, { status: 200 });

        } catch (uploadError) {
            console.error('Backend upload error:', uploadError);

            // Handle specific axios error responses
            if (uploadError.response) {
                return NextResponse.json({
                    error: uploadError.response.data.error || 'File upload to backend failed',
                    details: uploadError.response.data
                }, { status: uploadError.response.status });
            }

            // Generic error handling
            return NextResponse.json({
                error: 'Failed to upload file to backend',
                details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
            }, { status: 500 });
        }

    } catch (err) {
        console.error('Unexpected upload error:', err);
        return NextResponse.json({
            error: 'An unexpected error occurred',
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET handler for unsupported methods
export async function GET() {
    return NextResponse.json(
        { message: 'File upload endpoint. Use POST to upload files.' },
        { status: 405 }
    );
}