import React, { useState, useEffect } from 'react';
// Fix: Use a side-effect import for global JSX definitions and `import type` for type-only imports.
import '../../types';
import type { Category, Movie } from '../../types';

interface ContentTableProps {
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
}

const MOVIES_PER_PAGE = 6;

const ContentTable: React.FC<ContentTableProps> = ({ categories, onContentUpdate }) => {
    const [editingState, setEditingState] = useState<{ originalTitle: string; newTitle: string; } | null>(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newMovie, setNewMovie] = useState<{ categoryTitle: string; title: string; posterUrl: string } | null>(null);
    const [editingMovie, setEditingMovie] = useState<{ movie: Movie; categoryTitle: string } | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Movie>>({ title: '', description: '', posterUrl: '' });
    const [dragItem, setDragItem] = useState<{ categoryIndex: number; movieIndex: number } | null>(null);
    const [currentPages, setCurrentPages] = useState<{ [categoryTitle: string]: number }>({});

    useEffect(() => {
        if (editingMovie) {
            setEditFormData(editingMovie.movie);
        }
    }, [editingMovie]);
    
    const handlePageChange = (categoryTitle: string, newPage: number) => {
        setCurrentPages(prev => ({ ...prev, [categoryTitle]: newPage }));
    };

    const handleAddCategory = () => {
        if (newCategoryTitle.trim() === '') return;
        const newCat: Category = {
            title: newCategoryTitle,
            movies: []
        };
        onContentUpdate([...categories, newCat]);
        setNewCategoryTitle('');
    };

    const handleDeleteCategory = (title: string) => {
        onContentUpdate(categories.filter(c => c.title !== title));
    };

    const handleUpdateCategoryTitle = () => {
        if (!editingState || editingState.newTitle.trim() === '') return;
        const updatedCategories = categories.map(c => 
            c.title === editingState.originalTitle 
                ? { ...c, title: editingState.newTitle } 
                : c
        );
        onContentUpdate(updatedCategories);
        setEditingState(null);
    };

    const handleAddMovie = () => {
        if (!newMovie || !newMovie.title || !newMovie.posterUrl) return;
        
        const updatedCategories = categories.map(cat => {
            if (cat.title === newMovie.categoryTitle) {
                const newMovieDetails: Movie = {
                    id: Date.now(),
                    title: newMovie.title,
                    posterUrl: newMovie.posterUrl,
                    description: 'Newly added movie description.'
                };
                return { ...cat, movies: [...cat.movies, newMovieDetails] };
            }
            return cat;
        });

        onContentUpdate(updatedCategories);
        setNewMovie(null);
    };

    const handleDeleteMovie = (categoryTitle: string, movieId: number) => {
         const updatedCategories = categories.map(cat => {
            if (cat.title === categoryTitle) {
                return { ...cat, movies: cat.movies.filter(m => m.id !== movieId) };
            }
            return cat;
        });
        onContentUpdate(updatedCategories);
    };
    
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateMovie = () => {
        if (!editingMovie) return;
        
        const updatedCategories = categories.map(cat => {
            if (cat.title === editingMovie.categoryTitle) {
                const updatedMovies = cat.movies.map(m => 
                    m.id === editingMovie.movie.id ? { ...m, ...editFormData } : m
                );
                return { ...cat, movies: updatedMovies };
            }
            return cat;
        });

        onContentUpdate(updatedCategories);
        setEditingMovie(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, categoryIndex: number, movieIndex: number) => {
        setDragItem({ categoryIndex, movieIndex });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategoryIndex: number, targetMovieIndex: number) => {
        e.preventDefault();
        if (!dragItem || (dragItem.categoryIndex !== targetCategoryIndex)) {
            return;
        }
        if (dragItem.categoryIndex === targetCategoryIndex && dragItem.movieIndex === targetMovieIndex) {
            return;
        }

        const newCategories = [...categories];
        const category = newCategories[dragItem.categoryIndex];
        const newMovies = [...category.movies];

        const [draggedMovie] = newMovies.splice(dragItem.movieIndex, 1);
        newMovies.splice(targetMovieIndex, 0, draggedMovie);

        newCategories[dragItem.categoryIndex] = { ...category, movies: newMovies };
        onContentUpdate(newCategories);
    };
    
    const handleDragEnd = () => {
        setDragItem(null);
    };

    return (
        <div className="overflow-x-auto">
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="New category title"
                    className="bg-admin-card border border-gray-600 rounded-md px-3 py-2 text-white w-full md:w-1/3"
                />
                <button onClick={handleAddCategory} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add Category
                </button>
            </div>
            <table className="min-w-full bg-admin-card rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Category Title</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Movie Count</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {categories.map((category, categoryIndex) => (
                        <React.Fragment key={category.title}>
                            <tr className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="py-3 px-4">
                                     {editingState?.originalTitle === category.title ? (
                                        <input 
                                            type="text"
                                            value={editingState.newTitle}
                                            onChange={(e) => setEditingState({...editingState, newTitle: e.target.value})}
                                            className="bg-gray-700 rounded px-2 py-1"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdateCategoryTitle();
                                                if (e.key === 'Escape') setEditingState(null);
                                            }}
                                        />
                                    ) : (
                                        category.title
                                    )}
                                </td>
                                <td className="py-3 px-4">{category.movies.length}</td>
                                <td className="py-3 px-4 flex gap-2">
                                    {editingState?.originalTitle === category.title ? (
                                        <>
                                            <button onClick={handleUpdateCategoryTitle} className="text-green-400 hover:text-green-300">Save</button>
                                            <button onClick={() => setEditingState(null)} className="text-gray-400 hover:text-gray-300">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditingState({ originalTitle: category.title, newTitle: category.title })} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                            <button onClick={() => setNewMovie({ categoryTitle: category.title, title: '', posterUrl: ''})} className="text-blue-400 hover:text-blue-300">Add Movie</button>
                                            <button onClick={() => handleDeleteCategory(category.title)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                            {category.movies.length > 0 && (
                                <tr className="bg-admin-sidebar">
                                    <td colSpan={3} className="p-4">
                                        {(() => {
                                            const page = currentPages[category.title] || 0;
                                            const totalPages = Math.ceil(category.movies.length / MOVIES_PER_PAGE);
                                            const paginatedMovies = category.movies.slice(page * MOVIES_PER_PAGE, (page + 1) * MOVIES_PER_PAGE);

                                            return (
                                                <>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                        {paginatedMovies.map((movie, movieIndex) => {
                                                            const originalMovieIndex = page * MOVIES_PER_PAGE + movieIndex;
                                                            return (
                                                                <div 
                                                                    key={movie.id} 
                                                                    className={`relative group cursor-grab transition-opacity ${dragItem?.categoryIndex === categoryIndex && dragItem?.movieIndex === originalMovieIndex ? 'opacity-50' : ''}`}
                                                                    draggable
                                                                    onDragStart={(e) => handleDragStart(e, categoryIndex, originalMovieIndex)}
                                                                    onDrop={(e) => handleDrop(e, categoryIndex, originalMovieIndex)}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    onDragEnd={handleDragEnd}
                                                                >
                                                                    <img src={movie.posterUrl} alt={movie.title} className="rounded-md w-full aspect-[2/3] object-cover" />
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-md">
                                                                        <div className="absolute top-2 left-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" title="Drag to reorder">
                                                                            <ion-icon name="move-outline"></ion-icon>
                                                                        </div>
                                                                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                            <button 
                                                                                onClick={() => setEditingMovie({ movie, categoryTitle: category.title })} 
                                                                                className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg hover:bg-blue-500 transition-colors" 
                                                                                title="Edit movie">
                                                                                <ion-icon name="pencil-outline"></ion-icon>
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDeleteMovie(category.title, movie.id)} 
                                                                                className="bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg hover:bg-red-500 transition-colors" 
                                                                                title="Delete movie">
                                                                                <ion-icon name="trash-outline"></ion-icon>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs mt-1 truncate group-hover:opacity-0 transition-opacity duration-300">{movie.title}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    {totalPages > 1 && (
                                                        <div className="flex justify-center items-center mt-4 space-x-4">
                                                            <button
                                                                onClick={() => handlePageChange(category.title, page - 1)}
                                                                disabled={page === 0}
                                                                className="px-3 py-1 bg-admin-card rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                                            >
                                                                Previous
                                                            </button>
                                                            <span className="text-sm text-gray-400">
                                                                Page {page + 1} of {totalPages}
                                                            </span>
                                                            <button
                                                                onClick={() => handlePageChange(category.title, page + 1)}
                                                                disabled={page >= totalPages - 1}
                                                                className="px-3 py-1 bg-admin-card rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            
            {newMovie && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Add Movie to "{newMovie.categoryTitle}"</h3>
                        <input type="text" placeholder="Movie Title" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        <input type="text" placeholder="Poster URL" value={newMovie.posterUrl} onChange={e => setNewMovie({...newMovie, posterUrl: e.target.value})} className="bg-gray-700 rounded px-3 py-2 w-full"/>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setNewMovie(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleAddMovie} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {editingMovie && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Edit Movie</h3>
                        <div>
                            <label className="text-sm text-gray-400">Title</label>
                            <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Poster URL</label>
                            <input type="text" name="posterUrl" value={editFormData.posterUrl} onChange={handleEditFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea name="description" value={editFormData.description || ''} onChange={handleEditFormChange} rows={4} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setEditingMovie(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleUpdateMovie} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentTable;