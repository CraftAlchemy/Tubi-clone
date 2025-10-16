
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
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
import CarouselSkeleton from './components/skeletons/CarouselSkeleton';
import ErrorBoundary from './components/ErrorBoundary';
import { HERO_MOVIE, generateMoreCategories, CATEGORIES, SERIES_CATEGORIES, LIVE_TV_CHANNELS, CARTOON_CATEGORIES } from './data/movies';
import { USERS } from './data/users';
import type { User, Category, Movie, SeriesCategory, Series, Episode, LiveTVChannel } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(USERS);
    const [categories, setCategories] = useState<Category[]>(CATEGORIES);
    const [seriesCategories, setSeriesCategories] = useState<SeriesCategory[]>(SERIES_CATEGORIES);
    const [cartoonCategories, setCartoonCategories] = useState<Category[]>(CARTOON_CATEGORIES);
    const [liveTVChannels, setLiveTVChannels] = useState<LiveTVChannel[]>(LIVE_TV_CHANNELS);
    const [route, setRoute] = useState(window.location.hash);
    
    // State for modals/details
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [playingContent, setPlayingContent] = useState<Movie | Episode | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [myList, setMyList] = useState<number[]>([]);
    const [siteName, setSiteName] = useState('Myflix');
    const [isCartoonSectionEnabled, setIsCartoonSectionEnabled] = useState(true);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
            // Close any open modals on route change
            setSelectedMovie(null);
            setSelectedSeries(null);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    useEffect(() => {
        // Simulate initial data loading
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.title = siteName;
    }, [siteName]);

    const handleLogin = (email: string, password: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Fix: Use object destructuring to safely remove password and maintain type correctness.
            const { password: _password, ...userToStore } = user;
            setCurrentUser(userToStore);
            
            const storedList = localStorage.getItem(`my-list-${user.id}`);
            if (storedList) {
                // Fix: `JSON.parse` returns `any`. Explicitly cast to `number[]` to ensure type safety.
                setMyList(JSON.parse(storedList) as number[]);
            } else {
                setMyList([]);
            }

            window.location.hash = user.role === 'admin' ? '/admin' : '/';
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setMyList([]);
        window.location.hash = '/';
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
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        handleLogin(email, password);
        return true;
    };
    
    const handleContentUpdate = (updatedCategories: Category[]) => {
        setCategories(updatedCategories);
    };
    
    const handleSeriesContentUpdate = (updatedSeriesCategories: SeriesCategory[]) => {
        setSeriesCategories(updatedSeriesCategories);
    };

    const handleLiveTVChannelsUpdate = (updatedChannels: LiveTVChannel[]) => {
        setLiveTVChannels(updatedChannels);
    };

    const handleUsersUpdate = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
    };

    const handleSiteNameUpdate = (newName: string) => {
        if (newName.trim()) {
            setSiteName(newName.trim());
        }
    };

    const handleToggleCartoonSection = (isEnabled: boolean) => {
        setIsCartoonSectionEnabled(isEnabled);
    };

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setSelectedSeries(null);
    };
    
    const handleSeriesClick = (series: Series) => {
        setSelectedSeries(series);
        setSelectedMovie(null);
    };

    const handlePlayMovie = (movie: Movie) => {
        setPlayingContent(movie);
    };

    const handlePlayEpisode = (episode: Episode) => {
        setPlayingContent(episode);
    };

    const handleCloseDetail = () => {
        setSelectedMovie(null);
        setSelectedSeries(null);
    };
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleToggleMyList = (movieId: number) => {
        if (!currentUser) return;
        const isMovieInList = myList.includes(movieId);
        let updatedList: number[];
        if (isMovieInList) {
            updatedList = myList.filter(id => id !== movieId);
        } else {
            updatedList = [...myList, movieId];
        }
        setMyList(updatedList);
        localStorage.setItem(`my-list-${currentUser.id}`, JSON.stringify(updatedList));
    };

    const loadMoreCategories = useCallback(() => {
        if (isLoadingMore || route === '#/series' || route === '#/livetv') return;
        setIsLoadingMore(true);
        setTimeout(() => { 
            const newCategories = generateMoreCategories(page + 1);
            setCategories(prev => [...prev, ...newCategories]);
            setPage(prev => prev + 1);
            setIsLoadingMore(false);
        }, 500);
    }, [page, isLoadingMore, route]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500 || isLoadingMore) {
                return;
            }
            loadMoreCategories();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoadingMore, loadMoreCategories]);

    const allMovies = categories.flatMap(cat => cat.movies).concat(HERO_MOVIE);
    const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
    
    const myListMovies = myList
        .map(id => uniqueMovies.find(movie => movie.id === id))
        .filter((movie): movie is Movie => movie !== undefined);

    let categoriesToShow = searchQuery 
        ? categories.map(category => ({
            ...category,
            movies: category.movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
          })).filter(category => category.movies.length > 0)
        : [...categories];

    if (currentUser && myListMovies.length > 0 && !searchQuery) {
        const myListCategory: Category = {
            title: 'My List',
            movies: myListMovies
        };
        categoriesToShow.unshift(myListCategory);
    }

    const renderPage = () => {
        switch (route) {
            case '#/login':
                return <LoginPage onLogin={handleLogin} />;
            case '#/register':
                return <RegisterPage onRegister={handleRegister} />;
            case '#/profile':
                return currentUser ? <ProfilePage user={currentUser} onLogout={handleLogout} categories={categories} myList={myList} onMovieClick={handleMovieClick} onToggleMyList={handleToggleMyList} /> : <LoginPage onLogin={handleLogin} />;
            case '#/admin':
                return currentUser?.role === 'admin' ? <AdminDashboard users={users} onUsersUpdate={handleUsersUpdate} categories={categories} onContentUpdate={handleContentUpdate} seriesCategories={seriesCategories} onSeriesContentUpdate={handleSeriesContentUpdate} liveTVChannels={liveTVChannels} onLiveTVChannelsUpdate={handleLiveTVChannelsUpdate} siteName={siteName} onSiteNameUpdate={handleSiteNameUpdate} isCartoonSectionEnabled={isCartoonSectionEnabled} onToggleCartoonSection={handleToggleCartoonSection} /> : <div className="pt-24 text-center">Access Denied</div>;
            case '#/series':
                return <SeriesPage seriesCategories={seriesCategories} onSeriesClick={handleSeriesClick} isLoading={isInitialLoading} />;
            case '#/livetv':
                return <LiveTVPage channels={liveTVChannels} />;
            case '#/cartoon':
                if (!isCartoonSectionEnabled) {
                    window.location.hash = '/';
                    return null;
                }
                return <CartoonPage 
                    categories={cartoonCategories} 
                    onMovieClick={handleMovieClick}
                    myList={myList}
                    onToggleMyList={handleToggleMyList}
                    currentUser={currentUser}
                    isLoading={isInitialLoading}
                />;
            default:
                return (
                    <>
                        <ErrorBoundary fallback={<div className="h-[60vh] md:h-[85vh] w-full bg-myflix-gray flex items-center justify-center p-4 text-center"><p className="text-xl font-bold text-red-400">The hero section failed to load. Please refresh the page.</p></div>}>
                            <Hero movie={HERO_MOVIE} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} onPlay={handlePlayMovie} isLoading={isInitialLoading} />
                        </ErrorBoundary>
                        <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
                             <ErrorBoundary>
                                {isInitialLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => <CarouselSkeleton key={index} />)
                                ) : (
                                    categoriesToShow.map((category) => (
                                        <Carousel 
                                            key={category.title} 
                                            title={category.title} 
                                            movies={category.movies}
                                            onMovieClick={handleMovieClick}
                                            myList={myList}
                                            onToggleMyList={handleToggleMyList}
                                            currentUser={currentUser}
                                        />
                                    ))
                                )}
                                {isLoadingMore && <p className="text-center text-white">Loading more...</p>}
                            </ErrorBoundary>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="bg-myflix-black text-white min-h-screen font-sans">
            <Header currentUser={currentUser} onLogout={handleLogout} onSearch={handleSearch} route={route} siteName={siteName} isCartoonSectionEnabled={isCartoonSectionEnabled} />
            <main>
                <ErrorBoundary>
                    {renderPage()}
                </ErrorBoundary>
            </main>
            {selectedMovie && <MovieDetail movie={selectedMovie} onClose={handleCloseDetail} myList={myList} onToggleMyList={handleToggleMyList} onPlay={handlePlayMovie} />}
            {selectedSeries && <SeriesDetail series={selectedSeries} onClose={handleCloseDetail} onPlayEpisode={handlePlayEpisode} />}
            {playingContent && <VideoPlayer content={playingContent} onClose={() => setPlayingContent(null)} />}
        </div>
    );
};

export default App;