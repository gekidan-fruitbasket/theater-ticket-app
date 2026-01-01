'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReservation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReservationWithProfile = {
    id: string;
    seat_id: string;
    created_at: string;
    profiles: {
        display_name: string;
    } | null; // Join result might be null if referential integrity is broken, though unlikely
};

interface AdminDashboardProps {
    reservations: ReservationWithProfile[];
}

export default function AdminDashboard({ reservations: initialReservations }: AdminDashboardProps) {
    const router = useRouter();
    const [reservations] = useState<ReservationWithProfile[]>(initialReservations);
    const [sortOrder, setSortOrder] = useState<'seat' | 'date'>('seat');

    const handleSort = (order: 'seat' | 'date') => {
        setSortOrder(order);
        router.refresh(); // In a real app we might sort client-side, but let's just update state for render
    };

    const sortedReservations = [...reservations].sort((a, b) => {
        if (sortOrder === 'seat') {
            return a.seat_id.localeCompare(b.seat_id, undefined, { numeric: true });
        } else {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const handleDownloadCSV = () => {
        const header = '座席番号,予約者名,予約日時';
        const rows = sortedReservations.map(r => {
            const date = new Date(r.created_at).toLocaleString('ja-JP');
            const name = r.profiles?.display_name || '不明';
            return `${r.seat_id},${name},${date}`;
        });

        // Add BOM for Excel compatibility
        const csvContent = "\uFEFF" + [header, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string, seatId: string) => {
        if (!window.confirm(`座席 ${seatId} の予約を削除してもよろしいですか？\nこの操作は取り消せません。`)) {
            return;
        }

        const result = await deleteReservation(id);
        if (result.success) {
            alert(result.message);
            // In a more complex app, we'd update local state, but router.refresh handles re-fetching
            // deleteReservation calls revalidatePath
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">予約管理ダッシュボード</h1>
                <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
                    📥 CSVダウンロード
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">総予約数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reservations.length} / 30</div>
                        <p className="text-xs text-gray-500 mt-1">※ 全30席と仮定</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>予約一覧</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={sortOrder === 'seat' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setSortOrder('seat')}
                            >
                                座席順
                            </Button>
                            <Button
                                variant={sortOrder === 'date' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setSortOrder('date')}
                            >
                                日時順
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">座席</TableHead>
                                <TableHead>予約者名</TableHead>
                                <TableHead>予約日時</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedReservations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        予約はまだありません
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedReservations.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.seat_id}</TableCell>
                                        <TableCell>{r.profiles?.display_name || '不明'}</TableCell>
                                        <TableCell>{new Date(r.created_at).toLocaleString('ja-JP')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(r.id, r.seat_id)}
                                            >
                                                削除
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
