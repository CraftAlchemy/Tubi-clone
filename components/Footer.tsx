// FIX: Removed redundant side-effect import for types as it is now handled globally in index.tsx.
import React from 'react';

interface FooterProps {
    siteName: string;
}

const Footer: React.FC<FooterProps> = ({ siteName }) => {
    const year = new Date().getFullYear();
    
    return (
        <footer className="bg-myflix-black border-t border-gray-800 mt-auto py-8 px-4 sm:px-6 md:px-8 lg:px-16 text-myflix-light-gray text-sm">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-3">
                        <h3 className="font-bold text-white">Navigation</h3>
                        <a href="/#/" className="block hover:text-white">Browse</a>
                        <a href="#/series" className="block hover:text-white">Series</a>
                        <a href="#/livetv" className="block hover:text-white">Live TV</a>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold text-white">About</h3>
                        <a href="#/faq" className="block hover:text-white">FAQ</a>
                        <a href="#" className="block hover:text-white">Contact Us</a>
                        <a href="#" className="block hover:text-white">Investor Relations</a>
                    </div>
                     <div className="space-y-3">
                        <h3 className="font-bold text-white">Legal</h3>
                        <a href="#" className="block hover:text-white">Terms of Use</a>
                        <a href="#" className="block hover:text-white">Privacy Policy</a>
                        <a href="#" className="block hover:text-white">Cookie Preferences</a>
                    </div>
                     <div className="space-y-3">
                        <h3 className="font-bold text-white">Social</h3>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Facebook" className="hover:text-white text-2xl"><ion-icon name="logo-facebook"></ion-icon></a>
                            <a href="#" aria-label="Twitter" className="hover:text-white text-2xl"><ion-icon name="logo-twitter"></ion-icon></a>
                            <a href="#" aria-label="Instagram" className="hover:text-white text-2xl"><ion-icon name="logo-instagram"></ion-icon></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center">
                    <p>&copy; {year} {siteName}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;