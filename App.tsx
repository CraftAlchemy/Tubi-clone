
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import { CATEGORIES, HERO_MOVIE } from './data/movies';
import type { Category } from './types';

const App: React.FC = () => {
  return (
    <div className="bg-tubi-black min-h-screen text-white font-sans">
      <Header />
      <main>
        <Hero movie={HERO_MOVIE} />
        <div className="py-8 px-4 md:px-10 lg:px-16 space-y-12">
          {CATEGORIES.map((category: Category) => (
            <Carousel key={category.title} title={category.title} movies={category.movies} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-gray-800 mt-12 py-8 px-4 md:px-10 lg:px-16 text-tubi-light-gray text-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-white mb-4">Company</h3>
                    <ul>
                        <li className="mb-2 hover:text-white cursor-pointer">About Us</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Careers</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Press</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Support</h3>
                    <ul>
                        <li className="mb-2 hover:text-white cursor-pointer">Contact Support</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Help Center</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Supported Devices</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Legal</h3>
                    <ul>
                        <li className="mb-2 hover:text-white cursor-pointer">Terms of Use</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Privacy Policy</li>
                        <li className="mb-2 hover:text-white cursor-pointer">Do Not Sell My Personal Information</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <FacebookIcon />
                        <TwitterIcon />
                        <InstagramIcon />
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
                <p>&copy; {new Date().getFullYear()} Tubi, Inc. A Fox Corporation Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
);
const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.588-7.52 2.588-.49 0-.974-.028-1.455-.086 2.679 1.73 5.868 2.75 9.28 2.75 11.416 0 17.58-9.456 17.57-17.583 0-.268-.006-.535-.018-.802a12.115 12.115 0 002.983-3.088z"/></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>
);


export default App;
