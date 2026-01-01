'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initLiff } from '@/lib/liff';
import liff from '@line/liff';

export interface User {
    id: string;
    line_user_id: string;
    display_name: string;
    role: 'user' | 'admin';
    real_name?: string;
    phone_number?: string;
    member_name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    login: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                // Initialize LIFF
                const liffInstance = await initLiff();

                // Check login status
                if (liffInstance.isLoggedIn()) {
                    // Get ID Token
                    const idToken = liffInstance.getIDToken();
                    if (idToken) {
                        // Verify and Create Session via API
                        const res = await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ idToken }),
                        });

                        if (res.ok) {
                            const data = await res.json();
                            if (mounted) setUser(data.user);
                        } else {
                            console.error('Auth API failed:', await res.text());
                            if (mounted) setError('認証に失敗しました。');
                        }
                    } else {
                        if (mounted) setError('IDトークンを取得できませんでした。');
                    }
                } else {
                    // If not logged in, trigger login automatically
                    // Note: This will redirect the user to LINE Login screen
                    liffInstance.login();
                    return;
                }
            } catch (err) {
                console.error('Auth Error:', err);
                if (mounted) setError('ログイン処理中にエラーが発生しました。');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initialize();

        return () => { mounted = false; };
    }, []);

    const login = () => {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login }}>
            {children}
        </AuthContext.Provider>
    );
}
