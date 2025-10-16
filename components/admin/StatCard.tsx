

import React from 'react';
// Fix: Use a side-effect import to ensure the module is loaded and its global JSX augmentations for `ion-icon` are applied.
import '../../types';

interface StatCardProps {
    title: string;
    value: string;
    iconName: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconName }) => {
    return (
        <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="text-admin-accent text-4xl">
                <ion-icon name={iconName}></ion-icon>
            </div>
        </div>
    );
};

export default StatCard;