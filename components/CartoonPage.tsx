
import React from 'react';
import Carousel from './Carousel';
import CarouselSkeleton from './skeletons/CarouselSkeleton';
import ErrorBoundary from './ErrorBoundary';
import type { Category, Movie, User } from '../types';

interface CartoonPageProps {
    categories: Category[];
    onMovieClick: (movie: Movie) => void;
    myList: number[];
    onToggleMyList: (movieId: number) => void;
    currentUser: User | null;
    isLoading: boolean;
}

const CartoonPage: React.FC<CartoonPageProps> = ({ categories, onMovieClick, myList, onToggleMyList, currentUser, isLoading }) => {
    return (
        <div className="pt-24">
            <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-8">
                <h1 className="text-4xl font-bold mb-8 text-white tracking-tighter">Cartoons</h1>
                 <div className="space-y-12">
                    <ErrorBoundary>
                        {isLoading ? (
                            Array.from({ length: 2 }).map((_, index) => <CarouselSkeleton key={index} />)
                        ) : (
                            categories.map((category) => (
                                <Carousel 
                                    key={category.title} 
                                    title={category.title} 
                                    movies={category.movies}
                                    onMovieClick={onMovieClick}
                                    myList={myList}
                                    onToggleMyList={onToggleMyList}
                                    currentUser={currentUser}
                                />
                            ))
                        )}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default CartoonPage;
