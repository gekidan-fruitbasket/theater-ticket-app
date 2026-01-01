'use client';

import { useState } from 'react';
import { SeatMap, LayoutData, Reservation } from './SeatMap';

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
    reservations,
}: ReservationPageClientProps) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSeatClick = (seatId: string) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleReserve = async () => {
        if (selectedSeats.length === 0) {
            alert('座席を選択してください');
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: 実際のAPI呼び出しを実装
            alert(`以下の座席を予約します:\n${selectedSeats.join(', ')}`);
        } catch (error) {
            console.error('予約エラー:', error);
            alert('予約に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date for display
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold text-slate-800">
                        🎭 劇団チケット予約
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Performance Info */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        {performanceTitle}
                    </h2>
                    <p className="text-slate-600 text-sm">
                        📅 {formatDate(startTime)}
                    </p>
                    <p className="text-slate-600 text-sm">
                        📍 {venueName}
                    </p>
                </div>

                {/* Seat Map */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-md font-semibold text-slate-700 mb-4 text-center">
                        座席を選択してください
                    </h3>
                    <SeatMap
                        layoutData={layoutData}
                        reservations={reservations}
                        selectedSeats={selectedSeats}
                        onSeatClick={handleSeatClick}
                    />
                </div>

                {/* Selection Summary & Reserve Button */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-slate-600 text-sm">
                                選択中の座席:
                                <span className="font-semibold text-slate-800 ml-2">
                                    {selectedSeats.length > 0
                                        ? selectedSeats.join(', ')
                                        : 'なし'}
                                </span>
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                                {selectedSeats.length} 席選択中
                            </p>
                        </div>
                        <button
                            onClick={handleReserve}
                            disabled={selectedSeats.length === 0 || isSubmitting}
                            className={`
                px-6 py-3 rounded-lg font-semibold text-white 
                transition-all duration-200
                ${selectedSeats.length > 0 && !isSubmitting
                                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }
              `}
                        >
                            {isSubmitting ? '処理中...' : '予約を確定する'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
