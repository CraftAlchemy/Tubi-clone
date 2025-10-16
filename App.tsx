
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import MovieDetail from './components/MovieDetail';
import VideoPlayer from './components/VideoPlayer';
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
    const [route, setRoute] = useState(window.location.hash || '#/');
    
    // Data state
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('myflix-users');
        return saved ? JSON.parse(saved) : USERS;
    });
    const [categories, setCategories] = useState<Category[]>(CATEGORIES);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(CARTOON_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(() => {
        const saved = localStorage.getItem('myflix-tokenpacks');
        return saved ? JSON.parse(saved) : TOKEN_PACKS;
    });
    const [siteName, setSiteName] = useState(() => localStorage.getItem('myflix-sitename') || 'Myflix');
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(() => {
        const saved = localStorage.getItem('myflix-cartoon-enabled');
        return saved ? JSON.parse(saved) : true;
    });

    // User state
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('myflix-currentUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [myList, setMyList] = useState<number[]>(() => {
        if(currentUser) {
            const saved = localStorage.getItem(`myflix-myList-${currentUser.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Modal/Player state
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | Advertisement | null>(null);
    const [tokenPrompt, setTokenPrompt] = useState<{ title: string; tokenCost: number; } | null>(null);
    const [isBuyTokensModalOpen, setIsBuyTokensModalOpen] = useState(false);


    // Effects
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        localStorage.setItem('myflix-currentUser', JSON.stringify(currentUser));
        if (currentUser) {
            const userInDb = users.find(u => u.id === currentUser.id);
            if (userInDb && userInDb.tokens !== currentUser.tokens) {
                 const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
                 setUsers(updatedUsers);
            }
            const savedList = localStorage.getItem(`myflix-myList-${currentUser.id}`);
            setMyList(savedList ? JSON.parse(savedList) : []);
        } else {
            setMyList([]);
        }
    }, [currentUser]);

    useEffect(() => {
        if(currentUser) {
            localStorage.setItem(`myflix-myList-${currentUser.id}`, JSON.stringify(myList));
        }
    }, [myList, currentUser]);

    useEffect(() => {
        localStorage.setItem('myflix-users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('myflix-sitename', siteName);
    }, [siteName]);

    useEffect(() => {
        localStorage.setItem('myflix-tokenpacks', JSON.stringify(tokenPacks));
    }, [tokenPacks]);

    useEffect(() => {
        localStorage.setItem('myflix-cartoon-enabled', JSON.stringify(isCartoonSectionEnabled));
    }, [isCartoonSectionEnabled]);

    // Handlers
    const handleLogin = (email: string, password: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
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
            tokens: 10, // Welcome bonus
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        window.location.hash = '/';
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        window.location.hash = '/login';
    };

    const handleToggleMyList = (movieId: number) => {
        if (!currentUser) return;
        setMyList(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
    };

    const handlePlay = (content: Movie | Episode) => {
        if (!currentUser) {
            window.location.hash = '/login';
            return;
        }
        
        const tokenCost = content.tokenCost;

        if (tokenCost && tokenCost > 0) {
            if (currentUser.tokens < tokenCost) {
                setTokenPrompt({ title: content.title, tokenCost });
                return;
            }
            setCurrentUser(prev => prev ? { ...prev, tokens: prev.tokens - tokenCost } : null);
        }
        setPlayingContent(content);
        setSelectedMovie(null);
        setSelectedSeries(null);
    };

    const handlePlayAd = (ad: Advertisement) => {
        setPlayingContent(ad);
    };

    const handleAdFinished = (ad: Advertisement) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, tokens: currentUser.tokens + ad.tokenReward });
        }
    };
    
    const handlePurchase = (pack: TokenPack) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, tokens: currentUser.tokens + pack.amount });
            setIsBuyTokensModalOpen(false);
            // In a real app, you would handle payment processing here.
            alert(`Purchase successful! You've received ${pack.amount} tokens.`);
        }
    };

    const handleAdminUpdate = (updatedData: any) => {
        if(updatedData.users) setUsers(updatedData.users);
        if(updatedData.categories) setCategories(updatedData.categories);
        if(updatedData.seriesCategories) setSeriesCategories(updatedData.seriesCategories);
        if(updatedData.cartoonCategories) setCartoonCategories(updatedData.cartoonCategories);
        if(updatedData.liveTVChannels) setLiveTVChannels(updatedData.liveTVChannels);
        if(updatedData.advertisements) setAdvertisements(updatedData.advertisements);
        if(updatedData.tokenPacks) setTokenPacks(updatedData.tokenPacks);
        if(updatedData.siteName) setSiteName(updatedData.siteName);
        if(updatedData.isCartoonSectionEnabled !== undefined) setIsCartoonSectionEnabled(updatedData.isCartoonSectionEnabled);
    };
    
    const renderPage = () => {
        if (route.startsWith('#/admin')) {
             if (!currentUser || currentUser.role !== 'admin') {
                return <div className="pt-20 text-center"><h1>Access Denied</h1></div>;
            }
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
        
        // Wrap content pages with Header and Footer
        const PageWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
            <>
                <Header siteName={siteName} currentUser={currentUser} onLogout={handleLogout} onBuyTokensClick={() => setIsBuyTokensModalOpen(true)} isCartoonSectionEnabled={isCartoonSectionEnabled} />
                {children}
                <Footer siteName={siteName} />
            </>
        );

        switch (route) {
            case '#/login':
                return <PageWrapper><LoginPage onLogin={handleLogin} /></PageWrapper>;
            case '#/register':
                return <PageWrapper><RegisterPage onRegister={handleRegister} /></PageWrapper>;
            case '#/profile':
                return currentUser ? <PageWrapper><ProfilePage user={currentUser} onLogout={handleLogout} categories={categories} myList={myList} onMovieClick={setSelectedMovie} onToggleMyList={handleToggleMyList} /></PageWrapper> : <PageWrapper><LoginPage onLogin={handleLogin} /></PageWrapper>;
            case '#/series':
                return <PageWrapper><SeriesPage seriesCategories={seriesCategories} onSeriesClick={setSelectedSeries} isLoading={isLoading}/></PageWrapper>;
            case '#/cartoon':
                return isCartoonSectionEnabled ? <PageWrapper><CartoonPage categories={cartoonCategories} onMovieClick={setSelectedMovie} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} isLoading={isLoading}/></PageWrapper> : <div className="pt-20 text-center"><h1>Not Found</h1></div>;
            case '#/livetv':
                return <PageWrapper><LiveTVPage channels={liveTVChannels} /></PageWrapper>;
            case '#/earn-tokens':
                return <PageWrapper><EarnTokensPage user={currentUser} onTokensEarned={() => {}} advertisements={advertisements} onPlayAd={handlePlayAd} onBuyTokensClick={() => setIsBuyTokensModalOpen(true)}/></PageWrapper>;
            case '#/faq':
                 return <PageWrapper><FAQPage siteName={siteName} /></PageWrapper>;
            case '#/':
            default:
                return (
                     <PageWrapper>
                        <main>
                            <Hero 
                                movie={HERO_MOVIE} 
                                myList={myList}
                                onToggleMyList={handleToggleMyList}
                                currentUser={currentUser}
                                onPlay={handlePlay}
                                isLoading={isLoading}
                            />
                            <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
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
                        </main>
                    </PageWrapper>
                );
        }
    };

    return (
        <div className="bg-myflix-black text-white min-h-screen">
            {renderPage()}
            
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
                    onAdFinished={handleAdFinished}
                />
            )}

            {tokenPrompt && (
                <TokenPromptModal
                    content={tokenPrompt}
                    onClose={() => setTokenPrompt(null)}
                    onEarnTokens={() => {
                        setTokenPrompt(null);
                        window.location.hash = '/earn-tokens';
                    }}
                    onBuyTokens={() => {
                        setTokenPrompt(null);
                        setIsBuyTokensModalOpen(true);
                    }}
                />
            )}
            {isBuyTokensModalOpen && (
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