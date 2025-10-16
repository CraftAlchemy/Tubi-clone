import React from 'react';
import SeriesCarousel from './SeriesCarousel';
import CarouselSkeleton from './skeletons/CarouselSkeleton';
import type { SeriesCategory, Series } from '../types';

interface SeriesPageProps {
    seriesCategories: SeriesCategory[];
    onSeriesClick: (series: Series) => void;
    isLoading: boolean;
}

const SeriesPage: React.FC<SeriesPageProps> = ({ seriesCategories, onSeriesClick, isLoading }) => {
    return (
        <div className="pt-24">
            <div className="px-4 md:px-10 lg:px-16 py-8 space-y-12">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => <CarouselSkeleton key={index} />)
                ) : (
                    seriesCategories.map((category) => (
                        <SeriesCarousel 
                            key={category.title} 
                            title={category.title} 
                            series={category.series}
                            onSeriesClick={onSeriesClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SeriesPage;
