'use client';

import { useState } from 'react';
import { SeatMap, LayoutData, Reservation } from './components/SeatMap';

// Mock data for demonstration
const mockLayoutData: LayoutData = {
  rows: [
    {
      label: 'A',
      seats: [
        { id: 'A-1', type: 'seat' },
        { id: 'A-2', type: 'seat' },
        { id: 'A-3', type: 'seat' },
        { id: 'A-4', type: 'seat' },
        { id: null, type: 'aisle' },
        { id: 'A-5', type: 'seat' },
        { id: 'A-6', type: 'seat' },
        { id: 'A-7', type: 'seat' },
        { id: 'A-8', type: 'seat' },
      ],
    },
    {
      label: 'B',
      seats: [
        { id: 'B-1', type: 'seat' },
        { id: 'B-2', type: 'seat' },
        { id: 'B-3', type: 'seat' },
        { id: 'B-4', type: 'seat' },
        { id: null, type: 'aisle' },
        { id: 'B-5', type: 'seat' },
        { id: 'B-6', type: 'seat' },
        { id: 'B-7', type: 'seat' },
        { id: 'B-8', type: 'seat' },
      ],
    },
    {
      label: 'C',
      seats: [
        { id: 'C-1', type: 'seat' },
        { id: 'C-2', type: 'seat' },
        { id: 'C-3', type: 'seat' },
        { id: 'C-4', type: 'seat' },
        { id: null, type: 'aisle' },
        { id: 'C-5', type: 'seat' },
        { id: 'C-6', type: 'seat' },
        { id: 'C-7', type: 'seat' },
        { id: 'C-8', type: 'seat' },
      ],
    },
    {
      label: 'D',
      seats: [
        { id: 'D-1', type: 'seat' },
        { id: 'D-2', type: 'seat' },
        { id: 'D-3', type: 'seat' },
        { id: 'D-4', type: 'seat' },
        { id: null, type: 'aisle' },
        { id: 'D-5', type: 'seat' },
        { id: 'D-6', type: 'seat' },
        { id: 'D-7', type: 'seat' },
        { id: 'D-8', type: 'seat' },
      ],
    },
    {
      label: 'E',
      seats: [
        { id: 'E-1', type: 'seat' },
        { id: 'E-2', type: 'seat' },
        { id: 'E-3', type: 'seat' },
        { id: 'E-4', type: 'seat' },
        { id: null, type: 'aisle' },
        { id: 'E-5', type: 'seat' },
        { id: 'E-6', type: 'seat' },
        { id: 'E-7', type: 'seat' },
        { id: 'E-8', type: 'seat' },
      ],
    },
  ],
};

// Mock reservations (some seats already taken)
const mockReservations: Reservation[] = [
  { id: '1', performance_id: 'perf-1', user_id: 'user-1', seat_id: 'A-3', created_at: '2026-01-01' },
  { id: '2', performance_id: 'perf-1', user_id: 'user-1', seat_id: 'A-4', created_at: '2026-01-01' },
  { id: '3', performance_id: 'perf-1', user_id: 'user-2', seat_id: 'B-5', created_at: '2026-01-01' },
  { id: '4', performance_id: 'perf-1', user_id: 'user-2', seat_id: 'B-6', created_at: '2026-01-01' },
  { id: '5', performance_id: 'perf-1', user_id: 'user-3', seat_id: 'C-1', created_at: '2026-01-01' },
];

export default function Home() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Deselect if already selected
        return prev.filter((id) => id !== seatId);
      } else {
        // Add to selection
        return [...prev, seatId];
      }
    });
  };

  const handleReserve = () => {
    if (selectedSeats.length === 0) {
      alert('座席を選択してください');
      return;
    }
    // In a real app, this would call the API
    alert(`以下の座席を予約します:\n${selectedSeats.join(', ')}`);
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
            春の定期公演 2026
          </h2>
          <p className="text-slate-600 text-sm">
            📅 2026年3月15日（日）14:00開演
          </p>
          <p className="text-slate-600 text-sm">
            📍 市民会館 大ホール
          </p>
        </div>

        {/* Seat Map */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-md font-semibold text-slate-700 mb-4 text-center">
            座席を選択してください
          </h3>
          <SeatMap
            layoutData={mockLayoutData}
            reservations={mockReservations}
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
              disabled={selectedSeats.length === 0}
              className={`
                px-6 py-3 rounded-lg font-semibold text-white 
                transition-all duration-200
                ${selectedSeats.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              予約を確定する
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
