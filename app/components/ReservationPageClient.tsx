'use client';

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
                        空いている座席をタップして予約
                    </h3>
                    <SeatMap
                        performanceId={performanceId}
                        layoutData={layoutData}
                        reservations={reservations}
                    />
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <p className="text-amber-800 text-sm">
                        💡 座席をタップすると確認ダイアログが表示されます
                    </p>
                </div>
            </main>
        </div>
    );
}
