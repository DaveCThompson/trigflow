/**
 * Trig Identities content component for Visual Trig.
 * Extracted from LessonPanel.tsx for maintainability.
 */

import React from 'react';
import { TrigTheme } from '../../types';
import { Frac, Card, Category, Fn } from './IdentityComponents';

// Level type for filtering
type IdentityLevel = 'all' | 'basic' | 'intermediate' | 'advanced';

// Level toggle button
const LevelBtn: React.FC<{ level: IdentityLevel; current: IdentityLevel; onClick: () => void }> = ({ level, current, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 ${current === level
            ? 'bg-ui-bg-hover text-ui-text border-2 border-trig-cos' // Active: Outline/Surface style like Controls
            : 'bg-ui-bg-hover text-ui-text-muted hover:text-ui-text opacity-70 hover:opacity-100'
            }`}
    >
        {level.charAt(0).toUpperCase() + level.slice(1)}
    </button>
);

interface IdentitiesContentProps {
    theme: TrigTheme;
}

// The main Identities Content component with level filter
export const IdentitiesContent: React.FC<IdentitiesContentProps> = ({ theme }) => {
    const [levelFilter, setLevelFilter] = React.useState<IdentityLevel>('all');

    const show = (level: 'basic' | 'intermediate' | 'advanced') =>
        levelFilter === 'all' || levelFilter === level;

    return (
        <div className="space-y-1">
            {/* Level Filter Toggle */}
            <div className="flex gap-1 mb-3 pb-3 border-b border-ui-border">
                <LevelBtn level="all" current={levelFilter} onClick={() => setLevelFilter('all')} />
                <LevelBtn level="basic" current={levelFilter} onClick={() => setLevelFilter('basic')} />
                <LevelBtn level="intermediate" current={levelFilter} onClick={() => setLevelFilter('intermediate')} />
                <LevelBtn level="advanced" current={levelFilter} onClick={() => setLevelFilter('advanced')} />
            </div>

            <div className="max-h-[55vh] overflow-y-auto pr-2 -mr-2 space-y-1">
                {/* ============ BASIC LEVEL ============ */}
                {show('basic') && (
                    <>
                        {/* BASIC DEFINITIONS (SOH CAH TOA) */}
                        <Category title="Basic Definitions" level="Basic" />
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <Card color={theme.sin}>
                                <Fn name="sin" /> = <Frac n="o" d="h" color={theme.sin} />
                            </Card>
                            <Card color={theme.cos}>
                                <Fn name="cos" /> = <Frac n="a" d="h" color={theme.cos} />
                            </Card>
                            <Card color={theme.tan}>
                                <Fn name="tan" /> = <Frac n="o" d="a" color={theme.tan} />
                            </Card>
                        </div>

                        {/* RECIPROCAL IDENTITIES */}
                        <Category title="Reciprocal Identities" level="Basic" />
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <Card color={theme.csc}>
                                <Fn name="csc" /> = <Frac n="1" d={<Fn name="sin" />} />
                            </Card>
                            <Card color={theme.sec}>
                                <Fn name="sec" /> = <Frac n="1" d={<Fn name="cos" />} />
                            </Card>
                            <Card color={theme.cot}>
                                <Fn name="cot" /> = <Frac n="1" d={<Fn name="tan" />} />
                            </Card>
                        </div>

                        {/* RECIPROCALS ALTERNATE (directly beneath) */}
                        <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                            <Card color={theme.sin}>
                                <Fn name="sin" /> = <Frac n="1" d={<Fn name="csc" />} />
                            </Card>
                            <Card color={theme.cos}>
                                <Fn name="cos" /> = <Frac n="1" d={<Fn name="sec" />} />
                            </Card>
                            <Card color={theme.tan}>
                                <Fn name="tan" /> = <Frac n="1" d={<Fn name="cot" />} />
                            </Card>
                        </div>
                        <p className="text-[10px] text-ui-text-muted opacity-70 mt-1 italic">
                            Flip the fraction upside down
                        </p>
                    </>
                )}

                {/* ============ INTERMEDIATE LEVEL ============ */}
                {show('intermediate') && (
                    <>
                        {/* QUOTIENT IDENTITIES */}
                        <Category title="Quotient Identities" level="Intermediate" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Card color={theme.tan}>
                                <Fn name="tan" /> = <Frac n={<Fn name="sin" />} d={<Fn name="cos" />} />
                            </Card>
                            <Card color={theme.cot}>
                                <Fn name="cot" /> = <Frac n={<Fn name="cos" />} d={<Fn name="sin" />} />
                            </Card>
                        </div>

                        {/* PYTHAGOREAN IDENTITIES */}
                        <Category title="Pythagorean Identities" level="Intermediate" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" sup="²" />θ + <Fn name="cos" sup="²" />θ = 1
                            </Card>
                            <Card>
                                <Fn name="tan" sup="²" />θ + 1 = <Fn name="sec" sup="²" />θ
                            </Card>
                            <Card>
                                1 + <Fn name="cot" sup="²" />θ = <Fn name="csc" sup="²" />θ
                            </Card>
                        </div>
                        <p className="text-[10px] text-ui-text-muted opacity-70 mt-1 italic">
                            From a² + b² = c² on the unit circle
                        </p>

                        {/* COMPLEMENTARY (CO-) IDENTITIES */}
                        <Category title='Complementary "co-" Identities' level="Intermediate" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" />θ = <Fn name="cos" />(90° − θ)
                            </Card>
                            <Card>
                                <Fn name="tan" />θ = <Fn name="cot" />(90° − θ)
                            </Card>
                            <Card>
                                <Fn name="sec" />θ = <Fn name="csc" />(90° − θ)
                            </Card>
                        </div>
                        <p className="text-[10px] text-ui-text-muted opacity-70 mt-1 italic">
                            "co-" = complementary angle (90° − θ)
                        </p>
                    </>
                )}

                {/* ============ ADVANCED LEVEL ============ */}
                {show('advanced') && (
                    <>
                        {/* DOUBLE ANGLE */}
                        <Category title="Double Angle" level="Advanced" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" />2θ = 2<Fn name="sin" />θ<Fn name="cos" />θ
                            </Card>
                            <Card>
                                <Fn name="cos" />2θ = <Fn name="cos" sup="²" />θ − <Fn name="sin" sup="²" />θ
                            </Card>
                        </div>

                        {/* HALF ANGLE */}
                        <Category title="Half Angle" level="Advanced" />
                        <div className="space-y-2 text-sm">
                            <Card>
                                <Fn name="sin" /><Frac n="θ" d="2" /> = ±√<Frac n={<>1 − <Fn name="cos" />θ</>} d="2" />
                            </Card>
                            <Card>
                                <Fn name="cos" /><Frac n="θ" d="2" /> = ±√<Frac n={<>1 + <Fn name="cos" />θ</>} d="2" />
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

