
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import MovieDetail from './components/MovieDetail';
import AdminDashboard from './components/admin/AdminDashboard';
import { HERO_MOVIE, generateMoreCategories, CATEGORIES } from './data/movies';
import { USERS } from './data/users';
import type { User, Category, Movie } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>(CATEGORIES);
    const [route, setRoute] = useState(window.location.hash);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [myList, setMyList] = useState<number[]>([]);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleLogin = (email: string, password: string): boolean => {
        const user = USERS.find(u => u.email === email && u.password === password);
        if (user) {
            const userToStore = { ...user };
            delete userToStore.password;
            setCurrentUser(userToStore);
            
            // Load My List from localStorage
            const storedList = localStorage.getItem(`my-list-${user.id}`);
            if (storedList) {
                setMyList(JSON.parse(storedList));
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
        if (USERS.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser: User = {
            id: USERS.length + 1,
            email,
            password,
            role: 'user',
        };
        USERS.push(newUser);
        handleLogin(email, password);
        return true;
    };
    
    const handleContentUpdate = (updatedCategories: Category[]) => {
        setCategories(updatedCategories);
    };

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetail = () => {
        setSelectedMovie(null);
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
        if (isLoading) return;
        setIsLoading(true);
        setTimeout(() => { // Simulate network request
            const newCategories = generateMoreCategories(page + 1);
            setCategories(prev => [...prev, ...newCategories]);
            setPage(prev => prev + 1);
            setIsLoading(false);
        }, 500);
    }, [page, isLoading]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500 || isLoading) {
                return;
            }
            loadMoreCategories();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, loadMoreCategories]);

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
                return currentUser?.role === 'admin' ? <AdminDashboard categories={categories} onContentUpdate={handleContentUpdate} /> : <div className="pt-24 text-center">Access Denied</div>;
            default:
                return (
                    <>
                        <Hero movie={HERO_MOVIE} myList={myList} onToggleMyList={handleToggleMyList} currentUser={currentUser} />
                        <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
                            {categoriesToShow.map((category) => (
                                <Carousel 
                                    key={category.title} 
                                    title={category.title} 
                                    movies={category.movies}
                                    onMovieClick={handleMovieClick}
                                    myList={myList}
                                    onToggleMyList={handleToggleMyList}
                                    currentUser={currentUser}
                                />
                            ))}
                            {isLoading && <p className="text-center text-white">Loading more...</p>}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="bg-tubi-black text-white min-h-screen font-sans">
            <Header currentUser={currentUser} onLogout={handleLogout} onSearch={handleSearch} />
            <main>
                {renderPage()}
            </main>
            {selectedMovie && <MovieDetail movie={selectedMovie} onClose={handleCloseDetail} myList={myList} onToggleMyList={handleToggleMyList} />}
        </div>
    );
};

export default App;
