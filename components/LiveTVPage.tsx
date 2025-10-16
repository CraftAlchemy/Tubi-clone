
import React, { useState, useEffect } from 'react';
import type { LiveTVChannel } from '../types';

interface LiveTVPageProps {
    channels: LiveTVChannel[];
}

const ChannelGuideModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    channels: LiveTVChannel[],
    selectedChannelId: number | undefined,
    onSelectChannel: (channel: LiveTVChannel) => void,
}> = ({ isOpen, onClose, channels, selectedChannelId, onSelectChannel }) => {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-myflix-black z-[100] p-4 flex flex-col animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-between flex-shrink-0 mb-6">
                <h2 className="text-2xl font-bold">Channel Guide</h2>
                <button onClick={onClose} aria-label="Close menu" className="text-white p-2">
                    <CloseIcon />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-1">
                {channels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel)}
                        className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${selectedChannelId === channel.id ? 'bg-admin-accent' : 'hover:bg-myflix-black/50'}`}
                    >
                        <img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-700 flex-shrink-0" />
                        <span className="font-semibold">{channel.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const LiveTVPage: React.FC<LiveTVPageProps> = ({ channels }) => {
    const [selectedChannel, setSelectedChannel] = useState<LiveTVChannel | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        // Select the first channel by default when the component mounts
        if (channels && channels.length > 0 && !selectedChannel) {
            setSelectedChannel(channels[0]);
        }
    }, [channels, selectedChannel]);

    const handleSelectChannel = (channel: LiveTVChannel) => {
        setSelectedChannel(channel);
        setIsGuideOpen(false); // Close modal on selection
    };

    return (
        <div className="pt-20 min-h-screen">
            <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
                {/* Main Player */}
                <div className="flex-grow bg-black flex items-center justify-center lg:w-3/4 relative">
                    {selectedChannel ? (
                        <iframe
                            key={selectedChannel.id} // Re-mount iframe when channel changes
                            className="w-full h-full"
                            src={selectedChannel.streamUrl}
                            title={selectedChannel.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p className="text-2xl">Select a channel to start watching</p>
                        </div>
                    )}
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent lg:hidden">
                        <p className="text-sm text-gray-400">Now Playing</p>
                        <h3 className="text-lg font-bold text-white truncate">{selectedChannel?.name || 'No Channel Selected'}</h3>
                    </div>
                </div>

                {/* Desktop Channel Guide */}
                <div className="hidden lg:flex lg:flex-col w-full lg:w-1/4 bg-myflix-gray flex-shrink-0 h-full">
                     <h2 className="text-xl font-bold p-4 bg-myflix-black sticky top-0 z-10 flex-shrink-0">Channel Guide</h2>
                     <div className="overflow-y-auto p-2 space-y-1">
                        {channels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => handleSelectChannel(channel)}
                                className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${selectedChannel?.id === channel.id ? 'bg-admin-accent' : 'hover:bg-myflix-black/50'}`}
                            >
                                <img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-700 flex-shrink-0" />
                                <span className="font-semibold">{channel.name}</span>
                            </button>
                        ))}
                     </div>
                </div>

                {/* Mobile Guide Controls */}
                <div className="p-4 bg-myflix-gray lg:hidden">
                    <button
                        onClick={() => setIsGuideOpen(true)}
                        className="w-full bg-myflix-light-gray/20 text-white font-bold py-3 px-4 rounded-md hover:bg-myflix-light-gray/40 transition-colors flex items-center justify-center gap-2"
                    >
                         <MenuIcon />
                        <span>Open Channel Guide</span>
                    </button>
                </div>
            </div>

            <ChannelGuideModal 
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                channels={channels}
                selectedChannelId={selectedChannel?.id}
                onSelectChannel={handleSelectChannel}
            />
        </div>
    );
};

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export default LiveTVPage;
