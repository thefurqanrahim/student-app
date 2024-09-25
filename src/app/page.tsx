"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loggedIn');
        if (isLoggedIn) {
            router.push('/home');
        } else {
            router.push('/login');
        }
    }, [router]);

    return null;
}
