import React, { useState } from 'react';
import '../../types';
import type { SeriesCategory, Series, Season, Episode } from '../../types';

interface SeriesContentTableProps {
    seriesCategories: SeriesCategory[];
    onContentUpdate: (categories: SeriesCategory[]) => void;
}

const SeriesContentTable: React.FC<SeriesContentTableProps> = ({ seriesCategories, onContentUpdate }) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    
    const [modal, setModal] = useState<null | 
        { type: 'ADD_CATEGORY' } |
        { type: 'EDIT_CATEGORY', category: SeriesCategory } |
        { type: 'ADD_SERIES', categoryTitle: string } |
        { type: 'EDIT_SERIES', series: Series, categoryTitle: string } |
        { type: 'ADD_SEASON', seriesId: number, categoryTitle: string } |
        { type: 'EDIT_SEASON', season: Season, seriesId: number, categoryTitle: string } |
        { type: 'ADD_EPISODE', seasonId: number, seriesId: number, categoryTitle: string } |
        { type: 'EDIT_EPISODE', episode: Episode, seasonId: number, seriesId: number, categoryTitle: string }
    >(null);

    const [formData, setFormData] = useState<any>({});
    const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

    const toggleExpand = (key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const expandAll = () => {
        const allKeys: { [key: string]: boolean } = {};
        seriesCategories.forEach(cat => {
            allKeys[cat.title] = true;
            cat.series.forEach(series => {
                allKeys[`${cat.title}-${series.id}`] = true;
                series.seasons.forEach(season => {
                    allKeys[`${cat.title}-${series.id}-${season.id}`] = true;
                });
            });
        });
        setExpanded(allKeys);
    };

    const collapseAll = () => {
        setExpanded({});
    };

    const openModal = (modalConfig: typeof modal) => {
        setModal(modalConfig);
        if (modalConfig) {
            if ('category' in modalConfig) setFormData({ title: modalConfig.category.title, originalTitle: modalConfig.category.title });
            else if ('series' in modalConfig) setFormData(modalConfig.series);
            else if ('season' in modalConfig) setFormData(modalConfig.season);
            else if ('episode' in modalConfig) setFormData(modalConfig.episode);
            else setFormData({}); // Reset for add forms
        }
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!modal) return;
        let updatedCategories = [...seriesCategories];

        switch(modal.type) {
            case 'ADD_CATEGORY':
                updatedCategories.push({ title: formData.title, series: [] });
                break;
            case 'EDIT_CATEGORY':
                updatedCategories = updatedCategories.map(c => c.title === modal.category.title ? { ...c, title: formData.title } : c);
                break;
            case 'ADD_SERIES':
                updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: [...c.series, { ...formData, id: Date.now(), seasons: [] }] } : c);
                break;
            case 'EDIT_SERIES':
                 updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: c.series.map(s => s.id === modal.series.id ? { ...s, ...formData } : s) } : c);
                break;
            case 'ADD_SEASON':
                updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: c.series.map(s => s.id === modal.seriesId ? { ...s, seasons: [...s.seasons, { ...formData, id: Date.now(), episodes: [] }] } : s) } : c);
                break;
            case 'EDIT_SEASON':
                 updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: c.series.map(s => s.id === modal.seriesId ? { ...s, seasons: s.seasons.map(se => se.id === modal.season.id ? { ...se, ...formData } : se) } : s) } : c);
                break;
            case 'ADD_EPISODE':
                 updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: c.series.map(s => s.id === modal.seriesId ? { ...s, seasons: s.seasons.map(se => se.id === modal.seasonId ? { ...se, episodes: [...se.episodes, { ...formData, id: Date.now() }] } : se) } : s) } : c);
                break;
            case 'EDIT_EPISODE':
                 updatedCategories = updatedCategories.map(c => c.title === modal.categoryTitle ? { ...c, series: c.series.map(s => s.id === modal.seriesId ? { ...s, seasons: s.seasons.map(se => se.id === modal.seasonId ? { ...se, episodes: se.episodes.map(ep => ep.id === modal.episode.id ? { ...ep, ...formData } : ep) } : se) } : s) } : c);
                break;
        }
        
        onContentUpdate(updatedCategories);
        setModal(null);
        setFormData({});
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        let updatedCategories;
        switch(deleteConfirm.type) {
            case 'CATEGORY':
                updatedCategories = seriesCategories.filter(c => c.title !== deleteConfirm.title);
                break;
            case 'SERIES':
                updatedCategories = seriesCategories.map(c => c.title === deleteConfirm.catTitle ? { ...c, series: c.series.filter(s => s.id !== deleteConfirm.id) } : c);
                break;
            case 'SEASON':
                updatedCategories = seriesCategories.map(c => c.title === deleteConfirm.catTitle ? { ...c, series: c.series.map(s => s.id === deleteConfirm.seriesId ? { ...s, seasons: s.seasons.filter(se => se.id !== deleteConfirm.id) } : s) } : c);
                break;
            case 'EPISODE':
                updatedCategories = seriesCategories.map(c => c.title === deleteConfirm.catTitle ? { ...c, series: c.series.map(s => s.id === deleteConfirm.seriesId ? { ...s, seasons: s.seasons.map(se => se.id === deleteConfirm.seasonId ? { ...se, episodes: se.episodes.filter(ep => ep.id !== deleteConfirm.id) } : se) } : s) } : c);
                break;
            default:
                updatedCategories = seriesCategories;
        }
        onContentUpdate(updatedCategories);
        setDeleteConfirm(null);
    };


    const renderModal = () => {
        if (!modal) return null;
        
        const renderFormFields = () => {
             switch (modal.type) {
                case 'ADD_CATEGORY':
                case 'EDIT_CATEGORY':
                    return <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Category Title" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />;
                case 'ADD_SERIES':
                case 'EDIT_SERIES':
                    return <>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Series Title" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <input type="text" name="posterUrl" value={formData.posterUrl || ''} onChange={handleFormChange} placeholder="Poster URL" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Description" rows={3} className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                    </>;
                case 'ADD_SEASON':
                case 'EDIT_SEASON':
                    return <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Season Title (e.g., Season 1)" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />;
                case 'ADD_EPISODE':
                case 'EDIT_EPISODE':
                    return <>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Episode Title" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <input type="text" name="posterUrl" value={formData.posterUrl || ''} onChange={handleFormChange} placeholder="Thumbnail URL" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <input type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleFormChange} placeholder="Video URL" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <input type="text" name="duration" value={formData.duration || ''} onChange={handleFormChange} placeholder="Duration (e.g., 45m)" className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                        <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Description" rows={3} className="bg-gray-700 rounded px-3 py-2 w-full mt-1" />
                    </>;
            }
        };

        const title = modal.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4">
                <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="space-y-3">{renderFormFields()}</div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button onClick={handleSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Save</button>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderDeleteConfirmModal = () => {
        if (!deleteConfirm) return null;
        return (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4">
                <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4 text-center">
                    <h3 className="text-xl font-bold text-white">Are you sure?</h3>
                    <p className="text-gray-300">
                        You are about to delete <span className="font-semibold text-white">{deleteConfirm.title || 'this item'}</span>. This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                            Cancel
                        </button>
                        <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <div className="mb-6 flex gap-4">
                 <button onClick={() => openModal({ type: 'ADD_CATEGORY' })} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add New Category
                </button>
                <button onClick={expandAll} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">
                    Expand All
                </button>
                 <button onClick={collapseAll} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">
                    Collapse All
                </button>
            </div>
             <div className="space-y-2">
                {seriesCategories.map(cat => (
                    <div key={cat.title} className="bg-admin-card rounded-lg">
                        <div className="flex items-center p-3">
                            <button onClick={() => toggleExpand(cat.title)} className="p-1 mr-2" title={expanded[cat.title] ? "Collapse category" : "Expand category"}><ion-icon name={expanded[cat.title] ? "chevron-down-outline" : "chevron-forward-outline"}></ion-icon></button>
                            <span className="font-bold flex-1">{cat.title} ({cat.series.length} series)</span>
                             <div className="flex gap-2">
                                <button onClick={() => openModal({type: 'EDIT_CATEGORY', category: cat})} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                <button onClick={() => openModal({type: 'ADD_SERIES', categoryTitle: cat.title})} className="text-blue-400 hover:text-blue-300">Add Series</button>
                                <button onClick={() => setDeleteConfirm({type: 'CATEGORY', title: cat.title})} className="text-red-400 hover:text-red-300">Delete</button>
                            </div>
                        </div>
                        {expanded[cat.title] && (
                             <div className="pl-8 pr-4 pb-4 space-y-2">
                                {cat.series.map(series => (
                                    <div key={series.id} className="bg-admin-sidebar rounded-md">
                                        <div className="flex items-center p-3">
                                            <button onClick={() => toggleExpand(`${cat.title}-${series.id}`)} className="p-1 mr-2" title={expanded[`${cat.title}-${series.id}`] ? "Collapse series" : "Expand series"}><ion-icon name={expanded[`${cat.title}-${series.id}`] ? "chevron-down-outline" : "chevron-forward-outline"}></ion-icon></button>
                                            <img src={series.posterUrl} className="w-10 h-14 object-cover rounded-sm mr-3" />
                                            <span className="font-semibold flex-1">{series.title} ({series.seasons.length} seasons)</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => openModal({type: 'EDIT_SERIES', series: series, categoryTitle: cat.title})} className="text-yellow-400">Edit</button>
                                                <button onClick={() => openModal({type: 'ADD_SEASON', seriesId: series.id, categoryTitle: cat.title})} className="text-blue-400">Add Season</button>
                                                <button onClick={() => setDeleteConfirm({type: 'SERIES', title: series.title, id: series.id, catTitle: cat.title})} className="text-red-400">Delete</button>
                                            </div>
                                        </div>
                                         {expanded[`${cat.title}-${series.id}`] && series.seasons.map(season => (
                                            <div key={season.id} className="pl-8 pr-4 pb-2">
                                                <div className="flex items-center p-2 bg-admin-card/50 rounded-md">
                                                     <button onClick={() => toggleExpand(`${cat.title}-${series.id}-${season.id}`)} className="p-1 mr-2" title={expanded[`${cat.title}-${series.id}-${season.id}`] ? "Collapse episodes" : "Expand episodes"}><ion-icon name={expanded[`${cat.title}-${series.id}-${season.id}`] ? "chevron-down-outline" : "chevron-forward-outline"}></ion-icon></button>
                                                     <span className="font-medium flex-1">{season.title} ({season.episodes.length} episodes)</span>
                                                     <div className="flex gap-2">
                                                        <button onClick={() => openModal({type: 'EDIT_SEASON', season, seriesId: series.id, categoryTitle: cat.title})} className="text-yellow-400">Edit</button>
                                                        <button onClick={() => openModal({type: 'ADD_EPISODE', seasonId: season.id, seriesId: series.id, categoryTitle: cat.title})} className="text-blue-400">Add Episode</button>
                                                        <button onClick={() => setDeleteConfirm({type: 'SEASON', title: season.title, id: season.id, seriesId: series.id, catTitle: cat.title})} className="text-red-400">Delete</button>
                                                     </div>
                                                </div>
                                                 {expanded[`${cat.title}-${series.id}-${season.id}`] && (
                                                    <div className="pt-2 pl-8 space-y-1">
                                                         {season.episodes.map(ep => (
                                                            <div key={ep.id} className="flex items-center p-1.5 rounded-md hover:bg-admin-card/30">
                                                                <img src={ep.posterUrl} className="w-16 h-9 object-cover rounded-sm mr-3"/>
                                                                <span className="text-sm flex-1">{ep.title}</span>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => openModal({type: 'EDIT_EPISODE', episode: ep, seasonId: season.id, seriesId: series.id, categoryTitle: cat.title})} className="text-yellow-400 text-xs">Edit</button>
                                                                    <button onClick={() => setDeleteConfirm({type: 'EPISODE', title: ep.title, id: ep.id, seasonId: season.id, seriesId: series.id, catTitle: cat.title})} className="text-red-400 text-xs">Delete</button>
                                                                </div>
                                                            </div>
                                                         ))}
                                                    </div>
                                                )}
                                            </div>
                                         ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {renderModal()}
            {renderDeleteConfirmModal()}
        </div>
    );
};

export default SeriesContentTable;
