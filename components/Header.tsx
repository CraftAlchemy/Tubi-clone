

import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface HeaderProps {
    siteName: string;
    currentUser: User | null;
    onLogout: () => void;
    onBuyTokensClick: () => void;
    isCartoonSectionEnabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ siteName, currentUser, onLogout, onBuyTokensClick, isCartoonSectionEnabled }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/#/' },
        { name: 'Series', href: '#/series' },
    ];

    if (isCartoonSectionEnabled) {
        navLinks.push({ name: 'Cartoons', href: '#/cartoon' });
    }
    navLinks.push({ name: 'Live TV', href: '#/livetv' });


    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-myflix-black' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center space-x-8">
                        <a href="/#/" className="text-2xl md:text-3xl font-bold text-myflix-red tracking-wider">
                           {siteName.toUpperCase()}
                        </a>
                        <nav className="hidden lg:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <a key={link.name} href={link.href} className="text-white hover:text-gray-300 transition-colors text-sm font-medium">
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <div className="relative group">
                                <a href="#/profile" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                                        {currentUser.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:block text-white text-sm font-medium">{currentUser.tokens} Tokens</span>
                                </a>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-myflix-gray rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    <div className="py-1">
                                        <a href="#/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-myflix-black/50">Profile</a>
                                        <a href="#/earn-tokens" className="block px-4 py-2 text-sm text-gray-200 hover:bg-myflix-black/50">Earn Tokens</a>
                                        <button onClick={onBuyTokensClick} className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-myflix-black/50">Buy Tokens</button>
                                        {currentUser.role === 'admin' && <a href="#/admin" className="block px-4 py-2 text-sm text-gray-200 hover:bg-myflix-black/50">Admin Panel</a>}
                                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-myflix-black/50">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <a href="#/login" className="bg-myflix-red text-white text-sm font-bold px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
                                Sign In
                            </a>
                        )}
                        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-myflix-black/90 backdrop-blur-sm">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-gray-300 transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;