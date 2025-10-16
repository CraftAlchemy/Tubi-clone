import React, { useState, useEffect } from 'react';
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
import AdSessionManager from './components/AdSessionManager';
import Footer from './components/Footer';

import CarouselSkeleton from './components/skeletons/CarouselSkeleton';
import HeroSkeleton from './components/skeletons/HeroSkeleton';

import { USERS } from './data/users';
import { CATEGORIES as INITIAL_CATEGORIES } from './data/movies';
import { SERIES_CATEGORIES } from './data/series';
import { LIVE_TV_CHANNELS } from './data/livetv';
import { CARTOON_CATEGORIES } from './data/cartoons';
import { ADVERTISEMENTS } from './data/advertisements';
import { TOKEN_PACKS as INITIAL_TOKEN_PACKS } from './data/tokenPacks';

import type { User, Movie, Category, Episode, Series, SeriesCategory, LiveTVChannel, Advertisement, TokenPack } from './types';

const API_BASE_URL = 'http://127.0.0.1:8080';

const App: React.FC = () => {
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [route, setRoute] = useState(window.location.hash);
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('myflix-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [users, setUsers] = useState<User[]>(() => {
        const storedUsers = localStorage.getItem('myflix-users');
        return storedUsers ? JSON.parse(storedUsers) : USERS;
    });
    const [myList, setMyList] = useState<number[]>(() => {
        const storedList = localStorage.getItem(`myflix-mylist-${currentUser?.id}`);
        return storedList ? JSON.parse(storedList) : [];
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(CARTOON_CATEGORIES);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(ADVERTISEMENTS);
    const [tokenPacks, setTokenPacks] = useState<TokenPack[]>(INITIAL_TOKEN_PACKS);

    const [siteName, setSiteName] = useState('Myflix');
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);
    
    // Modals and Players
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | null>(null);
    const [playingAd, setPlayingAd] = useState<Advertisement | null>(null);
    const [tokenPrompt, setTokenPrompt] = useState<{title: string, tokenCost: number} | null>(null);
    const [isBuyTokensModalOpen, setIsBuyTokensModalOpen] = useState(false);

    // Effects
    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
      Promise.all([
        fetch(`${API_BASE_URL}/api/content`).then(res => {
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            return res.json();
        }),
        fetch(`${API_BASE_URL}/api/config`).then(res => {
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            return res.json();
        })
      ]).then(([contentData, configData]) => {
        setCategories(contentData);
        setSiteName(configData.siteName || 'Myflix');
      }).catch(err => {
        console.error("Failed to fetch initial data from server:", err);
        console.log("This might be because the backend server is not running. Falling back to local mock data. Run 'npm start' in the project root to start the server.");
        setCategories(INITIAL_CATEGORIES);
      }).finally(() => {
        setIsLoading(false);
      });
    }, []);

    useEffect(() => {
        localStorage.setItem('myflix-users', JSON.stringify(users));
    }, [users]);
    
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('myflix-user', JSON.stringify(currentUser));
            const storedList = localStorage.getItem(`myflix-mylist-${currentUser?.id}`);
            setMyList(storedList ? JSON.parse(storedList) : []);
        } else {
            localStorage.removeItem('myflix-user');
            setMyList([]);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`myflix-mylist-${currentUser.id}`, JSON.stringify(myList));
        }
    }, [myList, currentUser]);

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

    const handleLogout = () => {
        setCurrentUser(null);
        window.location.hash = '/';
    };

    const handleRegister = (email: string, password: string): boolean => {
        if (users.find(u => u.email === email)) {
            return false;
        }
        const newUser: User = {
            id: Date.now(),
            email,
            password,
            role: 'user',
            tokens: 5,
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setCurrentUser(newUser);
        window.location.hash = '/';
        return true;
    };

    const handleToggleMyList = (movieId: number) => {
        if (!currentUser) return;
        setMyList(prev => 
            prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
        );
    };

    const handlePlay = (content: Movie | Episode) => {
        if (!currentUser) {
            window.location.hash = '/login';
            return;
        }
        const tokenCost = content.tokenCost || 0;
        if (currentUser.tokens >= tokenCost) {
            if (tokenCost > 0) {
                const updatedUser = { ...currentUser, tokens: currentUser.tokens - tokenCost };
                setCurrentUser(updatedUser);
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            }
            setPlayingContent(content);
            setSelectedMovie(null);
            setSelectedSeries(null);
        } else {
            setTokenPrompt({ title: content.title, tokenCost });
        }
    };
    
    const handleTokensEarned = (amount: number) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, tokens: currentUser.tokens + amount };
            setCurrentUser(updatedUser);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
        setPlayingAd(null);
    };

    const handleBuyTokens = (pack: TokenPack) => {
        alert(`You have purchased ${pack.amount} tokens for $${pack.price.toFixed(2)}! (This is a demo)`);
        if (currentUser) {
             const updatedUser = { ...currentUser, tokens: currentUser.tokens + pack.amount };
            setCurrentUser(updatedUser);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
        setIsBuyTokensModalOpen(false);
    };

    // Routing
    const renderPage = () => {
        const cleanRoute = route.split('?')[0];

        if (cleanRoute.startsWith('#/admin')) {
            if (currentUser?.role === 'admin') {
                return (
                    <AdminDashboard 
                        users={users}
                        onUsersUpdate={setUsers}
                        movieCategories={categories}
                        onMovieCategoriesUpdate={setCategories}
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
                        onSiteNameUpdate={setSiteName}
                        isCartoonSectionEnabled={isCartoonSectionEnabled}
                        onCartoonSectionToggle={setIsCartoonSectionEnabled}
                    />
                );
            } else {
                window.location.hash = '/'; // or a dedicated access denied page
                return null;
            }
        }

        switch (cleanRoute) {
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                if (!currentUser) {
                    window.location.hash = '/login';
                    return null;
                }
                return <ProfilePage 
                    user={currentUser} 
                    onLogout={handleLogout} 
                    categories={categories} 
                    myList={myList} 
                    onMovieClick={setSelectedMovie} 
                    onToggleMyList={handleToggleMyList} 
                />;
            case '#/series':
                return <SeriesPage seriesCategories={seriesCategories} onSeriesClick={setSelectedSeries} isLoading={isLoading} />;
            case '#/cartoon':
                return <CartoonPage categories={cartoonCategories} onMovieClick={setSelectedMovie} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} isLoading={isLoading} />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
            case '#/faq':
                return <FAQPage siteName={siteName} />;
            case '#/earn-tokens':
                return <EarnTokensPage user={currentUser} advertisements={advertisements} onPlayAd={setPlayingAd} onBuyTokensClick={() => setIsBuyTokensModalOpen(true)} onTokensEarned={handleTokensEarned} />;
            case '#/':
            case '':
            default:
                const heroMovie = categories[0]?.movies[0];
                return (
                    <>
                        {isLoading ? <HeroSkeleton /> : (heroMovie && <Hero movie={heroMovie} onPlay={handlePlay} onMoreInfo={setSelectedMovie} />)}
                        <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <CarouselSkeleton key={i} />)
                            ) : (
                                categories.map(category => (
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
        }
    };

    const isAdminRoute = route.startsWith('#/admin');

    return (
        <div className={`bg-myflix-black text-white min-h-screen flex flex-col ${isAdminRoute ? 'admin-view' : ''}`}>
            {!isAdminRoute && <Header siteName={siteName} currentUser={currentUser} onLogout={handleLogout} onBuyTokensClick={() => setIsBuyTokensModalOpen(true)} isCartoonSectionEnabled={isCartoonSectionEnabled} />}
            <main className="flex-grow">
                {renderPage()}
            </main>
            {!isAdminRoute && <Footer siteName={siteName} />}

            {/* Modals & Players */}
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
                <VideoPlayer content={playingContent} onClose={() => setPlayingContent(null)} />
            )}
            {playingAd && (
                <AdSessionManager advertisement={playingAd} onClose={() => setPlayingAd(null)} onTokensEarned={handleTokensEarned} />
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
            {isBuyTokensModalOpen && currentUser && (
                <BuyTokensModal 
                    onClose={() => setIsBuyTokensModalOpen(false)}
                    onPurchase={handleBuyTokens}
                    tokenPacks={tokenPacks}
                />
            )}
        </div>
    );
};

export default App;