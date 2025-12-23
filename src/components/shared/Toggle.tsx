import React from 'react';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    color?: string;
    description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, color, description }) => (
    <label className="flex items-center mb-2 cursor-pointer select-none group">
        <div className="relative flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
            />
            {color && (
                <span
                    className="w-3 h-3 rounded-full mr-3 shadow-sm border border-black/10"
                    style={{ backgroundColor: color }}
                />
            )}
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                    {label}
                </span>
                {description && (
                    <span className="text-xs text-gray-400 font-normal">{description}</span>
                )}
            </div>
        </div>
    </label>
);
