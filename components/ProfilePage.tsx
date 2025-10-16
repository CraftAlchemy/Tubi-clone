
import React from 'react';
import type { User, Category, Movie } from '../types';
import MovieCard from './MovieCard';

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
    categories: Category[];
    myList: number[];
    onMovieClick: (movie: Movie) => void;
    onToggleMyList: (movieId: number) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, categories, myList, onMovieClick, onToggleMyList }) => {
    
    const allMovies = categories.flatMap(cat => cat.movies);
    const listMovies = myList
        .map(id => allMovies.find(m => m.id === id))
        .filter((movie): movie is Movie => movie !== undefined);

    return (
        <div className="min-h-screen pt-24 px-4 md:px-10 lg:px-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-tubi-gray flex items-center justify-center">
                        <UserIcon />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">My Profile</h1>
                        <p className="text-lg text-tubi-light-gray text-center md:text-left">{user.email}</p>
                    </div>
                </div>
                
                <div className="bg-tubi-gray p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Account Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-tubi-light-gray">User ID</p>
                            <p className="text-white">{user.id}</p>
                        </div>
                         <div>
                            <p className="text-sm text-tubi-light-gray">Role</p>
                            <p className="text-white capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-tubi-light-gray">Member Since</p>
                            <p className="text-white">January 2024</p>
                        </div>
                    </div>
                </div>

                <div className="bg-tubi-gray p-6 rounded-lg mt-8">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">My List</h2>
                    {listMovies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {listMovies.map(movie => (
                            <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={onMovieClick}
                            myList={myList}
                            onToggleMyList={onToggleMyList}
                            currentUser={user}
                            />
                        ))}
                        </div>
                    ) : (
                        <p className="text-tubi-light-gray">You haven't added any movies to your list yet.</p>
                    )}
                </div>

                 <div className="mt-8">
                     <button 
                        onClick={onLogout}
                        className="w-full md:w-auto bg-tubi-red text-white font-bold px-8 py-3 rounded-full hover:opacity-80 transition-opacity">
                        Sign Out
                    </button>
                 </div>
            </div>
        </div>
    );
};

const UserIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 text-gray-500" 
        viewBox="0 0 20 20" 
        fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export default ProfilePage;
