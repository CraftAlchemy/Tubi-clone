// FIX: Moved side-effect import to the top to ensure global type augmentations are loaded first.
import '../../types'; 
import React, { useState, useEffect } from 'react';
import type { SeriesCategory, Series, Season, Episode } from '../../types';

interface SeriesContentTableProps {
    seriesCategories: SeriesCategory[];
    onContentUpdate: (categories: SeriesCategory[]) => void;
}

const SeriesContentTable: React.FC<SeriesContentTableProps> = ({ seriesCategories, onContentUpdate }) => {
    const [categories, setCategories] = useState(seriesCategories);
    const [expandedSeries, setExpandedSeries] = useState<number[]>([]);
    
    // Modal States
    const [modal, setModal] = useState<
        | { type: 'ADD_CATEGORY' }
        | { type: 'EDIT_CATEGORY'; category: SeriesCategory }
        | { type: 'ADD_SERIES'; categoryTitle: string }
        | { type: 'EDIT_SERIES'; series: Series; categoryTitle: string }
        | { type: 'ADD_SEASON'; seriesId: number }
        | { type: 'EDIT_SEASON'; season: Season; seriesId: number }
        | { type: 'ADD_EPISODE'; seasonId: number }
        | { type: 'EDIT_EPISODE'; episode: Episode; seasonId: number }
        | null
    >(null);
    const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    
    useEffect(() => {
        setCategories(seriesCategories);
    }, [seriesCategories]);

    const handleUpdate = (updatedCategories: SeriesCategory[]) => {
        onContentUpdate(updatedCategories);
    };
    
    const toggleSeries = (seriesId: number) => {
        setExpandedSeries(prev => prev.includes(seriesId) ? prev.filter(id => id !== seriesId) : [...prev, seriesId]);
    };
    
    const openModal = (type: any, data: any = {}) => {
        setModal({ type, ...data });
        setFormData(data.series || data.season || data.episode || { title: '' });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const numValue = type === 'number' ? (value === '' ? undefined : parseInt(value, 10)) : value;
        setFormData(prev => ({ ...prev, [name]: isNaN(numValue as number) ? value : numValue }));
    };

    const handleSubmit = () => {
        if (!modal) return;
        let updatedCategories = [...categories];

        switch (modal.type) {
            case 'ADD_CATEGORY':
                updatedCategories.push({ title: formData.title, series: [] });
                break;
            case 'EDIT_CATEGORY':
                updatedCategories = categories.map(c => c.title === modal.category.title ? { ...c, title: formData.title } : c);
                break;
            case 'ADD_SERIES':
                updatedCategories = categories.map(c => {
                    if (c.title === modal.categoryTitle) {
                        const newSeries: Series = { id: Date.now(), title: formData.title, posterUrl: formData.posterUrl, description: formData.description, seasons: [] };
                        return { ...c, series: [...c.series, newSeries] };
                    }
                    return c;
                });
                break;
            case 'EDIT_SERIES':
                updatedCategories = categories.map(c => {
                    if (c.title === modal.categoryTitle) {
                        return { ...c, series: c.series.map(s => s.id === modal.series.id ? { ...s, ...formData } : s) };
                    }
                    return c;
                });
                break;
            case 'ADD_SEASON':
                updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => {
                        if (s.id === modal.seriesId) {
                            const newSeason: Season = { id: Date.now(), title: formData.title, episodes: [] };
                            return { ...s, seasons: [...s.seasons, newSeason] };
                        }
                        return s;
                    })
                }));
                break;
            case 'EDIT_SEASON':
                updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => {
                        if (s.id === modal.seriesId) {
                            return { ...s, seasons: s.seasons.map(se => se.id === modal.season.id ? { ...se, ...formData } : se) };
                        }
                        return s;
                    })
                }));
                break;
            case 'ADD_EPISODE':
                updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => ({
                        ...s,
                        seasons: s.seasons.map(se => {
                            if (se.id === modal.seasonId) {
                                const newEpisode: Episode = { id: Date.now(), ...formData };
                                return { ...se, episodes: [...se.episodes, newEpisode] };
                            }
                            return se;
                        })
                    }))
                }));
                break;
            case 'EDIT_EPISODE':
                 updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => ({
                        ...s,
                        seasons: s.seasons.map(se => {
                             if (se.id === modal.seasonId) {
                                return { ...se, episodes: se.episodes.map(ep => ep.id === modal.episode.id ? { ...ep, ...formData } : ep) };
                            }
                            return se;
                        })
                    }))
                }));
                break;
        }

        handleUpdate(updatedCategories);
        setModal(null);
        setFormData({});
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        let updatedCategories = [...categories];

        switch (deleteConfirm.type) {
            case 'CATEGORY':
                updatedCategories = categories.filter(c => c.title !== deleteConfirm.title);
                break;
            case 'SERIES':
                updatedCategories = categories.map(c => ({ ...c, series: c.series.filter(s => s.id !== deleteConfirm.id) }));
                break;
            case 'SEASON':
                 updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => ({...s, seasons: s.seasons.filter(se => se.id !== deleteConfirm.id) }))
                }));
                break;
            case 'EPISODE':
                updatedCategories = categories.map(c => ({
                    ...c,
                    series: c.series.map(s => ({
                        ...s,
                        seasons: s.seasons.map(se => ({ ...se, episodes: se.episodes.filter(ep => ep.id !== deleteConfirm.id) }))
                    }))
                }));
                break;
        }

        handleUpdate(updatedCategories);
        setDeleteConfirm(null);
    };

    return (
        <div>
            <div className="mb-6">
                <button onClick={() => openModal('ADD_CATEGORY')} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add Series Category
                </button>
            </div>
            <div className="space-y-4">
                {categories.map(category => (
                    <div key={category.title} className="bg-admin-card rounded-lg">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-xl font-bold">{category.title}</h3>
                            <div className="flex gap-4">
                                <button onClick={() => openModal('EDIT_CATEGORY', { category })} className="text-yellow-400">Edit</button>
                                <button onClick={() => openModal('ADD_SERIES', { categoryTitle: category.title })} className="text-blue-400">Add Series</button>
                                <button onClick={() => setDeleteConfirm({ type: 'CATEGORY', title: category.title })} className="text-red-400">Delete</button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {category.series.map(series => (
                                <div key={series.id} className="bg-admin-sidebar rounded-md">
                                    <div className="flex items-center p-3 cursor-pointer" onClick={() => toggleSeries(series.id)}>
                                        <img src={series.posterUrl} alt={series.title} className="w-12 h-16 object-cover rounded-sm mr-4"/>
                                        <div className="flex-1">
                                            <span className="font-semibold">{series.title}</span>
                                            {series.tokenCost && <TokenBadge cost={series.tokenCost} />}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={(e) => { e.stopPropagation(); openModal('EDIT_SERIES', { series, categoryTitle: category.title }); }} className="text-yellow-400">Edit</button>
                                            <button onClick={(e) => { e.stopPropagation(); openModal('ADD_SEASON', { seriesId: series.id }); }} className="text-green-400">Add Season</button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'SERIES', id: series.id, title: series.title }); }} className="text-red-400">Delete</button>
                                            <span className={`transition-transform transform ${expandedSeries.includes(series.id) ? 'rotate-90' : ''}`}>
                                                <ion-icon name="chevron-forward-outline"></ion-icon>
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSeries.includes(series.id) && (
                                        <div className="pl-8 pr-4 pb-3 space-y-2">
                                            {series.seasons.map(season => (
                                                <div key={season.id} className="bg-admin-card/50 p-2 rounded">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold">{season.title} ({season.episodes.length} episodes) {season.tokenCost && <TokenBadge cost={season.tokenCost}/>}</p>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => openModal('EDIT_SEASON', { season, seriesId: series.id })} className="text-xs text-yellow-400">Edit</button>
                                                            <button onClick={() => openModal('ADD_EPISODE', { seasonId: season.id })} className="text-xs text-green-400">Add Episode</button>
                                                            <button onClick={() => setDeleteConfirm({ type: 'SEASON', id: season.id, title: season.title })} className="text-xs text-red-400">Delete</button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 space-y-1 pl-4">
                                                        {season.episodes.map(episode => (
                                                            <div key={episode.id} className="flex items-center justify-between text-sm">
                                                                <p>{episode.title} {episode.tokenCost && <TokenBadge cost={episode.tokenCost}/>}</p>
                                                                 <div className="flex gap-2">
                                                                    <button onClick={() => openModal('EDIT_EPISODE', { episode, seasonId: season.id })} className="text-xs text-yellow-400">Edit</button>
                                                                    <button onClick={() => setDeleteConfirm({ type: 'EPISODE', id: episode.id, title: episode.title })} className="text-xs text-red-400">Delete</button>
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
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{`Manage ${modal.type.replace('_', ' ')}`}</h3>
                        {['ADD_CATEGORY', 'EDIT_CATEGORY', 'ADD_SERIES', 'EDIT_SERIES', 'ADD_SEASON', 'EDIT_SEASON', 'ADD_EPISODE', 'EDIT_EPISODE'].includes(modal.type) && (
                             <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Title" className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        )}
                        {['ADD_SERIES', 'EDIT_SERIES', 'ADD_EPISODE', 'EDIT_EPISODE'].includes(modal.type) && (
                            <>
                                <input type="text" name="posterUrl" value={formData.posterUrl || ''} onChange={handleFormChange} placeholder="Poster URL" className="bg-gray-700 rounded px-3 py-2 w-full"/>
                                <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Description" className="bg-gray-700 rounded px-3 py-2 w-full"></textarea>
                            </>
                        )}
                        {['ADD_EPISODE', 'EDIT_EPISODE'].includes(modal.type) && (
                             <input type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleFormChange} placeholder="Video URL" className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        )}
                        {['EDIT_SERIES', 'EDIT_SEASON', 'EDIT_EPISODE'].includes(modal.type) && (
                             <input type="number" name="tokenCost" value={formData.tokenCost || ''} onChange={handleFormChange} placeholder="Token Cost (optional)" className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        )}
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent">Save</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation */}
            {deleteConfirm && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md text-center">
                        <h3 className="text-xl font-bold">Are you sure?</h3>
                        <p className="my-4">You want to delete "{deleteConfirm.title}". This cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TokenBadge: React.FC<{ cost: number }> = ({ cost }) => (
    <span className="ml-2 inline-flex items-center gap-1 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
        <ion-icon name="cash-outline" style={{'fontSize': '14px'}}></ion-icon>
        <span>{cost}</span>
    </span>
);

export default SeriesContentTable;