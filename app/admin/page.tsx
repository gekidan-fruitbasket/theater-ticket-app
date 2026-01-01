'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { getReservationsForAdmin } from '@/app/actions';
import AdminDashboard from './components/AdminDashboard'; // Ensure export default in AdminDashboard

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [reservations, setReservations] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (loading) return;

        // If not logged in, AuthProvider should initiate login. 
        // We just wait or show loading.
        if (!user) {
            // If AuthProvider failed or user cancelled, maybe we should redirect?
            // But for now, let's wait for user to be populated.
            return;
        }

        if (user.role !== 'admin') {
            console.log('Not admin, redirecting...');
            router.push('/');
            return;
        }

        // Fetch Data
        getReservationsForAdmin()
            .then((data) => {
                setReservations(data);
                setIsFetching(false);
            })
            .catch(err => {
                console.error(err);
                setIsFetching(false);
            });

    }, [user, loading, router]);

    if (loading || isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="animate-spin text-4xl">⏳</div>
                <p className="text-gray-600 font-medium">管理者ダッシュボードを読み込み中...</p>
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    return <AdminDashboard reservations={reservations} />;
}
