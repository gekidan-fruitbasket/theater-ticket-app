import { supabase } from '@/lib/supabase';
import { ReservationPageClient } from './components/ReservationPageClient';
import { LayoutData, Reservation } from './components/SeatMap';

interface Performance {
  id: string;
  title: string;
  start_time: string;
  venue_id: string;
  venues: {
    id: string;
    name: string;
    layout_data: LayoutData;
  };
}

async function getUpcomingPerformance(): Promise<Performance | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('performances')
    .select(`
      id,
      title,
      start_time,
      venue_id,
      venues (
        id,
        name,
        layout_data
      )
    `)
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching performance:', error);
    return null;
  }

  return data as Performance;
}

async function getReservations(performanceId: string): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, performance_id, user_id, seat_id, created_at')
    .eq('performance_id', performanceId);

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const performance = await getUpcomingPerformance();

  if (!performance) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-slate-800 mb-4">
            🎭 劇団チケット予約
          </h1>
          <p className="text-slate-600">
            現在予約可能な公演はありません。
          </p>
          <p className="text-slate-500 text-sm mt-2">
            次回公演の情報をお待ちください。
          </p>
        </div>
      </div>
    );
  }

  const reservations = await getReservations(performance.id);

  return (
    <ReservationPageClient
      performanceId={performance.id}
      performanceTitle={performance.title}
      startTime={performance.start_time}
      venueName={performance.venues.name}
      layoutData={performance.venues.layout_data}
      reservations={reservations}
    />
  );
}
