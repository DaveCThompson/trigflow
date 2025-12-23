import React from 'react';
import { UnitCircleState } from './UnitCircleRenderer';
import { formatNumber } from '../../utils/math';

const ValueDisplay: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 font-mono text-sm">
            <span className="font-bold opacity-80" style={{ color }}>{label}</span>
            <span className="text-gray-600 dark:text-gray-400 tabular-nums">{formatNumber(value)}</span>
        </div>
    );
};

export const ReadoutPanel: React.FC<{
    trigValues: { cos: number; sin: number; tan: number; cot: number; sec: number; csc: number; };
    toggles: UnitCircleState['toggles'];
    theme: UnitCircleState['theme'];
}> = ({ trigValues, toggles, theme }) => {
    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                Values
            </h2>
            <div className="space-y-1">
                {toggles.sin && <ValueDisplay label="sin(θ)" value={trigValues.sin} color={theme.sin} />}
                {toggles.showXY && toggles.sin && <ValueDisplay label="y" value={trigValues.sin} color={theme.sin} />}
                {toggles.cos && <ValueDisplay label="cos(θ)" value={trigValues.cos} color={theme.cos} />}
                {toggles.showXY && toggles.cos && <ValueDisplay label="x" value={trigValues.cos} color={theme.cos} />}
                {toggles.tan && <ValueDisplay label="tan(θ)" value={trigValues.tan} color={theme.tan} />}
                {toggles.cot && <ValueDisplay label="cot(θ)" value={trigValues.cot} color={theme.cot} />}
                {toggles.sec && <ValueDisplay label="sec(θ)" value={trigValues.sec} color={theme.sec} />}
                {toggles.csc && <ValueDisplay label="csc(θ)" value={trigValues.csc} color={theme.csc} />}
            </div>
        </div>
    );
};
