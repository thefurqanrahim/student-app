"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginData {
  email: string;
  password: string;
}

interface User {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((user: User) => user.email === data.email && user.password === data.password);

    if (user) {
      localStorage.setItem('loggedIn', 'true');
      router.push('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ml-4 mr-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
        <button
          type="button"
          onClick={() => router.push('/register')}
          className="w-full p-2 mt-4 border rounded text-blue-500 hover:bg-blue-100"
        >
          Don&apos;t have an account? Register
        </button>
      </form>
    </div>
  );
}
