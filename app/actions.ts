'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';



interface ReserveResult {
    success: boolean;
    message: string;
}

export async function reserveSeat(
    performanceId: string,
    seatId: string
): Promise<ReserveResult> {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) {
            return {
                success: false,
                message: 'ログインセッションが無効です。画面を更新して再ログインしてください。',
            };
        }

        const { error } = await supabaseAdmin
            .from('reservations')
            .insert({
                performance_id: performanceId,
                user_id: userId,
                seat_id: seatId,
            });

        if (error) {
            // Check for unique constraint violation (seat already reserved)
            if (error.code === '23505') {
                return {
                    success: false,
                    message: 'この座席は既に予約されています',
                };
            }

            console.error('Reservation error:', JSON.stringify(error, null, 2));
            console.error('Error details - code:', error.code, 'message:', error.message, 'details:', error.details);
            return {
                success: false,
                message: '予約に失敗しました。もう一度お試しください。',
            };
        }

        // Revalidate the page to show updated reservation status
        revalidatePath('/');

        return {
            success: true,
            message: '予約が完了しました！',
        };
    } catch (error) {
        console.error('Unexpected error:', error);
        return {
            success: false,
            message: 'エラーが発生しました。もう一度お試しください。',
        };
    }
}


export async function deleteReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) {
            return { success: false, message: '認証されていません' };
        }

        // Check admin role
        const { data: user, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (userError || !user || user.role !== 'admin') {
            return { success: false, message: '権限がありません' };
        }

        // Delete reservation
        const { error } = await supabaseAdmin
            .from('reservations')
            .delete()
            .eq('id', reservationId);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, message: '削除に失敗しました' };
        }

        revalidatePath('/admin');
        revalidatePath('/'); // Update seat map as well
        return { success: true, message: '予約を削除しました' };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, message: 'エラーが発生しました' };
    }
}
// ... (existing codes)

export async function getReservationsForAdmin() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) throw new Error('Unauthorized');

        // Check admin role
        const { data: user, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (userError || !user || user.role !== 'admin') {
            throw new Error('Forbidden');
        }

        const { data: reservations, error: ResError } = await supabaseAdmin
            .from('reservations')
            .select(`
                id,
                seat_id,
                created_at,
                profiles (
                    display_name
                )
            `)
            .order('seat_id', { ascending: true });

        if (ResError) throw ResError;

        return (reservations || []).map((r: any) => ({
            ...r,
            profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
        }));
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return [];
    }
}
