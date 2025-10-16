import React, { useState } from 'react';
import type { SeriesCategory, Series, Season, Episode } from '../../types';

interface SeriesContentTableProps {
    seriesCategories: SeriesCategory[];
    onContentUpdate: (categories: SeriesCategory[]) => void;
}

const SeriesContentTable: React.FC<SeriesContentTableProps> = ({ seriesCategories, onContentUpdate }) => {
    // This is a placeholder component. A full implementation would be complex.
    // It would need modals for adding/editing series, seasons, and episodes.

    const handleDeleteSeries = (categoryTitle: string, seriesId: number) => {
        const updatedCategories = seriesCategories.map(cat => {
            if (cat.title === categoryTitle) {
                return { ...cat, series: cat.series.filter(s => s.id !== seriesId) };
            }
            return cat;
        });
        onContentUpdate(updatedCategories);
    };

    return (
        <div className="overflow-x-auto">
             <h1 className="text-2xl font-bold mb-4">Series Content</h1>
            {seriesCategories.map(category => (
                <div key={category.title} className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">{category.title}</h2>
                    <div className="bg-admin-card rounded-lg p-4">
                        {category.series.map(series => (
                            <div key={series.id} className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center gap-4">
                                    <img src={series.posterUrl} alt={series.title} className="w-12 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-bold">{series.title}</p>
                                        <p className="text-sm text-gray-400">{series.seasons.length} Season(s)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="text-yellow-400 hover:text-yellow-300" title="Edit series">
                                        <ion-icon name="pencil-outline"></ion-icon>
                                    </button>
                                     <button onClick={() => handleDeleteSeries(category.title, series.id)} className="text-red-400 hover:text-red-300" title="Delete series">
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        ))}
                         {category.series.length === 0 && <p className="text-center text-gray-500 py-4">No series in this category.</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SeriesContentTable;