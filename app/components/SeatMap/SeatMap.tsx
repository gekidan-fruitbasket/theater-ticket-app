'use client';

import { useState, useTransition } from 'react';
import { SeatMapProps } from './types';
import { reserveSeat } from '@/app/actions';

export function SeatMap({
    performanceId,
    layoutData,
    reservations,
    currentUserId,
}: SeatMapProps) {
    const [isPending, startTransition] = useTransition();
    const [loadingSeatId, setLoadingSeatId] = useState<string | null>(null);

    // Create a map for reservation details lookup (O(1) access)
    // Map<seatId, Reservation>
    const reservationMap = new Map(reservations.map((r) => [r.seat_id, r]));

    const getSeatStatus = (seatId: string | null): 'available' | 'reserved' | 'reserved_by_me' | 'loading' => {
        if (!seatId) return 'available';

        if (loadingSeatId === seatId) return 'loading';

        const reservation = reservationMap.get(seatId);
        if (reservation) {
            return reservation.user_id === currentUserId ? 'reserved_by_me' : 'reserved';
        }

        return 'available';
    };

    const getSeatStyles = (status: 'available' | 'reserved' | 'reserved_by_me' | 'loading'): string => {
        const baseStyles = 'w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center';

        switch (status) {
            case 'reserved_by_me':
                return `${baseStyles} bg-green-500 text-white cursor-pointer hover:bg-green-600 shadow-sm transform hover:scale-105`;
            case 'reserved':
                return `${baseStyles} bg-gray-300 text-gray-400 cursor-not-allowed`;
            case 'loading':
                return `${baseStyles} bg-amber-400 text-white animate-pulse cursor-wait`;
            case 'available':
            default:
                return `${baseStyles} bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 hover:scale-105 hover:shadow-sm`;
        }
    };

    const handleSeatClick = async (seatId: string, status: string) => {
        if (status === 'reserved_by_me') {
            alert(`これはあなたの予約席（${seatId}）です ✅`);
            return;
        }

        if (status === 'reserved') return;

        const confirmed = window.confirm(`座席 ${seatId} を予約しますか？`);
        if (!confirmed) return;

        setLoadingSeatId(seatId);

        startTransition(async () => {
            const result = await reserveSeat(performanceId, seatId);
            setLoadingSeatId(null);

            if (result.success) {
                // Page will be revalidated automatically
            } else {
                alert(result.message);
            }
        });
    };

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="inline-block min-w-full">
                <div className="w-fit px-4">
                    {/* Stage indicator */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-12 py-2 rounded-t-lg text-sm font-semibold shadow-md">
                            ステージ
                        </div>
                    </div>

                    {/* Loading overlay */}
                    {isPending && (
                        <div className="text-center text-sm text-amber-600 mb-4 animate-pulse">
                            予約処理中...
                        </div>
                    )}

                    {/* Seat grid */}
                    <div className="flex flex-col gap-2">
                        {layoutData.rows.map((row, index) => (
                            <div key={`${row.label}-${index}`} className="flex items-center gap-1">
                                {/* Row label */}
                                <div className="w-6 text-center text-sm font-semibold text-gray-600">
                                    {row.label}
                                </div>

                                {/* Seats */}
                                <div className="flex gap-1">
                                    {row.seats.map((seat, index) => {
                                        if (seat.type === 'aisle') {
                                            return (
                                                <div
                                                    key={`aisle-${row.label}-${index}`}
                                                    className="w-4 h-8"
                                                />
                                            );
                                        }

                                        const status = getSeatStatus(seat.id);
                                        const seatNumber = seat.id?.split('-')[1] || '';

                                        return (
                                            <button
                                                key={seat.id}
                                                className={getSeatStyles(status)}
                                                disabled={status === 'reserved' || status === 'loading' || isPending}
                                                onClick={() => seat.id && handleSeatClick(seat.id, status)}
                                                aria-label={`座席 ${seat.id} - ${status === 'reserved_by_me' ? 'あなたの予約席' :
                                                    status === 'reserved' ? '他のお客様の予約席' :
                                                        status === 'loading' ? '処理中' : '空席'
                                                    }`}
                                            >
                                                {status === 'loading' ? (
                                                    <span className="animate-spin">⏳</span>
                                                ) : status === 'reserved_by_me' ? (
                                                    '✓'
                                                ) : (
                                                    seatNumber
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Row label (right side) */}
                                <div className="w-6 text-center text-sm font-semibold text-gray-600">
                                    {row.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-blue-100 border border-blue-200"></div>
                            <span className="text-gray-600">空席</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                            <span className="text-gray-600">あなたの予約</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-gray-300"></div>
                            <span className="text-gray-600">予約済み</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
