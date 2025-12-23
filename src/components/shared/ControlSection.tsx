import React from 'react';

interface ControlSectionProps {
    title: string;
    children: React.ReactNode;
}

export const ControlSection: React.FC<ControlSectionProps> = ({ title, children }) => (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
        {children}
    </div>
);
