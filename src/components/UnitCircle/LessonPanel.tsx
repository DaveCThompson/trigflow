/**
 * Lesson panel component for Visual Trig educational content navigation.
 * Refactored to import lesson data and identity components from separate modules.
 */

import React, { useEffect } from 'react';
import { UnitCircleState } from '../../types';
import { LessonId, LESSONS } from '../../data/lessons';
import { IdentitiesContent } from './IdentitiesContent';
import { CaretLeft, CaretRight, BookOpen } from '@phosphor-icons/react';
import { Button } from '../shared/Button';

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
        <div className="w-full xl:w-[320px] flex-shrink-0 bg-ui-bg-panel rounded-3xl shadow-soft border border-ui-border p-6 flex flex-col gap-6 h-fit sticky top-6 transition-colors duration-300">
            <div className="border-b border-ui-border pb-4">
                <div className="flex items-center gap-2 mb-2 text-ui-text">
                    <BookOpen weight="duotone" className="text-xl text-trig-cos" />
                    <h2 className="text-xl font-heading font-extrabold">
                        Lessons
                    </h2>
                </div>

                <div className="relative">
                    <select
                        value={selectedLessonId}
                        onChange={(e) => onLessonChange(e.target.value as LessonId)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-ui-border bg-ui-bg-hover text-ui-text font-medium focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2 appearance-none cursor-pointer transition-all duration-200"
                    >
                        {LESSONS.map(l => (
                            <option key={l.id} value={l.id}>{l.title}</option>
                        ))}
                    </select>
                    <CaretRight weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-text-muted pointer-events-none rotate-90" />
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={<CaretLeft weight="bold" />}
                        onClick={() => {
                            const currentIndex = LESSONS.findIndex(l => l.id === selectedLessonId);
                            if (currentIndex > 0) {
                                onLessonChange(LESSONS[currentIndex - 1].id);
                            }
                        }}
                        disabled={LESSONS.findIndex(l => l.id === selectedLessonId) === 0}
                    >
                        Prev
                    </Button>

                    <span className="text-xs font-mono font-bold text-ui-text-muted bg-ui-bg-hover px-2.5 py-1 rounded-md shadow-inner">
                        {LESSONS.findIndex(l => l.id === selectedLessonId) + 1} / {LESSONS.length}
                    </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            const currentIndex = LESSONS.findIndex(l => l.id === selectedLessonId);
                            if (currentIndex < LESSONS.length - 1) {
                                onLessonChange(LESSONS[currentIndex + 1].id);
                            }
                        }}
                        disabled={LESSONS.findIndex(l => l.id === selectedLessonId) === LESSONS.length - 1}
                    >
                        Next
                        <CaretRight weight="bold" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="text-ui-text font-medium leading-relaxed italic border-l-4 border-trig-cos pl-4 py-1 bg-ui-bg-hover/50 rounded-r-lg">
                    "{currentLesson.quote}"
                </div>

                {/* Render custom content for identities lesson, standard list for others */}
                {selectedLessonId === 'identities' ? (
                    <IdentitiesContent theme={theme} />
                ) : (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-ui-text-muted uppercase tracking-wider">
                            Key Concepts
                        </h3>
                        <ul className="space-y-4">
                            {currentLesson.details.map((detail, i) => (
                                <li key={i} className="text-sm text-ui-text-muted flex items-start gap-3 group hover:bg-ui-bg-hover p-2.5 -mx-2.5 rounded-2xl transition-all duration-200">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-trig-cos flex-shrink-0 group-hover:scale-[1.2] shadow-glow shadow-trig-cos/40 transition-transform" />
                                    <span className="leading-relaxed group-hover:text-ui-text transition-colors">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
