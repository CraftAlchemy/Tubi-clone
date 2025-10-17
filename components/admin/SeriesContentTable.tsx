// FIX: Property 'ion-icon' does not exist on type 'JSX.IntrinsicElements'. Importing 'types' makes the global definition for 'ion-icon' available.
import '../../types';
import React, { useState } from 'react';
import type { SeriesCategory, Series, Season, Episode } from '../../types';

interface SeriesContentTableProps {
    seriesCategories: SeriesCategory[];
    onContentUpdate: (categories: SeriesCategory[]) => void;
}

const SeriesContentTable: React.FC<SeriesContentTableProps> = ({ seriesCategories, onContentUpdate }) => {
    const [expandedSeriesId, setExpandedSeriesId] = useState<number | null>(null);
    const [modal, setModal] = useState<
        | { type: 'ADD_SERIES'; categoryTitle: string }
        | { type: 'EDIT_SERIES'; series: Series; categoryTitle: string }
        | { type: 'ADD_SEASON'; series: Series }
        | { type: 'EDIT_SEASON'; season: Season; series: Series }
        | { type: 'ADD_EPISODE'; season: Season; series: Series }
        | { type: 'EDIT_EPISODE'; episode: Episode; season: Season; series: Series }
        | null
    >(null);

    const [formData, setFormData] = useState<any>({});
    
    // Toggle series expansion
    const toggleSeries = (seriesId: number) => {
        setExpandedSeriesId(prev => (prev === seriesId ? null : seriesId));
    };

    const openModal = (type: any, data: any) => {
        setModal({ type, ...data });
        setFormData(data.series || data.season || data.episode || {});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // This would be a large switch statement to handle all CRUD operations
        // For brevity, this is a simplified stub. A real implementation would be much more robust.
        alert('Data submitted (not implemented).');
        console.log('Form data:', formData, 'Modal:', modal);
        setModal(null);
    };

    const handleDelete = (type: string, ids: {}) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            // Deletion logic would go here
            alert(`${type} deleted (not implemented).`);
        }
    };


    return (
        <div className="overflow-x-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Series Content Management</h1>
            {seriesCategories.map(category => (
                <div key={category.title} className="bg-admin-card rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{category.title}</h2>
                        <button onClick={() => openModal('ADD_SERIES', { categoryTitle: category.title })} className="bg-admin-accent text-white font-bold py-1.5 px-3 rounded-md text-sm hover:opacity-90">
                            Add Series
                        </button>
                    </div>
                    <div className="space-y-2">
                        {category.series.map(series => (
                            <div key={series.id} className="bg-admin-sidebar rounded-md">
                                <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => toggleSeries(series.id)}>
                                    <div className="flex items-center gap-3">
                                        <img src={series.posterUrl} alt={series.title} className="w-12 h-16 object-cover rounded-sm" />
                                        <span className="font-semibold">{series.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={(e) => { e.stopPropagation(); openModal('EDIT_SERIES', { series, categoryTitle: category.title }) }} className="text-yellow-400 hover:text-yellow-300" title="Edit Series"><ion-icon name="pencil-outline"></ion-icon></button>
                                        <button onClick={(e) => { e.stopPropagation(); openModal('ADD_SEASON', { series }) }} className="text-blue-400 hover:text-blue-300" title="Add Season"><ion-icon name="add-circle-outline"></ion-icon></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('series', { seriesId: series.id, categoryTitle: category.title }) }} className="text-red-400 hover:text-red-300" title="Delete Series"><ion-icon name="trash-outline"></ion-icon></button>
                                        <ion-icon name={expandedSeriesId === series.id ? 'chevron-up-outline' : 'chevron-down-outline'}></ion-icon>
                                    </div>
                                </div>
                                {expandedSeriesId === series.id && (
                                    <div className="pl-8 pr-4 pb-4 space-y-3">
                                        {series.seasons.map(season => (
                                            <div key={season.id} className="bg-admin-main p-3 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold">{season.title}</p>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => openModal('EDIT_SEASON', { season, series })} className="text-yellow-400 hover:text-yellow-300 text-sm" title="Edit Season"><ion-icon name="pencil-outline"></ion-icon></button>
                                                        <button onClick={() => openModal('ADD_EPISODE', { season, series })} className="text-blue-400 hover:text-blue-300 text-sm" title="Add Episode"><ion-icon name="add-circle-outline"></ion-icon></button>
                                                        <button onClick={() => handleDelete('season', { seasonId: season.id, seriesId: series.id })} className="text-red-400 hover:text-red-300 text-sm" title="Delete Season"><ion-icon name="trash-outline"></ion-icon></button>
                                                    </div>
                                                </div>
                                                <div className="mt-2 space-y-2">
                                                    {season.episodes.map(episode => (
                                                        <div key={episode.id} className="flex items-center justify-between text-sm bg-gray-700/50 p-2 rounded">
                                                             <div className="flex items-center gap-2">
                                                                <img src={episode.posterUrl} alt={episode.title} className="w-16 h-9 object-cover rounded-sm" />
                                                                <span>{episode.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button onClick={() => openModal('EDIT_EPISODE', { episode, season, series })} className="text-yellow-400 hover:text-yellow-300" title="Edit Episode"><ion-icon name="pencil-outline"></ion-icon></button>
                                                                <button onClick={() => handleDelete('episode', { episodeId: episode.id, seasonId: season.id, seriesId: series.id })} className="text-red-400 hover:text-red-300" title="Delete Episode"><ion-icon name="trash-outline"></ion-icon></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* A single, complex modal would be needed here to handle all cases */}
            {modal && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Manage Content ({modal.type})</h3>
                        <p className="text-sm text-gray-400">CRUD functionality for Series is complex and not fully implemented in this demo.</p>
                        {/* Example field */}
                        <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Title" className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesContentTable;