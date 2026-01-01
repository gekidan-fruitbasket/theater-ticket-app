'use client';

import { useAuth } from './AuthProvider';
import { SeatMap } from '@/app/components/SeatMap/SeatMap';
import { LayoutData, Reservation } from '@/app/components/SeatMap/types';

interface ReservationPageClientProps {
    performanceId: string;
    performanceTitle: string;
    startTime: string;
    venueName: string;
    layoutData: LayoutData;
    reservations: Reservation[];
}

export function ReservationPageClient({
    performanceId,
    performanceTitle,
    startTime,
    venueName,
    layoutData,
    reservations
}: ReservationPageClientProps) {
    const { user, loading, error } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="text-4xl animate-bounce">🎭</div>
                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                    <span className="animate-spin text-xl">⏳</span>
                    <span>LINEでログイン中...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
                <div className="text-red-500 text-4xl">⚠️</div>
                <p className="text-red-600 font-medium text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium active:scale-95 transition-transform"
                >
                    再読み込み
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-4 pb-20">
            {/* Header with User Info */}
            <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{performanceTitle}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <span>📅 {new Date(startTime).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', weekday: 'short' })}</span>
                        <span className="mx-1">|</span>
                        <span>📍 {venueName}</span>
                    </p>
                </div>
                <div className="text-right pl-4 border-l border-gray-100 ml-4 shrink-0">
                    <p className="text-[10px] text-gray-500">ようこそ</p>
                    <p className="font-bold text-indigo-600 text-sm truncate max-w-[120px]">{user?.display_name || 'ゲスト'} さん</p>
                </div>
            </div>

            {/* Seat Map Area */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100">
                <div className="text-center mb-6">
                    <h3 className="font-bold text-gray-700">座席を選択</h3>
                    <p className="text-xs text-gray-400 mt-1">空いている座席（青色）をタップして予約してください</p>
                </div>

                <SeatMap
                    performanceId={performanceId}
                    layoutData={layoutData}
                    reservations={reservations}
                    currentUserId={user?.id}
                />
            </div>
        </div>
    );
}
