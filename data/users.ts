import type { User } from '../types';

export const USERS: User[] = [
    {
        id: 1,
        email: 'admin@tubi.com',
        password: 'password', // In a real app, this would be hashed
        role: 'admin',
    },
    {
        id: 2,
        email: 'user@tubi.com',
        password: 'password',
        role: 'user',
    }
];
