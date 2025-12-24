import React, { useState } from 'react';

interface ControlSectionProps {
    title: string;
    children: React.ReactNode;
    /** Whether section starts expanded (default: true) */
    defaultExpanded?: boolean;
}

export const ControlSection: React.FC<ControlSectionProps> = ({
    title,
    children,
    defaultExpanded = true
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between text-left group"
            >
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {title}
                </h3>
                <span className="text-gray-400 text-xs transition-transform duration-200" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                    ▼
                </span>
            </button>
            {expanded && (
                <div className="mt-3">
                    {children}
                </div>
            )}
        </div>
    );
};
