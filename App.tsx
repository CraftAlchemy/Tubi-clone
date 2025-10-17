

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import MovieDetail from './components/MovieDetail';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
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
import AdSessionManager from './components/AdSessionManager';
import TokenPromptModal from './components/TokenPromptModal';
import BuyTokensModal from './components/BuyTokensModal';
import ErrorBoundary from './components/ErrorBoundary';

import HeroSkeleton from './components/skeletons/HeroSkeleton';
import CarouselSkeleton from './components/skeletons/CarouselSkeleton';

import { USERS } from './data/users';
import { MOVIE_CATEGORIES } from './data/movies';
import { SERIES_CATEGORIES } from './data/series';
import { LIVE_TV_CHANNELS } from './data/livetv';
import { CARTOON_CATEGORIES } from './data/cartoons';
import { ADVERTISEMENTS } from './data/advertisements';
import { TOKEN_PACKS } from './data/tokenPacks';

import type { User, Category, Movie, Episode, Series as SeriesType, SeriesCategory, LiveTVChannel, Advertisement, TokenPack } from './types';

const API_BASE_URL = '';

const App: React.FC = () => {
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [siteName, setSiteName] = useState('Myflix');
    const [movieCategories, setMovieCategories] = useState<Category[]>([]);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(CARTOON_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(TOKEN_PACKS);

    const [users, setUsers] = useState<User[]>(USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('myflix-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<SeriesType | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | null>(null);
    const [playingAd, setPlayingAd] = useState<Advertisement | null>(null);
    const [myList, setMyList] = useState<number[]>(() => {
        const storedList = localStorage.getItem(`myflix-list-${currentUser?.id}`);
        return storedList ? JSON.parse(storedList) : [];
    });

    const [showTokenPrompt, setShowTokenPrompt] = useState<{ content: Movie | Episode, needed: number } | null>(null);
    const [showBuyTokens, setShowBuyTokens] = useState(false);
    
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);

    const [route, setRoute] = useState(window.location.hash || '#/');

    // Effects
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('myflix-user', JSON.stringify(currentUser));
            const storedList = localStorage.getItem(`myflix-list-${currentUser.id}`);
            setMyList(storedList ? JSON.parse(storedList) : []);
        } else {
            localStorage.removeItem('myflix-user');
            setMyList([]);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`myflix-list-${currentUser.id}`, JSON.stringify(myList));
        }
    }, [myList, currentUser]);
    
    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const configRes = await fetch(`${API_BASE_URL}/api/config`);
                 if (!configRes.ok) throw new Error(`Config fetch failed with status ${configRes.status}`);
                const configData = await configRes.json();
                setSiteName(configData.siteName || 'Myflix');
                setIsCartoonSectionEnabled(configData.isCartoonSectionEnabled !== undefined ? configData.isCartoonSectionEnabled : true);

                const contentRes = await fetch(`${API_BASE_URL}/api/content`);
                if (!contentRes.ok) throw new Error(`Content fetch failed with status ${contentRes.status}`);
                const contentData = await contentRes.json();
                setMovieCategories(contentData);

            } catch (error) {
                console.error("Failed to fetch initial data from server:", error);
                console.warn("Falling back to local mock data. Is the backend server running? Start it with 'npm start' in the project root.");
                setSiteName('Myflix (Offline)');
                setMovieCategories(MOVIE_CATEGORIES);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

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
        setMyList(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
    };

    const handlePlay = (content: Movie | Episode) => {
        if (!currentUser) {
            window.location.hash = '#/login';
            return;
        }
        
        const tokenCost = content.tokenCost || 0;
        if (currentUser.tokens < tokenCost) {
            setShowTokenPrompt({ content, needed: tokenCost });
            return;
        }

        if (tokenCost > 0) {
            setCurrentUser(prev => prev ? ({ ...prev, tokens: prev.tokens - tokenCost }) : null);
        }
        
        setPlayingContent(content);
        setSelectedMovie(null);
        setSelectedSeries(null);
    };

    const handleTokensEarned = (amount: number) => {
        setCurrentUser(prev => prev ? ({ ...prev, tokens: prev.tokens + amount }) : null);
        setPlayingAd(null);
    };

    const handlePurchaseTokens = (pack: TokenPack) => {
        setCurrentUser(prev => prev ? ({ ...prev, tokens: prev.tokens + pack.amount }) : null);
        setShowBuyTokens(false);
        // In a real app, this would involve a payment gateway.
        alert(`Successfully purchased ${pack.amount} tokens!`);
    };
    
    const persistData = async (endpoint: string, data: any) => {
        try {
            await fetch(`${API_BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error(`Failed to update ${endpoint}:`, error);
        }
    };

    const handleMovieCategoriesUpdate = (data: Category[]) => {
        setMovieCategories(data);
        persistData('content', data);
    };

    const handleSiteNameUpdate = (name: string) => {
        setSiteName(name);
        persistData('config', { siteName: name, isCartoonSectionEnabled });
    };

    const handleCartoonToggle = (enabled: boolean) => {
        setIsCartoonSectionEnabled(enabled);
        persistData('config', { siteName, isCartoonSectionEnabled: enabled });
    };

    // Render Logic
    const renderPage = () => {
        if (route.startsWith('#/admin')) {
            if (currentUser?.role === 'admin') {
                return <AdminDashboard 
                    users={users}
                    onUsersUpdate={setUsers}
                    movieCategories={movieCategories}
                    onMovieCategoriesUpdate={handleMovieCategoriesUpdate}
                    seriesCategories={seriesCategories}
                    onSeriesCategoriesUpdate={setSeriesCategories}
                    cartoonCategories={cartoonCategories}
                    onCartoonCategoriesUpdate={setCartoonCategories}
                    liveTVChannels={liveTVChannels}
                    onLiveTVChannelsUpdate={setLiveTVChannels}
                    advertisements={advertisements}
                    onAdvertisementsUpdate={setAdvertisements}
                    tokenPacks={tokenPacks}
                    onTokenPacksUpdate={setTokenPacks}
                    siteName={siteName}
                    onSiteNameUpdate={handleSiteNameUpdate}
                    isCartoonSectionEnabled={isCartoonSectionEnabled}
                    onCartoonSectionToggle={handleCartoonToggle}
                />;
            }
            // Redirect non-admins
            window.location.hash = '#/';
            return null;
        }
        
        switch (route) {
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                return currentUser ? <ProfilePage user={currentUser} onLogout={handleLogout} categories={movieCategories} myList={myList} onMovieClick={setSelectedMovie} onToggleMyList={handleToggleMyList} /> : <LoginPage onLogin={handleLogin} />;
            case '#/series':
                return <SeriesPage seriesCategories={seriesCategories} onSeriesClick={setSelectedSeries} isLoading={isLoading} />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
            case '#/cartoon':
                return isCartoonSectionEnabled ? <CartoonPage categories={cartoonCategories} onMovieClick={setSelectedMovie} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} isLoading={false} /> : null;
            case '#/faq':
                return <FAQPage siteName={siteName} />;
            case '#/earn-tokens':
                return <EarnTokensPage user={currentUser} onTokensEarned={handleTokensEarned} advertisements={advertisements} onPlayAd={setPlayingAd} onBuyTokensClick={() => setShowBuyTokens(true)} />;
            case '#/':
            default:
                const heroMovie = movieCategories[0]?.movies[0];
                return (
                    <>
                        {isLoading && !heroMovie ? <HeroSkeleton /> : heroMovie && <Hero movie={heroMovie} onPlay={handlePlay} onMoreInfo={setSelectedMovie} />}
                        <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
                            {isLoading && movieCategories.length === 0 ? (
                                Array.from({ length: 5 }).map((_, index) => <CarouselSkeleton key={index} />)
                            ) : (
                                movieCategories.map(category => (
                                    <ErrorBoundary key={category.title}>
                                        <Carousel
                                            title={category.title}
                                            movies={category.movies}
                                            onMovieClick={setSelectedMovie}
                                            myList={myList}
                                            onToggleMyList={handleToggleMyList}
                                            currentUser={currentUser}
                                        />
                                    </ErrorBoundary>
                                ))
                            )}
                        </div>
                    </>
                );
        }
    };
    
    const showHeaderFooter = !route.startsWith('#/admin');

    return (
        <div className="bg-myflix-black text-white min-h-screen flex flex-col">
            {showHeaderFooter && <Header siteName={siteName} currentUser={currentUser} onLogout={handleLogout} onBuyTokensClick={() => setShowBuyTokens(true)} isCartoonSectionEnabled={isCartoonSectionEnabled} />}
            <main className="flex-grow">
                {renderPage()}
            </main>
            {showHeaderFooter && <Footer siteName={siteName} />}
            
            {/* Modals and Overlays */}
            {selectedMovie && <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} myList={myList} onToggleMyList={handleToggleMyList} onPlay={handlePlay} currentUser={currentUser} />}
            {selectedSeries && <SeriesDetail series={selectedSeries} onClose={() => setSelectedSeries(null)} onPlayEpisode={handlePlay} currentUser={currentUser} />}
            {playingContent && <VideoPlayer content={playingContent} onClose={() => setPlayingContent(null)} />}
            {playingAd && <AdSessionManager advertisement={playingAd} onClose={() => setPlayingAd(null)} onTokensEarned={handleTokensEarned} />}
            {showTokenPrompt && (
                <TokenPromptModal
                    // FIX: The `content` prop for TokenPromptModal expects an object with a required `tokenCost`.
                    // We create an object that satisfies the prop type using `showTokenPrompt.needed` which contains the correct value.
                    content={{ title: showTokenPrompt.content.title, tokenCost: showTokenPrompt.needed }}
                    onClose={() => setShowTokenPrompt(null)}
                    onEarnTokens={() => {
                        setShowTokenPrompt(null);
                        window.location.hash = '#/earn-tokens';
                    }}
                    onBuyTokens={() => {
                        setShowTokenPrompt(null);
                        setShowBuyTokens(true);
                    }}
                />
            )}
            {showBuyTokens && (
                <BuyTokensModal
                    onClose={() => setShowBuyTokens(false)}
                    onPurchase={handlePurchaseTokens}
                    tokenPacks={tokenPacks}
                />
            )}
        </div>
    );
};

export default App;