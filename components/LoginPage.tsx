
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(email, password);
        if (!success) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="bg-tubi-gray p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Sign In</h1>
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
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-tubi-red focus:border-tubi-red sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-tubi-red focus:border-tubi-red sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tubi-red hover:bg-tubi-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-tubi-gray focus:ring-tubi-red transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Not a member?{' '}
                    <a href="#/register" className="font-medium text-tubi-red-light hover:text-tubi-red">
                        Register now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
