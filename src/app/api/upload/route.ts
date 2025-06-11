import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST to upload files
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string || 'uploads';
        const folder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return NextResponse.json(
                { error: `Upload failed: ${error.message}` },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({
            message: 'File uploaded successfully',
            data: {
                path: data.path,
                publicUrl,
                fileName,
                fileSize: file.size,
                fileType: file.type
            }
        });

    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Failed to process upload' },
            { status: 500 }
        );
    }
}

// DELETE to remove uploaded files
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('path');
        const bucket = searchParams.get('bucket') || 'uploads';

        if (!filePath) {
            return NextResponse.json(
                { error: 'File path is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            return NextResponse.json(
                { error: `Delete failed: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Delete API error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
