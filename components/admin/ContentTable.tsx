
import React, { useState } from 'react';
import type { Category, Movie } from '../../types';

interface ContentTableProps {
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ categories, onContentUpdate }) => {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newMovie, setNewMovie] = useState<{ categoryTitle: string; title: string; posterUrl: string } | null>(null);

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
        if (!editingCategory || editingCategory.title.trim() === '') return;
        onContentUpdate(categories.map(c => c.title === editingCategory.title ? editingCategory : c));
        setEditingCategory(null);
    };

    const handleAddMovie = () => {
        if (!newMovie || !newMovie.title || !newMovie.posterUrl) return;
        
        const updatedCategories = categories.map(cat => {
            if (cat.title === newMovie.categoryTitle) {
                const newMovieDetails: Movie = {
                    id: Date.now(), // simple unique id
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
                    {categories.map((category) => (
                        <React.Fragment key={category.title}>
                            <tr className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="py-3 px-4">
                                     {editingCategory?.title === category.title ? (
                                        <input 
                                            type="text"
                                            value={editingCategory.title}
                                            onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                                            className="bg-gray-700 rounded px-2 py-1"
                                        />
                                    ) : (
                                        category.title
                                    )}
                                </td>
                                <td className="py-3 px-4">{category.movies.length}</td>
                                <td className="py-3 px-4 flex gap-2">
                                    {editingCategory?.title === category.title ? (
                                        <>
                                            <button onClick={handleUpdateCategoryTitle} className="text-green-400 hover:text-green-300">Save</button>
                                            <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-300">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setNewMovie({ categoryTitle: category.title, title: '', posterUrl: ''})} className="text-blue-400 hover:text-blue-300">Add Movie</button>
                                            <button onClick={() => handleDeleteCategory(category.title)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                            {category.movies.length > 0 && (
                                <tr className="bg-admin-sidebar">
                                    <td colSpan={3} className="p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {category.movies.map(movie => (
                                                <div key={movie.id} className="relative group">
                                                    <img src={movie.posterUrl} alt={movie.title} className="rounded-md w-full aspect-[2/3] object-cover" />
                                                    <p className="text-xs mt-1 truncate">{movie.title}</p>
                                                    <button onClick={() => handleDeleteMovie(category.title, movie.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                                </div>
                                            ))}
                                        </div>
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
        </div>
    );
};

export default ContentTable;
