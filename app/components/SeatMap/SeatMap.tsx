'use client';

import { SeatMapProps } from './types';

export function SeatMap({
    layoutData,
    reservations,
    selectedSeats,
    onSeatClick
}: SeatMapProps) {
    // Create a set of reserved seat IDs for O(1) lookup
    const reservedSeatIds = new Set(reservations.map((r) => r.seat_id));

    const getSeatStatus = (seatId: string | null): 'available' | 'reserved' | 'selected' => {
        if (!seatId) return 'available';
        if (reservedSeatIds.has(seatId)) return 'reserved';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    const getSeatStyles = (status: 'available' | 'reserved' | 'selected'): string => {
        const baseStyles = 'w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center';

        switch (status) {
            case 'reserved':
                return `${baseStyles} bg-gray-300 text-gray-500 cursor-not-allowed`;
            case 'selected':
                return `${baseStyles} bg-emerald-500 text-white shadow-lg scale-105 cursor-pointer hover:bg-emerald-600`;
            case 'available':
            default:
                return `${baseStyles} bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 hover:scale-105`;
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            {/* Stage indicator */}
            <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-12 py-2 rounded-t-lg text-sm font-semibold shadow-md">
                    ステージ
                </div>
            </div>

            {/* Seat grid */}
            <div className="flex flex-col gap-2 items-center">
                {layoutData.rows.map((row) => (
                    <div key={row.label} className="flex items-center gap-1">
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
                                        disabled={status === 'reserved'}
                                        onClick={() => seat.id && onSeatClick(seat.id)}
                                        aria-label={`座席 ${seat.id} - ${status === 'reserved' ? '予約済み' :
                                                status === 'selected' ? '選択中' : '空席'
                                            }`}
                                    >
                                        {seatNumber}
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
            <div className="flex justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-100 border border-blue-200"></div>
                    <span className="text-gray-600">空席</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-500"></div>
                    <span className="text-gray-600">選択中</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gray-300"></div>
                    <span className="text-gray-600">予約済み</span>
                </div>
            </div>
        </div>
    );
}
