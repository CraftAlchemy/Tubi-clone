
import React, { useState } from 'react';

interface RegisterPageProps {
    onRegister: (email: string, password: string) => boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const success = onRegister(email, password);
        if (!success) {
            setError('An account with this email already exists.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="bg-myflix-gray p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Create Account</h1>
                {error && <p className="bg-red-500 text-white text-sm p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-myflix-red focus:border-myflix-red sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-myflix-red focus:border-myflix-red sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-myflix-red focus:border-myflix-red sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-myflix-red hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-myflix-gray focus:ring-myflix-red transition-colors"
                        >
                            Register
                        </button>
                    </div>
                </form>
                 <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <a href="#/login" className="font-medium text-myflix-red hover:text-myflix-red/90">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;