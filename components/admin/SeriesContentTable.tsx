
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
        { type: 'ADD_SEASON', series: Series, categoryTitle: string } |
        { type: 'EDIT_SEASON', season: Season, series: Series, categoryTitle: string } |
        { type: 'ADD_EPISODE', season: Season, series: Series, categoryTitle: string } |
        { type: 'EDIT_EPISODE', episode: Episode, season: Season, series: Series, categoryTitle: string }
    >(null);

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

    const handleUpdate = (updatedCategories: SeriesCategory[]) => {
        onContentUpdate(updatedCategories);
        setModal(null);
    };
    
    // Deletion Handlers
    const deleteCategory = (title: string) => handleUpdate(seriesCategories.filter(c => c.title !== title));
    const deleteSeries = (catTitle: string, seriesId: number) => handleUpdate(seriesCategories.map(c => c.title === catTitle ? { ...c, series: c.series.filter(s => s.id !== seriesId) } : c));
    const deleteSeason = (catTitle: string, seriesId: number, seasonId: number) => handleUpdate(seriesCategories.map(c => c.title === catTitle ? { ...c, series: c.series.map(s => s.id === seriesId ? { ...s, seasons: s.seasons.filter(se => se.id !== seasonId) } : s) } : c));
    const deleteEpisode = (catTitle: string, seriesId: number, seasonId: number, episodeId: number) => handleUpdate(seriesCategories.map(c => c.title === catTitle ? { ...c, series: c.series.map(s => s.id === seriesId ? { ...s, seasons: s.seasons.map(se => se.id === seasonId ? { ...se, episodes: se.episodes.filter(ep => ep.id !== episodeId)} : se) } : s) } : c));


    return (
        <div className="overflow-x-auto">
            <div className="mb-6 flex gap-4">
                 <button onClick={() => setModal({ type: 'ADD_CATEGORY' })} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
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
                                <button onClick={() => setModal({type: 'EDIT_CATEGORY', category: cat})} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                <button onClick={() => setModal({type: 'ADD_SERIES', categoryTitle: cat.title})} className="text-blue-400 hover:text-blue-300">Add Series</button>
                                <button onClick={() => deleteCategory(cat.title)} className="text-red-400 hover:text-red-300">Delete</button>
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
                                                <button onClick={() => setModal({type: 'EDIT_SERIES', series: series, categoryTitle: cat.title})} className="text-yellow-400">Edit</button>
                                                <button onClick={() => setModal({type: 'ADD_SEASON', series: series, categoryTitle: cat.title})} className="text-blue-400">Add Season</button>
                                                <button onClick={() => deleteSeries(cat.title, series.id)} className="text-red-400">Delete</button>
                                            </div>
                                        </div>
                                         {expanded[`${cat.title}-${series.id}`] && series.seasons.map(season => (
                                            <div key={season.id} className="pl-8 pr-4 pb-2">
                                                <div className="flex items-center p-2 bg-admin-card/50 rounded-md">
                                                     <button onClick={() => toggleExpand(`${cat.title}-${series.id}-${season.id}`)} className="p-1 mr-2" title={expanded[`${cat.title}-${series.id}-${season.id}`] ? "Collapse episodes" : "Expand episodes"}><ion-icon name={expanded[`${cat.title}-${series.id}-${season.id}`] ? "chevron-down-outline" : "chevron-forward-outline"}></ion-icon></button>
                                                     <span className="font-medium flex-1">{season.title} ({season.episodes.length} episodes)</span>
                                                     <div className="flex gap-2">
                                                        <button onClick={() => setModal({type: 'EDIT_SEASON', season, series, categoryTitle: cat.title})} className="text-yellow-400">Edit</button>
                                                        <button onClick={() => setModal({type: 'ADD_EPISODE', season, series, categoryTitle: cat.title})} className="text-blue-400">Add Episode</button>
                                                        <button onClick={() => deleteSeason(cat.title, series.id, season.id)} className="text-red-400">Delete</button>
                                                     </div>
                                                </div>
                                                 {expanded[`${cat.title}-${series.id}-${season.id}`] && (
                                                    <div className="pt-2 pl-8 space-y-1">
                                                         {season.episodes.map(ep => (
                                                            <div key={ep.id} className="flex items-center p-1.5 rounded-md hover:bg-admin-card/30">
                                                                <img src={ep.posterUrl} className="w-16 h-9 object-cover rounded-sm mr-3"/>
                                                                <span className="text-sm flex-1">{ep.title}</span>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => setModal({type: 'EDIT_EPISODE', episode: ep, season, series, categoryTitle: cat.title})} className="text-yellow-400 text-xs">Edit</button>
                                                                    <button onClick={() => deleteEpisode(cat.title, series.id, season.id, ep.id)} className="text-red-400 text-xs">Delete</button>
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
            
            {/* Modals would go here. A single modal component that renders different forms based on `modal` state. */}
            {/* This part is omitted for brevity but would involve creating forms for each ADD/EDIT action,
                and on submit, calling `handleUpdate` with the newly structured seriesCategories array.
                Example for Add Category:
                if (modal?.type === 'ADD_CATEGORY') {
                    // Show a form with a title input
                    // On submit:
                    const newCat = { title: formValue, series: [] };
                    handleUpdate([...seriesCategories, newCat]);
                }
            */}
        </div>
    );
};

export default SeriesContentTable;