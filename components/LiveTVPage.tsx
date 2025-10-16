import React, { useState, useEffect } from 'react';
import type { LiveTVChannel } from '../types';

interface LiveTVPageProps {
    channels: LiveTVChannel[];
}

const LiveTVPage: React.FC<LiveTVPageProps> = ({ channels }) => {
    const [selectedChannel, setSelectedChannel] = useState<LiveTVChannel | null>(null);

    useEffect(() => {
        // Select the first channel by default when the component mounts
        if (channels && channels.length > 0 && !selectedChannel) {
            setSelectedChannel(channels[0]);
        }
    }, [channels, selectedChannel]);

    return (
        <div className="pt-20 min-h-screen">
            <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
                {/* Main Player */}
                <div className="flex-grow bg-black flex items-center justify-center lg:w-3/4">
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
                </div>

                {/* Channel Guide */}
                <div className="w-full lg:w-1/4 bg-tubi-gray flex-shrink-0 h-48 lg:h-full overflow-y-auto">
                     <h2 className="text-xl font-bold p-4 bg-tubi-black sticky top-0 z-10">Channel Guide</h2>
                     <div className="p-2 space-y-1">
                        {channels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel)}
                                className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${selectedChannel?.id === channel.id ? 'bg-admin-accent' : 'hover:bg-tubi-black/50'}`}
                            >
                                <img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-700 flex-shrink-0" />
                                <span className="font-semibold">{channel.name}</span>
                            </button>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTVPage;
