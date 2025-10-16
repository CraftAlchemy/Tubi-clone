
import React, { useState, useEffect, useCallback } from 'react';
import { USERS } from './data/users';
import { ADVERTISEMENTS } from './data/advertisements';
import { TOKEN_PACKS } from './data/tokenPacks';
import { MOVIES } from './data/movies';

import type { User, Movie, Category, SeriesCategory, Series, Episode, LiveTVChannel, Advertisement, TokenPack } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import MovieDetail from './components/MovieDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import VideoPlayer from './components/VideoPlayer';
import SeriesPage from './components/SeriesPage';
import SeriesDetail from './components/SeriesDetail';
import LiveTVPage from './components/LiveTVPage';
import CartoonPage from './components/CartoonPage';
import FAQPage from './components/FAQPage';
import EarnTokensPage from './components/EarnTokensPage';
import TokenPromptModal from './components/TokenPromptModal';
import BuyTokensModal from './components/BuyTokensModal';
import AdSessionManager from './components/AdSessionManager';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

// Skeletons
import HeroSkeleton from './components/skeletons/HeroSkeleton';
import CarouselSkeleton from './components/skeletons/CarouselSkeleton';

// Mock data for missing files
const MOCK_SERIES_CATEGORIES: SeriesCategory[] = [
    {
        title: 'Trending Series',
        series: [
            {
                id: 1, title: 'The Code', posterUrl: 'https://picsum.photos/400/600?random=1001', description: 'A thrilling series about hackers.', tokenCost: 5,
                seasons: [
                    {
                        id: 1, title: 'Season 1', episodes: [
                            { id: 1, title: 'E1: The Beginning', posterUrl: 'https://picsum.photos/400/225?random=1011', description: 'The journey starts.', videoUrl: 'https://www.youtube.com/watch?v=1s-piIAP_vY', duration: '45m' },
                            { id: 2, title: 'E2: The Challenge', posterUrl: 'https://picsum.photos/400/225?random=1012', description: 'A new foe appears.', videoUrl: 'https://www.youtube.com/watch?v=1s-piIAP_vY', duration: '48m', tokenCost: 1 },
                        ]
                    }
                ]
            },
            {
                id: 2, title: 'Starlight', posterUrl: 'https://picsum.photos/400/600?random=1002', description: 'Exploring the vast universe.',
                seasons: [
                    {
                        id: 2, title: 'Season 1', episodes: [
                            { id: 3, title: 'E1: First Contact', posterUrl: 'https://picsum.photos/400/225?random=1021', description: 'An alien race is discovered.', videoUrl: 'https://www.youtube.com/watch?v=1s-piIAP_vY', duration: '52m' },
                        ]
                    }
                ]
            }
        ]
    }
];
const MOCK_CARTOON_CATEGORIES: Category[] = [
    {
        title: 'For Kids',
        movies: Array.from({ length: 8 }, (_, i) => ({
            id: 2000 + i,
            title: `Funny Cartoon ${i + 1}`,
            posterUrl: `https://picsum.photos/400/600?random=${2000 + i}`,
            description: 'A fun cartoon for all ages.',
            videoUrl: 'https://www.youtube.com/watch?v=1s-piIAP_vY',
        }))
    },
    {
        title: 'Animated Adventures',
        movies: Array.from({ length: 6 }, (_, i) => ({
            id: 2100 + i,
            title: `Adventure Time ${i + 1}`,
            posterUrl: `https://picsum.photos/400/600?random=${2100 + i}`,
            description: 'An epic animated journey.',
            videoUrl: 'https://www.youtube.com/watch?v=1s-piIAP_vY',
            tokenCost: 1
        }))
    }
];
const MOCK_LIVE_TV_CHANNELS: LiveTVChannel[] = [
    { id: 1, name: 'News Today', logoUrl: 'https://picsum.photos/100/100?random=3001', streamUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1' },
    { id: 2, name: 'Sports Central', logoUrl: 'https://picsum.photos/100/100?random=3002', streamUrl: 'https://www.youtube.com/embed/p_kAINNSu3A?autoplay=1' },
    { id: 3, name: 'Music Hits', logoUrl: 'https://picsum.photos/100/100?random=3003', streamUrl: 'https://www.youtube.com/embed/DW_0_j3nS_c?autoplay=1' },
];

const useHashNavigation = () => {
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
        const handleHashChange = () => {
            setHash(window.location.hash);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return hash;
};

const App: React.FC = () => {
    // State
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [users, setUsers] = useState<User[]>(USERS);

    const [siteName, setSiteName] = useState('Myflix');
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);
    
    // Content State
    const [categories, setCategories] = useState<Category[]>([]);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(MOCK_SERIES_CATEGORIES);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(MOCK_CARTOON_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(MOCK_LIVE_TV_CHANNELS);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(TOKEN_PACKS);
    
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | null>(null);
    const [playingAd, setPlayingAd] = useState<Advertisement | null>(null);
    const [tokenPrompt, setTokenPrompt] = useState<{ title: string, tokenCost: number } | null>(null);
    const [isBuyTokensModalOpen, setIsBuyTokensModalOpen] = useState(false);
    
    const [myList, setMyList] = useState<number[]>(() => {
        const savedList = localStorage.getItem('myList');
        return savedList ? JSON.parse(savedList) : [];
    });
    
    const hash = useHashNavigation();
    
    // Effects
    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data
        setTimeout(() => {
            setCategories(MOVIES);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Update user in the main users list to persist token changes etc.
            setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? currentUser : u));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('myList', JSON.stringify(myList));
    }, [myList]);
    
    // Handlers
    const handleLogin = (email: string, password: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            window.location.hash = '#/';
            return true;
        }
        return false;
    };

    const handleRegister = (email: string, password: string): boolean => {
        if (users.some(u => u.email === email)) {
            return false;
        }
        const newUser: User = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            email,
            password,
            role: 'user',
            tokens: 10, // Welcome bonus
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        window.location.hash = '#/';
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        window.location.hash = '#/login';
    };

    const handleToggleMyList = (movieId: number) => {
        setMyList(prevList =>
            prevList.includes(movieId)
                ? prevList.filter(id => id !== movieId)
                : [...prevList, movieId]
        );
    };
    
    const handlePlay = (content: Movie | Episode) => {
        if (!currentUser) {
            window.location.hash = '#/login';
            return;
        }

        const cost = content.tokenCost || 0;
        if (currentUser.tokens < cost) {
            setTokenPrompt({ title: content.title, tokenCost: cost });
            return;
        }
        
        if (cost > 0) {
            setCurrentUser(prevUser => prevUser ? { ...prevUser, tokens: prevUser.tokens - cost } : null);
        }

        setPlayingContent(content);
        setSelectedMovie(null);
        setSelectedSeries(null);
    };
    
    const handleAdminUpdate = (updatedData: any) => {
        if (updatedData.users) setUsers(updatedData.users);
        if (updatedData.categories) setCategories(updatedData.categories);
        if (updatedData.seriesCategories) setSeriesCategories(updatedData.seriesCategories);
        if (updatedData.cartoonCategories) setCartoonCategories(updatedData.cartoonCategories);
        if (updatedData.liveTVChannels) setLiveTVChannels(updatedData.liveTVChannels);
        if (updatedData.advertisements) setAdvertisements(updatedData.advertisements);
        if (updatedData.tokenPacks) setTokenPacks(updatedData.tokenPacks);
        if (updatedData.siteName) setSiteName(updatedData.siteName);
        if (updatedData.isCartoonSectionEnabled !== undefined) setIsCartoonSectionEnabled(updatedData.isCartoonSectionEnabled);
    };

    const handleTokensEarned = useCallback((amount: number) => {
        setCurrentUser(prevUser => prevUser ? { ...prevUser, tokens: prevUser.tokens + amount } : null);
        setPlayingAd(null);
    }, []);

    const handlePurchase = (pack: TokenPack) => {
        setCurrentUser(prevUser => prevUser ? { ...prevUser, tokens: prevUser.tokens + pack.amount } : null);
        setIsBuyTokensModalOpen(false);
        // In a real app, you would process payment here
        alert(`Successfully purchased ${pack.amount} tokens!`);
    };

    // Routing
    const renderPage = () => {
        const route = hash.split('?')[0];
        
        if (route.startsWith('#/admin')) {
            if (currentUser?.role === 'admin') {
                return (
                    <AdminDashboard 
                        currentUser={currentUser}
                        siteName={siteName}
                        users={users}
                        categories={categories}
                        seriesCategories={seriesCategories}
                        cartoonCategories={cartoonCategories}
                        liveTVChannels={liveTVChannels}
                        advertisements={advertisements}
                        tokenPacks={tokenPacks}
                        isCartoonSectionEnabled={isCartoonSectionEnabled}
                        onUpdate={handleAdminUpdate}
                    />
                );
            }
             window.location.hash = '#/';
             return <HomePage />;
        }

        switch (route) {
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                if (currentUser) {
                    return <ProfilePage user={currentUser} onLogout={handleLogout} categories={categories} myList={myList} onMovieClick={setSelectedMovie} onToggleMyList={handleToggleMyList}/>;
                }
                window.location.hash = '#/login';
                return <LoginPage onLogin={handleLogin} />;
            case '#/series':
                return <SeriesPage seriesCategories={seriesCategories} onSeriesClick={setSelectedSeries} isLoading={isLoading} />;
            case '#/cartoon':
                return <CartoonPage categories={cartoonCategories} onMovieClick={setSelectedMovie} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} isLoading={isLoading} />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
            case '#/faq':
                return <FAQPage siteName={siteName} />;
            case '#/earn-tokens':
                return <EarnTokensPage user={currentUser} onTokensEarned={handleTokensEarned} advertisements={advertisements} onPlayAd={setPlayingAd} onBuyTokensClick={() => setIsBuyTokensModalOpen(true)} />;
            case '#/':
            case '':
            default:
                return <HomePage />;
        }
    };

    const HomePage = () => (
        <>
            <Hero
                movie={categories[0]?.movies[0]}
                myList={myList}
                onToggleMyList={handleToggleMyList}
                currentUser={currentUser}
                onPlay={handlePlay}
                isLoading={isLoading}
            />
            <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-8 space-y-12">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => <CarouselSkeleton key={index} />)
                ) : (
                    categories.map((category) => (
                        <Carousel 
                            key={category.title} 
                            title={category.title} 
                            movies={category.movies}
                            onMovieClick={setSelectedMovie}
                            myList={myList}
                            onToggleMyList={handleToggleMyList}
                            currentUser={currentUser}
                        />
                    ))
                )}
            </div>
        </>
    );

    const isAdminRoute = hash.startsWith('#/admin');

    return (
        <div className={`bg-myflix-black text-white min-h-screen flex flex-col ${isAdminRoute ? 'bg-admin-bg' : ''}`}>
            {!isAdminRoute && (
                <Header 
                    siteName={siteName} 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                    onBuyTokensClick={() => setIsBuyTokensModalOpen(true)}
                    isCartoonSectionEnabled={isCartoonSectionEnabled}
                />
            )}
            
            <main className="flex-grow">
                {renderPage()}
            </main>

            {!isAdminRoute && <Footer siteName={siteName} />}
            
            {/* Modals */}
            {selectedMovie && (
                <MovieDetail 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    myList={myList}
                    onToggleMyList={handleToggleMyList}
                    onPlay={handlePlay}
                    currentUser={currentUser}
                />
            )}
            {selectedSeries && (
                <SeriesDetail
                    series={selectedSeries}
                    onClose={() => setSelectedSeries(null)}
                    onPlayEpisode={handlePlay}
                    currentUser={currentUser}
                />
            )}
            {playingContent && (
                <VideoPlayer 
                    content={playingContent}
                    onClose={() => setPlayingContent(null)}
                />
            )}
            {playingAd && (
                <AdSessionManager 
                    advertisement={playingAd}
                    onClose={() => setPlayingAd(null)}
                    onTokensEarned={handleTokensEarned}
                />
            )}
            {tokenPrompt && (
                <TokenPromptModal
                    content={tokenPrompt}
                    onClose={() => setTokenPrompt(null)}
                    onEarnTokens={() => { setTokenPrompt(null); window.location.hash = '#/earn-tokens'; }}
                    onBuyTokens={() => { setTokenPrompt(null); setIsBuyTokensModalOpen(true); }}
                />
            )}
            {isBuyTokensModalOpen && currentUser && (
                <BuyTokensModal
                    onClose={() => setIsBuyTokensModalOpen(false)}
                    onPurchase={handlePurchase}
                    tokenPacks={tokenPacks}
                />
            )}
        </div>
    );
};

export default App;
