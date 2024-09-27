"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newUser = { email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName };
    const existingUsers: { email: string; password: string; firstName: string; lastName: string }[] = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = existingUsers.some((user: any) => user.email === data.email);
    if (userExists) {
      setError("User with this email already exists");
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('loggedIn', 'true');
    router.push('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center h-screen ml-4 mr-4">
      <form onSubmit={handleRegister} className="w-full max-w-sm p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Register</button>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full p-2 bg-gray-500 text-white rounded mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}
