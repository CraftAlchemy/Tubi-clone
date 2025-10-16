

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import MovieDetail from './components/MovieDetail';
import VideoPlayer from './components/VideoPlayer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import SeriesPage from './components/SeriesPage';
import SeriesDetail from './components/SeriesDetail';
import CartoonPage from './components/CartoonPage';
import LiveTVPage from './components/LiveTVPage';
import FAQPage from './components/FAQPage';
import EarnTokensPage from './components/EarnTokensPage';
import TokenPromptModal from './components/TokenPromptModal';
import BuyTokensModal from './components/BuyTokensModal';
import Footer from './components/Footer';
import HeroSkeleton from './components/skeletons/HeroSkeleton';
import CarouselSkeleton from './components/skeletons/CarouselSkeleton';

import { HERO_MOVIE, CATEGORIES, SERIES_CATEGORIES, CARTOON_CATEGORIES, LIVE_TV_CHANNELS } from './data/movies';
import { USERS } from './data/users';
// FIX: Import SeriesCategory and LiveTVChannel types.
import type { User, Movie, Category, Episode, Series, Advertisement, TokenPack, SeriesCategory, LiveTVChannel } from './types';
import { TOKEN_PACKS } from './data/tokenPacks';
import { ADVERTISEMENTS } from './data/advertisements';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [siteName, setSiteName] = useState('Myflix');
    const [myList, setMyList] = useState<number[]>([]);
    
    const [selectedContent, setSelectedContent] = useState<Movie | Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | Advertisement | null>(null);
    
    const [showTokenPrompt, setShowTokenPrompt] = useState<Movie | null>(null);
    const [showBuyTokens, setShowBuyTokens] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

    // --- Admin state (using local data for now) ---
    const [users, setUsers] = useState<User[]>(USERS);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(TOKEN_PACKS);
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);

    // --- Data Fetching and State Initialization ---
    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                // Fetch site config
                const configRes = await fetch(`${API_BASE_URL}/config`);
                if (configRes.ok) {
                    const configData = await configRes.json();
                    setSiteName(configData.siteName || 'Myflix');
                } else {
                     throw new Error('Failed to fetch config');
                }

                // Fetch movie/category content
                const contentRes = await fetch(`${API_BASE_URL}/content`);
                 if (contentRes.ok) {
                    const contentData = await contentRes.json();
                    setCategories(contentData);
                } else {
                    throw new Error('Failed to fetch content');
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                console.log("Could not connect to the backend server. This is expected if the server is not running. Falling back to local mock data. To run the server, use 'npm start' in the project root.");
                 // Fallback to local data if API fails
                setSiteName('Myflix');
                setCategories(CATEGORIES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();

        // Load user from local storage
        const storedUser = localStorage.getItem('myflix-user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Sync with main users list to get latest info (like tokens)
            const syncedUser = users.find(u => u.id === parsedUser.id);
            setCurrentUser(syncedUser || parsedUser);
        }
         const storedList = localStorage.getItem('myflix-list');
        if (storedList) {
            setMyList(JSON.parse(storedList));
        }

    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash || '#/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    // --- User and List Persistence ---
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('myflix-user', JSON.stringify(currentUser));
             // Also update the main users array
            setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? currentUser : u));
        } else {
            localStorage.removeItem('myflix-user');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('myflix-list', JSON.stringify(myList));
    }, [myList]);

    // --- Handlers ---
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
            id: (users.length > 0 ? Math.max(...users.map(u => u.id)) : 0) + 1,
            email,
            password,
            role: 'user',
            tokens: 10, // Starting tokens
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        window.location.hash = '#/';
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setMyList([]);
        window.location.hash = '#/login';
    };

    const handleToggleMyList = (contentId: number) => {
        setMyList(prevList =>
            prevList.includes(contentId)
                ? prevList.filter(id => id !== contentId)
                : [...prevList, contentId]
        );
    };

    const handlePlay = (content: Movie | Episode) => {
         if ('tokenCost' in content && content.tokenCost) {
            if (!currentUser || currentUser.tokens < content.tokenCost) {
                setShowTokenPrompt(content as Movie);
                return;
            }
            setCurrentUser(prevUser => prevUser ? { ...prevUser, tokens: prevUser.tokens - (content.tokenCost || 0) } : null);
        }
        setPlayingContent(content);
        setSelectedContent(null);
    };

    const handleTokensEarned = (amount: number) => {
        setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens + amount } : null);
    };

    const handleTokenPurchase = (pack: TokenPack) => {
        setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens + pack.amount } : null);
        setShowBuyTokens(false);
    };
    
    const handleContentUpdate = async (updatedCategories: Category[]) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCategories),
            });
            if (!response.ok) throw new Error('Failed to update content');
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Error updating content:", error);
            alert("Failed to save content changes.");
        }
    };

    const handleSiteNameUpdate = async (newName: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ siteName: newName }),
            });
            if (!response.ok) throw new Error('Failed to update site name');
            setSiteName(newName);
        } catch (error) {
             console.error("Error updating site name:", error);
             alert("Failed to save site name.");
             throw error; // re-throw for the component to handle
        }
    };
    
    const closeAllModals = useCallback(() => {
        setSelectedContent(null);
        setPlayingContent(null);
        setShowTokenPrompt(null);
        setShowBuyTokens(false);
    }, []);

    // --- Render Logic ---

    const renderPage = () => {
        if (currentPath.startsWith('#/admin')) {
            if (currentUser?.role === 'admin') {
                return (
                    <AdminDashboard 
                        siteName={siteName} 
                        categories={categories} 
                        onContentUpdate={handleContentUpdate} 
                        onSiteNameUpdate={handleSiteNameUpdate}
                        // Pass admin state and handlers
                        users={users}
                        onUsersUpdate={setUsers}
                        seriesCategories={seriesCategories}
                        onSeriesCategoriesUpdate={setSeriesCategories}
                        liveTVChannels={liveTVChannels}
                        onLiveTVChannelsUpdate={setLiveTVChannels}
                        advertisements={advertisements}
                        onAdvertisementsUpdate={setAdvertisements}
                        tokenPacks={tokenPacks}
                        onTokenPacksUpdate={setTokenPacks}
                        isCartoonSectionEnabled={isCartoonSectionEnabled}
                        onCartoonSectionToggle={setIsCartoonSectionEnabled}
                    />
                );
            } else {
                // Redirect to home if not admin
                window.location.hash = '#/';
                return null;
            }
        }

        switch (currentPath) {
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                return currentUser ? <ProfilePage user={currentUser} onLogout={handleLogout} categories={categories} myList={myList} onMovieClick={(movie) => setSelectedContent(movie)} onToggleMyList={handleToggleMyList} /> : <LoginPage onLogin={handleLogin} />;
            case '#/series':
                return <SeriesPage seriesCategories={seriesCategories} onSeriesClick={(series) => setSelectedContent(series)} isLoading={isLoading} />;
            case '#/cartoon':
                 if (!isCartoonSectionEnabled) {
                    window.location.hash = '#/';
                    return null;
                }
                return <CartoonPage categories={CARTOON_CATEGORIES} onMovieClick={(movie) => setSelectedContent(movie)} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} isLoading={isLoading} />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
            case '#/faq':
                return <FAQPage siteName={siteName} />;
             case '#/earn-tokens':
                return <EarnTokensPage user={currentUser} onTokensEarned={handleTokensEarned} onBuyTokensClick={() => setShowBuyTokens(true)} advertisements={advertisements} onPlayAd={(ad) => setPlayingContent(ad)} />;
            case '#/':
            default:
                return (
                    <>
                        <Hero 
                            movie={HERO_MOVIE} 
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
                                        onMovieClick={(movie) => setSelectedContent(movie)}
                                        myList={myList}
                                        onToggleMyList={handleToggleMyList}
                                        currentUser={currentUser}
                                    />
                                ))
                            )}
                        </div>
                    </>
                );
        }
    };

    const isFullPage = ['#/login', '#/register'].includes(currentPath) || currentPath.startsWith('#/admin');

    return (
        <div className="bg-myflix-black min-h-screen text-white flex flex-col">
            {!isFullPage && <Header siteName={siteName} currentUser={currentUser} onLogout={handleLogout} onBuyTokensClick={() => setShowBuyTokens(true)} isCartoonSectionEnabled={isCartoonSectionEnabled}/>}
            <main className="flex-grow pt-16 md:pt-20">
                 {renderPage()}
            </main>
            {!isFullPage && <Footer siteName={siteName} />}
            
            {/* Modals */}
            {selectedContent && 'seasons' in selectedContent ? (
                <SeriesDetail series={selectedContent} onClose={() => setSelectedContent(null)} onPlayEpisode={handlePlay} />
            ) : selectedContent && 'posterUrl' in selectedContent ? (
                 <MovieDetail movie={selectedContent as Movie} onClose={() => setSelectedContent(null)} myList={myList} onToggleMyList={handleToggleMyList} onPlay={handlePlay} currentUser={currentUser} />
            ): null}
            
            {playingContent && <VideoPlayer content={playingContent} onClose={() => setPlayingContent(null)} onAdFinished={(ad) => handleTokensEarned(ad.tokenReward)} />}
            
            {showTokenPrompt && (
                <TokenPromptModal 
                    movie={showTokenPrompt} 
                    onClose={() => setShowTokenPrompt(null)}
                    onEarnTokens={() => { closeAllModals(); window.location.hash = '#/earn-tokens'; }}
                    onBuyTokens={() => { setShowTokenPrompt(null); setShowBuyTokens(true); }}
                />
            )}

            {showBuyTokens && (
                <BuyTokensModal
                    tokenPacks={tokenPacks}
                    onClose={() => setShowBuyTokens(false)}
                    onPurchase={handleTokenPurchase}
                />
            )}
        </div>
    );
};

export default App;