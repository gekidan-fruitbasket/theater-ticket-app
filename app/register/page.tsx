'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/components/AuthProvider';

export default function RegisterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If user already has both names, redirect to home
    if (!loading && user?.real_name && user?.member_name) {
        router.push('/');
        return null;
    }

    async function onSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);

        const result = await updateProfile(formData);

        if (result.success) {
            window.location.href = '/';
        } else {
            setError(result.message);
            setIsPending(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;

    return (
        <div className="container max-w-md mx-auto p-4 pt-10">
            <Card>
                <CardHeader>
                    <CardTitle>プロフィール登録</CardTitle>
                    <CardDescription>
                        予約を行うために、以下の情報を登録してください。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="realName">お名前（必須）</Label>
                            <Input
                                id="realName"
                                name="realName"
                                placeholder="例：山田 太郎"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                利用者ご本人のお名前を入力してください。<br />
                                こちらがアプリ内の表示名になります。
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="memberName">関係する劇団員名（必須）</Label>
                            <Input
                                id="memberName"
                                name="memberName"
                                placeholder="例：大島 健太"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                チケットを依頼した劇団員の名前を入力してください。<br />
                                （劇団員ご本人の場合も、ご自身の名前を入力してください）
                            </p>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? '登録中...' : '登録して予約へ進む'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
