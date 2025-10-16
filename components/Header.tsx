
import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onSearch: (query: string) => void;
    route: string;
    siteName: string;
    isCartoonSectionEnabled: boolean;
}

const MobileMenu: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentUser: User | null;
    onLogout: () => void;
    onSearch: (query: string) => void;
    siteName: string;
    isCartoonSectionEnabled: boolean;
}> = ({ isOpen, onClose, currentUser, onLogout, onSearch, siteName, isCartoonSectionEnabled }) => {
    
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-myflix-black z-[100] p-4 flex flex-col animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-between flex-shrink-0">
                <a href="/#/" onClick={onClose} title="Go to homepage" aria-label={`${siteName} Homepage`}><MyflixLogo /></a>
                <button onClick={onClose} aria-label="Close menu" className="text-white">
                    <CloseIcon />
                </button>
            </div>
            
            <div className="mt-8 flex-grow overflow-y-auto">
                 <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-myflix-gray border-2 border-transparent focus:border-myflix-light-gray focus:ring-0 rounded-full pl-4 pr-10 py-2 w-full text-base text-white"
                        aria-label="Search for content"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>

                <nav className="flex flex-col space-y-4">
                     <a href="/#/" onClick={onClose} className="text-gray-200 text-lg hover:text-white p-2 rounded-md transition-colors">Browse</a>
                     <a href="#/series" onClick={onClose} className="text-gray-200 text-lg hover:text-white p-2 rounded-md transition-colors">Series</a>
                     <a href="#/livetv" onClick={onClose} className="text-gray-200 text-lg hover:text-white p-2 rounded-md transition-colors">Live TV</a>
                     {isCartoonSectionEnabled && <a href="#/cartoon" onClick={onClose} className="text-gray-200 text-lg hover:text-white p-2 rounded-md transition-colors">Cartoon</a>}
                </nav>
            </div>

            <div className="flex-shrink-0 py-4 border-t border-gray-800">
                {currentUser ? (
                     <div className="flex flex-col space-y-4">
                        <a href="#/profile" onClick={onClose} className="flex items-center text-lg font-semibold text-white p-2 rounded-md transition-colors">
                            <UserIcon />
                            <span className="ml-3">Profile</span>
                        </a>
                        <button onClick={() => { onLogout(); onClose(); }} className="w-full text-lg font-semibold bg-white text-black px-4 py-2.5 rounded-full hover:opacity-80 transition-opacity">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-4">
                        <a href="#/login" onClick={onClose} className="w-full text-center text-lg font-semibold border border-white px-4 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors">
                            Sign In
                        </a>
                        <a href="#/register" onClick={onClose} className="w-full text-center text-lg font-semibold bg-white text-black px-4 py-2.5 rounded-full hover:opacity-80 transition-opacity">
                            Register
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSearch, route, siteName, isCartoonSectionEnabled }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    };

    const NavLink: React.FC<{ href: string; label: string; ariaLabel: string }> = ({ href, label, ariaLabel }) => {
        // The default route is '/', represented by an empty hash or just '#/'
        const isBrowseActive = (href === "/#/" && (route === '' || route === '#/'));
        const isActive = isBrowseActive || route === href;

        const activeClasses = 'bg-myflix-gray text-white';
        const inactiveClasses = 'text-gray-300 hover:bg-myflix-gray hover:text-white';
        return (
            <a href={href} className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`} aria-label={ariaLabel}>
                {label}
            </a>
        );
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-myflix-black bg-opacity-95' : 'bg-transparent'}`}>
                <div className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-4">
                    <div className="flex items-center space-x-8">
                         <a href="/#/" title="Go to homepage" aria-label={`${siteName} Homepage`}><MyflixLogo /></a>
                        <nav className="hidden md:flex items-center space-x-2">
                           <NavLink href="/#/" label="Browse" ariaLabel="Browse all movies and TV shows" />
                           <NavLink href="#/series" label="Series" ariaLabel="Browse TV series" />
                           <NavLink href="#/livetv" label="Live TV" ariaLabel="Watch live TV channels" />
                           {isCartoonSectionEnabled && <NavLink href="#/cartoon" label="Cartoon" ariaLabel="Browse cartoon content" />}
                        </nav>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                         <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-myflix-gray border-2 border-transparent focus:border-myflix-light-gray focus:ring-0 rounded-full pl-4 pr-10 py-1.5 w-40 md:w-64 text-sm text-white transition-width duration-300"
                                aria-label="Search for content"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <SearchIcon />
                            </div>
                        </div>
                        {currentUser ? (
                             <>
                                <a href="#/profile" title="View your profile" aria-label="View your profile" className="hidden md:flex items-center text-sm font-semibold border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
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

                     {/* Mobile controls */}
                    <div className="flex md:hidden items-center">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-1" aria-label="Open menu">
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </header>
             <MobileMenu 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                currentUser={currentUser}
                onLogout={onLogout}
                onSearch={onSearch}
                siteName={siteName}
                isCartoonSectionEnabled={isCartoonSectionEnabled}
            />
        </>
    );
};

const MyflixLogo = () => (
    <span className="text-3xl font-black tracking-tighter text-myflix-red" style={{ fontFamily: 'system-ui, sans-serif' }}>
        MYFLIX
    </span>
);


const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-myflix-light-gray"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
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
        fill="currentColor"
        aria-hidden="true">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default Header;