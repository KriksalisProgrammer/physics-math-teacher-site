import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client with service role key for bucket management
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST() {
    try {
        // Create avatars bucket if it doesn't exist
        const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
        
        if (listError) {
            return NextResponse.json({ error: `Failed to list buckets: ${listError.message}` }, { status: 500 });
        }

        const avatarsBucketExists = buckets.some(bucket => bucket.name === 'avatars');

        if (!avatarsBucketExists) {
            const { data, error } = await supabaseAdmin.storage.createBucket('avatars', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (error) {
                return NextResponse.json({ error: `Failed to create bucket: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ 
                message: 'Avatars bucket created successfully',
                bucket: data 
            });
        } else {
            return NextResponse.json({ 
                message: 'Avatars bucket already exists',
                exists: true 
            });
        }

    } catch (error: any) {
        return NextResponse.json({ 
            error: `Server error: ${error.message}` 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Check if avatars bucket exists
        const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars');

        return NextResponse.json({
            exists: !!avatarsBucket,
            bucket: avatarsBucket
        });

    } catch (error: any) {
        return NextResponse.json({ 
            error: `Server error: ${error.message}` 
        }, { status: 500 });
    }
}
