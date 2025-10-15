import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSearch }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-tubi-black bg-opacity-95' : 'bg-transparent'}`}>
            <div className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-4">
                <div className="flex items-center space-x-8">
                     <a href="/#/"><TubiLogo /></a>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
                        <a href="#" className="text-white hover:text-tubi-light-gray transition-colors">Browse</a>
                        <a href="#" className="text-white hover:text-tubi-light-gray transition-colors">Live TV</a>
                        <a href="#" className="text-white hover:text-tubi-light-gray transition-colors">Tubi Kids</a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-tubi-gray border-2 border-transparent focus:border-tubi-light-gray focus:ring-0 rounded-full pl-4 pr-10 py-1.5 w-40 md:w-64 text-sm text-white transition-width duration-300"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                    {currentUser ? (
                         <>
                            <a href="#/profile" className="hidden md:flex items-center text-sm font-semibold border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                                <UserIcon />
                                <span className="ml-2">Profile</span>
                            </a>
                            <button onClick={onLogout} className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="#/login" className="hidden md:block text-sm font-semibold border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                                Sign In
                            </a>
                            <a href="#/register" className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                                Register
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

const TubiLogo = () => (
    <svg width="70" height="28" viewBox="0 0 94 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.1818 0V11.2308H6.09091V0H0V26.7692H6.09091V15.5385H12.1818V26.7692H18.2727V0H12.1818ZM38.6364 0V26.7692H44.7273V11.2308H50.8182V26.7692H56.9091V11.2308H63V26.7692H69.0909V0H38.6364ZM75.1818 0V26.7692H81.2727V0H75.1818ZM32.5455 0H22.3182C22.3182 11.2308 26.8636 15.5385 32.5455 26.7692V0Z" fill="white"/>
        <path d="M87 0C83.6863 0 81 2.68629 81 6V32C81 35.3137 83.6863 38 87 38C90.3137 38 93 35.3137 93 32V6C93 2.68629 90.3137 0 87 0ZM87 26.2C85.2327 26.2 83.8 24.7673 83.8 23V15C83.8 13.2327 85.2327 11.8 87 11.8C88.7673 11.8 90.2 13.2327 90.2 15V23C90.2 24.7673 88.7673 26.2 87 26.2Z" fill="#F4242E"/>
    </svg>
);


const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-tubi-light-gray"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

const UserIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        viewBox="0 0 20 20" 
        fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export default Header;