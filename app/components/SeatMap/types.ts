// Types for the SeatMap component

export interface Seat {
    id: string | null;
    type: 'seat' | 'aisle';
}

export interface Row {
    label: string;
    seats: Seat[];
}

export interface LayoutData {
    rows: Row[];
}

export interface Reservation {
    id: string;
    performance_id: string;
    user_id: string;
    seat_id: string;
    created_at: string;
}

export interface SeatMapProps {
    performanceId: string;
    layoutData: LayoutData;
    reservations: Reservation[];
    currentUserId?: string;
}
