'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// テスト用の固定ユーザーID（認証実装後に差し替え）
const TEST_USER_ID = 'bd5d8438-497d-4367-8b00-ad154f8ef531';

interface ReserveResult {
    success: boolean;
    message: string;
}

export async function reserveSeat(
    performanceId: string,
    seatId: string
): Promise<ReserveResult> {
    try {
        const { error } = await supabaseAdmin
            .from('reservations')
            .insert({
                performance_id: performanceId,
                user_id: TEST_USER_ID,
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
