import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token required' }, { status: 400 });
        }

        if (!LINE_CHANNEL_ID) {
            console.error('LINE_CHANNEL_ID is not set in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Verify ID Token with LINE API
        const params = new URLSearchParams({
            id_token: idToken,
            client_id: LINE_CHANNEL_ID,
        });

        const verifyRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!verifyRes.ok) {
            const errorData = await verifyRes.json();
            console.error('LINE Token Verification Failed:', errorData);
            return NextResponse.json({ error: 'Invalid token', details: errorData }, { status: 401 });
        }

        const data = await verifyRes.json();
        const { sub: lineUserId, name } = data;

        if (!lineUserId) {
            return NextResponse.json({ error: 'Token valid but lineUserId missing' }, { status: 400 });
        }

        // Upsert user to Supabase
        // Note: Using onConflict on line_user_id to update name if changed, or insert if new
        const { data: user, error: dbError } = await supabaseAdmin
            .from('profiles')
            .upsert(
                {
                    line_user_id: lineUserId,
                    display_name: name,
                },
                { onConflict: 'line_user_id' }
            )
            .select('id, line_user_id, display_name, role, real_name, member_name')
            .single();

        if (dbError) {
            console.error('DB Upsert Error:', dbError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Set session cookie
        const cookieStore = await cookies();

        // Secure HTTP-only cookie for server-side auth
        cookieStore.set('session_user_id', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'lax',
        });

        // Visible cookie for client-side display (optional usage)
        cookieStore.set('user_display_name', encodeURIComponent(user.display_name), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'lax',
        });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
