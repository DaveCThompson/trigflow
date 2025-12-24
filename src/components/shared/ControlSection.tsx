import React, { useState } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import { clsx } from 'clsx';

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
        <div className="border-b border-ui-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between text-left group py-1"
            >
                <h3 className="text-xs font-bold text-ui-text-muted uppercase tracking-wider group-hover:text-ui-text transition-colors duration-200">
                    {title}
                </h3>
                <CaretRight
                    weight="bold"
                    className={clsx(
                        "text-ui-text-muted transition-transform duration-300",
                        expanded ? "rotate-90" : "rotate-0"
                    )}
                />
            </button>
            <div
                className={clsx(
                    "grid transition-all duration-300 ease-in-out overflow-hidden",
                    expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
                )}
            >
                <div className="min-h-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
