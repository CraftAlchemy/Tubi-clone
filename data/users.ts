import type { User } from '../types';

export const USERS: User[] = [
    {
        id: 1,
        email: 'admin@myflix.com',
        password: 'password', // In a real app, this would be hashed
        role: 'admin',
        tokens: 100,
    },
    {
        id: 2,
        email: 'user@myflix.com',
        password: 'password',
        role: 'user',
        tokens: 10,
    },
    {
        id: 3,
        email: 'jane.doe@example.com',
        password: 'password123',
        role: 'user',
        tokens: 5,
    },
    {
        id: 4,
        email: 'john.smith@example.com',
        password: 'password123',
        role: 'user',
        tokens: 20,
    },
    {
        id: 5,
        email: 'editor@myflix.com',
        password: 'password',
        role: 'admin',
        tokens: 50,
    }
];