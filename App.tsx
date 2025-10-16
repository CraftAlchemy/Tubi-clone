
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import MovieDetail from './components/MovieDetail';
import VideoPlayer from './components/VideoPlayer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import SeriesPage from './components/SeriesPage';
import SeriesDetail from './components/SeriesDetail';
import LiveTVPage from './components/LiveTVPage';
import CartoonPage from './components/CartoonPage';
import FAQPage from './components/FAQPage';
import EarnTokensPage from './components/EarnTokensPage';
import TokenPromptModal from './components/TokenPromptModal';
import BuyTokensModal from './components/BuyTokensModal';

import { HERO_MOVIE, CATEGORIES, SERIES_CATEGORIES, CARTOON_CATEGORIES, LIVE_TV_CHANNELS, generateMoreCategories } from './data/movies';
import { USERS } from './data/users';
import { ADVERTISEMENTS } from './data/advertisements';
import { TOKEN_PACKS } from './data/tokenPacks';

import type { User, Movie, Category, Series, Episode, LiveTVChannel, Advertisement, TokenPack, SeriesCategory } from './types';
import CarouselSkeleton from './components/skeletons/CarouselSkeleton';

const App: React.FC = () => {
    // Routing State
    const [route, setRoute] = useState(window.location.hash || '#/');

    // Data State
    const [siteName, setSiteName] = useState('Myflix');
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(CARTOON_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [users, setUsers] = useState<User[]>(USERS);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(TOKEN_PACKS);
    
    // Feature Toggles
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);

    // User and Interaction State
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('myflix-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [myList, setMyList] = useState<number[]>(() => {
        const storedList = localStorage.getItem(`myflix-myList-${currentUser?.id}`);
        return storedList ? JSON.parse(storedList) : [];
    });
    
    // Modal and Player State
    const [selectedContent, setSelectedContent] = useState<Movie | Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | Advertisement | null>(null);
    const [modal, setModal] = useState<'token-prompt' | 'buy-tokens' | null>(null);
    const [promptedMovie, setPromptedMovie] = useState<Movie | null>(null);

    // --- EFFECTS ---

    // Handle hash-based routing
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // In a real app, these would be API calls. Here we use mock data.
                // Simulating network delay
                await new Promise(res => setTimeout(res, 800));
                setCategories(CATEGORIES);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    // Sync `myList` with localStorage whenever it changes for the current user
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`myflix-myList-${currentUser.id}`, JSON.stringify(myList));
        }
    }, [myList, currentUser]);

    // Update user in localStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('myflix-user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('myflix-user');
        }
    }, [currentUser]);


    // --- HANDLERS ---

    const handleLogin = (email: string, password: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            // Load user-specific "My List"
            const storedList = localStorage.getItem(`myflix-myList-${user.id}`);
            setMyList(storedList ? JSON.parse(storedList) : []);
            window.location.hash = '/';
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
            tokens: 10, // Welcome gift
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setMyList([]);
        window.location.hash = '/';
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setMyList([]);
        window.location.hash = '/login';
    };

    const handleToggleMyList = (movieId: number) => {
        if (!currentUser) return;
        setMyList(prev => 
            prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
        );
    };
    
    const handlePlay = (content: Movie | Episode) => {
        const movie = 'tokenCost' in content ? content : null;
        if (movie && movie.tokenCost && currentUser && currentUser.tokens < movie.tokenCost) {
            setPromptedMovie(movie);
            setModal('token-prompt');
            return;
        }
        
        if (movie && movie.tokenCost && currentUser) {
            setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens - movie.tokenCost! } : null);
        }
        
        setPlayingContent(content);
        setSelectedContent(null);
    };

    const handleAdFinished = (ad: Advertisement) => {
        if (!currentUser) return;
        setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens + ad.tokenReward } : null);
    };

    const handlePurchase = (pack: TokenPack) => {
        if (!currentUser) return;
        setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens + pack.amount } : null);
        setModal(null);
        // In a real app, you would show a success message.
    };

    const handleAdminUpdate = (updatedData: {
        users?: User[],
        categories?: Category[],
        seriesCategories?: SeriesCategory[],
        cartoonCategories?: Category[],
        liveTVChannels?: LiveTVChannel[],
        advertisements?: Advertisement[],
        tokenPacks?: TokenPack[],
        siteName?: string,
        isCartoonSectionEnabled?: boolean,
    }) => {
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
    
    const onBuyTokensClick = () => {
        setModal('buy-tokens');
        setSelectedContent(null);
    };

    // --- RENDER LOGIC ---

    const renderPage = () => {
        const homePage = (
             <main>
                <Hero 
                    movie={HERO_MOVIE} 
                    myList={myList} 
                    onToggleMyList={handleToggleMyList}
                    currentUser={currentUser}
                    onPlay={handlePlay}
                    isLoading={isLoading}
                />
                <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12 -mt-16 md:-mt-24 relative z-20">
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
            </main>
        );

        if (route.startsWith('#/admin')) {
             if (!currentUser || currentUser.role !== 'admin') {
                return <div className="min-h-screen flex items-center justify-center pt-20">Access Denied</div>;
             }
            return <AdminDashboard 
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
                   />;
        }

        switch (route) {
            case '#/':
            case '#/home':
                return homePage;
            case '#/series':
                return <SeriesPage 
                    seriesCategories={seriesCategories} 
                    onSeriesClick={(series) => setSelectedContent(series)}
                    isLoading={isLoading}
                />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
             case '#/cartoon':
                return isCartoonSectionEnabled ? <CartoonPage 
                    categories={cartoonCategories}
                    onMovieClick={(movie) => setSelectedContent(movie)}
                    myList={myList}
                    onToggleMyList={handleToggleMyList}
                    currentUser={currentUser}
                    isLoading={isLoading}
                /> : homePage;
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                return currentUser ? <ProfilePage 
                    user={currentUser} 
                    onLogout={handleLogout} 
                    categories={categories}
                    myList={myList}
                    onMovieClick={(movie) => setSelectedContent(movie)}
                    onToggleMyList={handleToggleMyList}
                /> : <LoginPage onLogin={handleLogin} />;
            case '#/earn-tokens':
                return <EarnTokensPage 
                    user={currentUser}
                    onTokensEarned={() => {}} // handled by onAdFinished
                    advertisements={advertisements}
                    onPlayAd={(ad) => setPlayingContent(ad)}
                    onBuyTokensClick={onBuyTokensClick}
                />
            case '#/faq':
                return <FAQPage siteName={siteName} />;
            default:
                return homePage;
        }
    };

    return (
        <div className="bg-myflix-black text-white min-h-screen flex flex-col">
            {!route.startsWith('#/admin') && (
                <Header 
                    siteName={siteName} 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                    onBuyTokensClick={onBuyTokensClick}
                    isCartoonSectionEnabled={isCartoonSectionEnabled}
                />
            )}
            
            <div className="flex-grow">
                {renderPage()}
            </div>

            {!route.startsWith('#/admin') && <Footer siteName={siteName} />}

            {selectedContent && 'seasons' in selectedContent && (
                <SeriesDetail 
                    series={selectedContent} 
                    onClose={() => setSelectedContent(null)}
                    onPlayEpisode={handlePlay}
                />
            )}

            {selectedContent && 'tokenCost' in selectedContent && (
                <MovieDetail 
                    movie={selectedContent} 
                    onClose={() => setSelectedContent(null)}
                    myList={myList}
                    onToggleMyList={handleToggleMyList}
                    onPlay={handlePlay}
                    currentUser={currentUser}
                />
            )}
            
            {playingContent && (
                <VideoPlayer
                    content={playingContent}
                    onClose={() => setPlayingContent(null)}
                    onAdFinished={handleAdFinished}
                />
            )}

            {modal === 'token-prompt' && promptedMovie && (
                <TokenPromptModal 
                    movie={promptedMovie}
                    onClose={() => setModal(null)}
                    onEarnTokens={() => {
                        setModal(null);
                        window.location.hash = '/earn-tokens';
                    }}
                    onBuyTokens={() => {
                        setModal(null);
                        onBuyTokensClick();
                    }}
                />
            )}

            {modal === 'buy-tokens' && (
                <BuyTokensModal 
                    onClose={() => setModal(null)}
                    onPurchase={handlePurchase}
                    tokenPacks={tokenPacks}
                />
            )}
        </div>
    );
};

export default App;
