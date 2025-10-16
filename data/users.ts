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
    },
    {
        id: 3,
        email: 'jane.doe@example.com',
        password: 'password123',
        role: 'user',
    },
    {
        id: 4,
        email: 'john.smith@example.com',
        password: 'password123',
        role: 'user',
    },
    {
        id: 5,
        email: 'editor@tubi.com',
        password: 'password',
        role: 'admin',
    }
];
