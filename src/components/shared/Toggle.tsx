import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    color?: string; // Hex or CSS var
    description?: string;
    className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, color, description, className }) => {
    // Determine active color style. If it's a var, use it directly, else assume hex.
    const activeStyle = checked && color ? { backgroundColor: color, borderColor: color } : {};

    return (
        <label className={twMerge("flex items-start cursor-pointer select-none group py-2", className)}>
            <div className="relative flex items-center pt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only" // Hide native checkbox
                />

                {/* Track */}
                <div
                    className={clsx(
                        "w-11 h-6 rounded-full transition-all duration-300 ease-spring border",
                        checked ? "border-transparent" : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    )}
                    style={activeStyle}
                ></div>

                {/* Thumb */}
                <div
                    className={clsx(
                        "absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ease-spring group-hover:scale-110",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                ></div>
            </div>

            <div className="flex flex-col ml-3">
                <span className={clsx(
                    "text-sm font-medium transition-colors duration-200",
                    checked ? "text-ui-text-DEFAULT" : "text-ui-text-muted group-hover:text-ui-text-DEFAULT"
                )}>
                    {label}
                </span>
                {description && (
                    <span className="text-xs text-ui-text-muted opacity-80 font-normal mt-0.5">{description}</span>
                )}
            </div>
        </label>
    );
};
