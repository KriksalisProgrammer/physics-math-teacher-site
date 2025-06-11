import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Admin file upload API
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string || 'admin-uploads';
        const folder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type (more permissive for admin)
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB for admin)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB' },
                { status: 400 }
            );
        }

        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `${folder}/${fileName}`;

        // Convert file to buffer
        const fileBuffer = await file.arrayBuffer();

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            return NextResponse.json(
                { error: `Upload failed: ${error.message}` },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({
            message: 'File uploaded successfully',
            data: {
                path: data.path,
                url: urlData.publicUrl,
                size: file.size,
                type: file.type,
                originalName: file.name
            }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { error: `Upload failed: ${error.message}` },
            { status: 500 }
        );
    }
}

// GET to list uploaded files (admin only)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket') || 'admin-uploads';
    const folder = searchParams.get('folder') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(folder, {
                limit,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            return NextResponse.json(
                { error: `Failed to list files: ${error.message}` },
                { status: 500 }
            );
        }

        // Add public URLs to file objects
        const filesWithUrls = data?.map(file => {
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(`${folder}/${file.name}`);
            
            return {
                ...file,
                url: urlData.publicUrl
            };
        });

        return NextResponse.json({
            data: filesWithUrls,
            bucket,
            folder
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: `Failed to list files: ${error.message}` },
            { status: 500 }
        );
    }
}
