
import React, { useState, useEffect } from 'react';
import '../../types'; // For ion-icon types
import type { SeriesCategory, Series, Season, Episode } from '../../types';

interface SeriesContentTableProps {
    seriesCategories: SeriesCategory[];
    onContentUpdate: (categories: SeriesCategory[]) => void;
}

const SeriesContentTable: React.FC<SeriesContentTableProps> = ({ seriesCategories, onContentUpdate }) => {
    const [categories, setCategories] = useState(seriesCategories);
    const [editingCategory, setEditingCategory] = useState<SeriesCategory | null>(null);
    const [editingSeries, setEditingSeries] = useState<{ series: Series, category: SeriesCategory } | null>(null);
    const [managingEpisodesFor, setManagingEpisodesFor] = useState<{ series: Series, season: Season } | null>(null);
    const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    
    useEffect(() => {
        setCategories(seriesCategories);
    }, [seriesCategories]);

    const handleUpdate = (updatedCategories: SeriesCategory[]) => {
        onContentUpdate(updatedCategories);
    };
    
    // Category Operations
    const addCategory = () => {
        if (!newCategoryTitle.trim()) return;
        const newCategory: SeriesCategory = { title: newCategoryTitle, series: [] };
        handleUpdate([...categories, newCategory]);
        setNewCategoryTitle("");
    };

    const deleteCategory = (category: SeriesCategory) => {
        if(window.confirm(`Are you sure you want to delete category "${category.title}"?`)) {
            handleUpdate(categories.filter(c => c.title !== category.title));
        }
    };
    
    // Series Operations
    const addSeries = (category: SeriesCategory) => {
        const newSeries: Series = {
            id: Date.now(),
            title: "New Series Title",
            description: "A new series description.",
            posterUrl: "https://picsum.photos/400/600",
            seasons: [{ id: Date.now() + 1, title: "Season 1", episodes: [] }],
        };
        const updatedCategories = categories.map(c => 
            c.title === category.title ? { ...c, series: [...c.series, newSeries] } : c
        );
        handleUpdate(updatedCategories);
    };

    const updateSeries = (updatedSeries: Series) => {
        if (!editingSeries) return;
        const updatedCategories = categories.map(c => {
            if (c.title === editingSeries.category.title) {
                return { ...c, series: c.series.map(s => s.id === updatedSeries.id ? updatedSeries : s) };
            }
            return c;
        });
        handleUpdate(updatedCategories);
    };
    
    const deleteSeries = (seriesToDelete: Series, category: SeriesCategory) => {
        if(window.confirm(`Are you sure you want to delete series "${seriesToDelete.title}"?`)) {
            const updatedCategories = categories.map(c => 
                c.title === category.title ? { ...c, series: c.series.filter(s => s.id !== seriesToDelete.id) } : c
            );
            handleUpdate(updatedCategories);
        }
    };
    
    // Season & Episode Operations
    const addSeason = (series: Series) => {
        const newSeason: Season = {
            id: Date.now(),
            title: `Season ${series.seasons.length + 1}`,
            episodes: []
        };
        const updatedSeries = { ...series, seasons: [...series.seasons, newSeason] };
        updateSeries(updatedSeries);
    };
    
    const addEpisode = (season: Season, series: Series) => {
        const newEpisode: Episode = {
            id: Date.now(),
            title: `Episode ${season.episodes.length + 1}`,
            description: "New episode description.",
            posterUrl: "https://picsum.photos/400/225",
            videoUrl: "",
            duration: "45m"
        };
        const updatedSeason = { ...season, episodes: [...season.episodes, newEpisode] };
        const updatedSeries = { ...series, seasons: series.seasons.map(s => s.id === season.id ? updatedSeason : s) };
        updateSeries(updatedSeries);
        setManagingEpisodesFor({ series: updatedSeries, season: updatedSeason });
    };

    const updateEpisode = (updatedEpisode: Episode) => {
        if (!managingEpisodesFor) return;
        const { series, season } = managingEpisodesFor;
        const updatedSeason = { ...season, episodes: season.episodes.map(e => e.id === updatedEpisode.id ? updatedEpisode : e) };
        const updatedSeries = { ...series, seasons: series.seasons.map(s => s.id === season.id ? updatedSeason : s) };
        updateSeries(updatedSeries);
        setManagingEpisodesFor({ series: updatedSeries, season: updatedSeason });
        setEditingEpisode(null);
    };
    
    const deleteEpisode = (episode: Episode) => {
         if (!managingEpisodesFor || !window.confirm(`Delete "${episode.title}"?`)) return;
        const { series, season } = managingEpisodesFor;
        const updatedSeason = { ...season, episodes: season.episodes.filter(e => e.id !== episode.id) };
        const updatedSeries = { ...series, seasons: series.seasons.map(s => s.id === season.id ? updatedSeason : s) };
        updateSeries(updatedSeries);
        setManagingEpisodesFor({ series: updatedSeries, season: updatedSeason });
    }

    // Render logic
    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="New series category title"
                    className="bg-admin-card border border-gray-600 rounded-md px-3 py-2 text-white w-full md:w-1/3"
                />
                <button onClick={addCategory} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add Category
                </button>
            </div>

            {categories.map(category => (
                <div key={category.title} className="bg-admin-card p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{category.title}</h3>
                        <div>
                            <button onClick={() => addSeries(category)} className="text-blue-400 hover:text-blue-300 mr-4">Add Series</button>
                            <button onClick={() => deleteCategory(category)} className="text-red-400 hover:text-red-300">Delete Category</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {category.series.map(series => (
                            <div key={series.id} className="group relative">
                                <img src={series.posterUrl} alt={series.title} className="rounded-md w-full aspect-[2/3] object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-md">
                                    <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center h-full">
                                        <button onClick={() => setEditingSeries({series, category})} className="bg-blue-600 text-white rounded-md text-xs px-2 py-1 mb-2 w-full">Edit Details</button>
                                        <button onClick={() => addSeason(series)} className="bg-green-600 text-white rounded-md text-xs px-2 py-1 mb-2 w-full">Add Season</button>
                                        <button onClick={() => deleteSeries(series, category)} className="bg-red-600 text-white rounded-md text-xs px-2 py-1 w-full">Delete Series</button>
                                    </div>
                                </div>
                                <p className="text-xs mt-1 truncate">{series.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {editingSeries && <SeriesEditModal series={editingSeries.series} onSave={updateSeries} onClose={() => setEditingSeries(null)} onManageEpisodes={setManagingEpisodesFor} />}
            {managingEpisodesFor && <EpisodeManagementModal series={managingEpisodesFor.series} season={managingEpisodesFor.season} onAddEpisode={addEpisode} onEditEpisode={setEditingEpisode} onDeleteEpisode={deleteEpisode} onClose={() => setManagingEpisodesFor(null)}/>}
            {editingEpisode && managingEpisodesFor && <EpisodeEditModal episode={editingEpisode} onSave={updateEpisode} onClose={() => setEditingEpisode(null)} />}
        </div>
    );
};

// Modals
const SeriesEditModal: React.FC<{ series: Series, onSave: (s: Series) => void, onClose: () => void, onManageEpisodes: (data: { series: Series, season: Season }) => void }> = ({ series, onSave, onClose, onManageEpisodes }) => {
    const [formData, setFormData] = useState(series);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({...formData, [e.target.name]: e.target.value });
    const handleSeasonChange = (seasonId: number, newTitle: string) => {
        setFormData({...formData, seasons: formData.seasons.map(s => s.id === seasonId ? {...s, title: newTitle} : s) });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-admin-card p-6 rounded-lg w-full max-w-2xl space-y-4">
                <h3 className="text-xl font-bold">Edit Series</h3>
                <div><label className="text-sm text-gray-400">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm text-gray-400">Poster URL</label><input type="text" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm text-gray-400">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <h4 className="font-bold pt-2">Seasons</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.seasons.map(season => (
                        <div key={season.id} className="flex items-center gap-2">
                            <input value={season.title} onChange={(e) => handleSeasonChange(season.id, e.target.value)} className="bg-gray-700 rounded px-2 py-1 w-full text-sm"/>
                            <button onClick={() => onManageEpisodes({ series: formData, season })} className="text-sm bg-blue-600 text-white px-2 py-1 rounded-md">Episodes ({season.episodes.length})</button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

const EpisodeManagementModal: React.FC<{ series: Series, season: Season, onAddEpisode: (s: Season, se: Series) => void, onEditEpisode: (e: Episode) => void, onDeleteEpisode: (e: Episode) => void, onClose: () => void }> = ({ series, season, onAddEpisode, onEditEpisode, onDeleteEpisode, onClose }) => {
    return (
         <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-admin-card p-6 rounded-lg w-full max-w-3xl space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Manage Episodes for {season.title}</h3>
                    <button onClick={() => onAddEpisode(season, series)} className="bg-admin-accent text-white font-bold py-1.5 px-3 rounded-md text-sm">Add Episode</button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {season.episodes.map(ep => (
                        <div key={ep.id} className="flex items-center gap-4 bg-gray-800 p-2 rounded">
                            <img src={ep.posterUrl} alt="" className="w-20 h-12 object-cover rounded"/>
                            <p className="flex-1 font-semibold">{ep.title}</p>
                            <button onClick={() => onEditEpisode(ep)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                            <button onClick={() => onDeleteEpisode(ep)} className="text-red-400 hover:text-red-300">Delete</button>
                        </div>
                    ))}
                     {season.episodes.length === 0 && <p className="text-center text-gray-400 py-4">No episodes in this season.</p>}
                </div>
                <div className="flex justify-end"><button onClick={onClose} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Close</button></div>
            </div>
        </div>
    )
};

const EpisodeEditModal: React.FC<{ episode: Episode, onSave: (e: Episode) => void, onClose: () => void }> = ({ episode, onSave, onClose }) => {
    const [formData, setFormData] = useState(episode);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({...formData, [e.target.name]: e.target.value });
    
    return (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-admin-sidebar p-6 rounded-lg w-full max-w-lg space-y-4">
                <h3 className="text-xl font-bold">Edit Episode</h3>
                <div><label className="text-sm">Title</label><input name="title" value={formData.title} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm">Poster URL</label><input name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm">Video URL</label><input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm">Duration</label><input name="duration" value={formData.duration} onChange={handleChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div><label className="text-sm">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-600 font-bold py-2 px-4 rounded-md">Cancel</button>
                    <button onClick={() => onSave(formData)} className="bg-admin-accent font-bold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default SeriesContentTable;
