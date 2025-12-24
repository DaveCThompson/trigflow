import React from 'react';
import { UnitCircleState } from './UnitCircleRenderer';
import { formatNumber } from '../../utils/math';

const ValueDisplay: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => {
    return (
        <div className="flex justify-between items-center py-3.5 border-b border-ui-border last:border-0 text-sm group hover:bg-ui-bg-hover px-3 -mx-3 rounded-2xl transition-all duration-200">
            <span className="font-heading font-extrabold opacity-70 group-hover:opacity-100 transition-opacity" style={{ color }}>{label}</span>
            <span className="text-ui-text font-mono font-medium tabular-nums group-hover:scale-105 transition-transform origin-right">{formatNumber(value)}</span>
        </div>
    );
};

export const ReadoutPanel: React.FC<{
    trigValues: { cos: number; sin: number; tan: number; cot: number; sec: number; csc: number; };
    toggles: UnitCircleState['toggles'];
    theme: UnitCircleState['theme'];
}> = ({ trigValues, toggles, theme }) => {
    return (
        <div className="w-full bg-ui-bg-panel rounded-3xl shadow-soft border border-ui-border p-6 h-fit sticky top-6 transition-colors duration-300">
            <h2 className="text-xl font-heading font-extrabold text-ui-text mb-4 border-b border-ui-border pb-4">
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
