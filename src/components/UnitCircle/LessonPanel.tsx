/**
 * Lesson panel component for TrigFlow educational content navigation.
 * Refactored to import lesson data and identity components from separate modules.
 */

import React, { useEffect } from 'react';
import { UnitCircleState } from '../../types';
import { LessonId, LESSONS } from '../../data/lessons';
import { IdentitiesContent } from './IdentitiesContent';

// Re-export types for backward compatibility
export type { LessonId } from '../../data/lessons';
export { LESSONS } from '../../data/lessons';

interface LessonPanelProps {
    toggles: UnitCircleState['toggles'];
    setToggles: React.Dispatch<React.SetStateAction<UnitCircleState['toggles']>>;
    selectedLessonId: LessonId;
    onLessonChange: (id: LessonId) => void;
    theme: UnitCircleState['theme'];
}

export const LessonPanel: React.FC<LessonPanelProps> = ({ setToggles, selectedLessonId, onLessonChange, theme }) => {

    // Apply lesson logic when selection changes
    useEffect(() => {
        const lesson = LESSONS.find(l => l.id === selectedLessonId);
        if (lesson) {
            lesson.apply(setToggles);
        }
    }, [selectedLessonId, setToggles]);

    const currentLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

    return (
        <div className="w-full xl:w-[320px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6 h-fit sticky top-6">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Lessons
                </h2>
                <select
                    value={selectedLessonId}
                    onChange={(e) => onLessonChange(e.target.value as LessonId)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {LESSONS.map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                </select>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-3">
                    <button
                        onClick={() => {
                            const currentIndex = LESSONS.findIndex(l => l.id === selectedLessonId);
                            if (currentIndex > 0) {
                                onLessonChange(LESSONS[currentIndex - 1].id);
                            }
                        }}
                        disabled={LESSONS.findIndex(l => l.id === selectedLessonId) === 0}
                        className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Previous
                    </button>

                    <span className="text-xs text-gray-400">
                        {LESSONS.findIndex(l => l.id === selectedLessonId) + 1} of {LESSONS.length}
                    </span>

                    <button
                        onClick={() => {
                            const currentIndex = LESSONS.findIndex(l => l.id === selectedLessonId);
                            if (currentIndex < LESSONS.length - 1) {
                                onLessonChange(LESSONS[currentIndex + 1].id);
                            }
                        }}
                        disabled={LESSONS.findIndex(l => l.id === selectedLessonId) === LESSONS.length - 1}
                        className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="text-gray-800 dark:text-gray-100">
                    {currentLesson.quote}
                </div>

                {/* Render custom content for identities lesson, standard list for others */}
                {selectedLessonId === 'identities' ? (
                    <IdentitiesContent theme={theme} />
                ) : (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Key Concepts
                        </h3>
                        <ul className="space-y-2">
                            {currentLesson.details.map((detail, i) => (
                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
