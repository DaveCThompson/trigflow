import React, { useRef, useEffect } from 'react';
import { UnitCircleState } from './UnitCircle/UnitCircleRenderer';
import { mapRange, toRad } from '../utils/math';

interface TrigGraphProps {
    trace: Array<{ angle: number, values: { sin: number, cos: number, tan: number, cot: number, sec: number, csc: number } }>;
    toggles: UnitCircleState['toggles'];
    theme: UnitCircleState['theme'];
    angleUnit: 'deg' | 'rad';
    onReset: () => void;
    currentAngle: number;
}

const SingleGraph: React.FC<{
    dataKey: keyof TrigGraphProps['trace'][0]['values'];
    label: string;
    color: string;
    trace: TrigGraphProps['trace'];
    theme: UnitCircleState['theme'];
    angleUnit: 'deg' | 'rad';
    currentAngle: number;
}> = ({ dataKey, label, color, trace, theme, angleUnit, currentAngle }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;

        // Clear
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, W, H);

        // Config
        const PADDING_TOP = 15;
        const PADDING_BOTTOM = 25;
        const PADDING_LEFT = 35; // Space for Y-axis labels
        const PADDING_RIGHT = 15;

        const GRAPH_W = W - PADDING_LEFT - PADDING_RIGHT;


        // Y-Axis Range
        // Sin/Cos: Max 1 (use 1.1 for padding)
        // Others: Max 10
        const isBounded = dataKey === 'sin' || dataKey === 'cos';
        const Y_RANGE = isBounded ? 1.1 : 10;

        const mapX = (deg: number) => mapRange(deg, 0, 360, PADDING_LEFT, PADDING_LEFT + GRAPH_W);
        const mapY = (val: number) => mapRange(val, -Y_RANGE, Y_RANGE, H - PADDING_BOTTOM, PADDING_TOP);

        // Grid
        ctx.lineWidth = 1;
        ctx.strokeStyle = theme.grid;
        ctx.beginPath();

        // Ref lines at +1/-1 or +10/-10 (dashed)
        ctx.setLineDash([4, 4]);

        let displayY = [1, -1];
        if (!isBounded) displayY = [10, -10];

        // Specific fix for Sine/Cosine Min/Max markers requested by user
        // For Sine: Min at 270 (-1), Max at 90 (1)
        // For Cosine: Min at 180 (-1), Max at 0 (1)

        displayY.forEach(val => {
            const y = mapY(val);
            ctx.moveTo(PADDING_LEFT, y);
            ctx.lineTo(W - PADDING_RIGHT, y);
        });
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid

        ctx.beginPath();

        // Zero horizontal line (X-axis in chart terminology, but usually Y=0)
        const y0 = mapY(0);
        ctx.moveTo(PADDING_LEFT, y0);
        ctx.lineTo(W - PADDING_RIGHT, y0);

        // Zero vertical line (Y-axis visually)
        // Since we map 0..360, x=0 is at PADDING_LEFT
        const x0 = mapX(0);
        ctx.moveTo(x0, PADDING_TOP);
        ctx.lineTo(x0, H - PADDING_BOTTOM);

        ctx.stroke();

        // Vertical line at current angle (faint indicator)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        const currentX = mapX(currentAngle);
        ctx.moveTo(currentX, PADDING_TOP);
        ctx.lineTo(currentX, H - PADDING_BOTTOM);
        ctx.stroke();
        ctx.setLineDash([]);

        // X-Axis Labels (0, 90, 180, 270, 360)
        ctx.fillStyle = theme.text;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";

        [0, 90, 180, 270, 360].forEach(deg => {
            const labelTxt = angleUnit === 'rad'
                ? (deg === 0 ? "0" : (deg === 90 ? "π/2" : (deg === 180 ? "π" : (deg === 270 ? "3π/2" : "2π"))))
                : deg + "°";
            ctx.fillText(labelTxt, mapX(deg), H - 5);
        });

        // Y-Axis Labels
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const yLabels = isBounded ? [1, 0, -1] : [10, 0, -10];

        yLabels.forEach(val => {
            const y = mapY(val);
            // Label string
            let str = val.toString();
            if (val > 0) str = "+" + str;

            ctx.fillText(str, PADDING_LEFT - 5, y);
        });

        // Plot
        if (trace.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            let first = true;
            // Ensure sorted
            const sorted = [...trace].sort((a, b) => a.angle - b.angle);

            for (const pt of sorted) {
                const x = mapX(pt.angle);
                const val = pt.values[dataKey];

                // Handle discontinuities (asymptotes)
                if (Math.abs(val) > Y_RANGE) {
                    first = true;
                    continue;
                }

                const y = mapY(val);

                if (first) {
                    ctx.moveTo(x, y);
                    first = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // --- Current Value Dot ---
        const currentRad = toRad(currentAngle);
        let currentVal = 0;
        if (dataKey === 'sin') currentVal = Math.sin(currentRad);
        else if (dataKey === 'cos') currentVal = Math.cos(currentRad);
        else if (dataKey === 'tan') currentVal = Math.tan(currentRad);
        else if (dataKey === 'cot') currentVal = 1 / Math.tan(currentRad);
        else if (dataKey === 'sec') currentVal = 1 / Math.cos(currentRad);
        else if (dataKey === 'csc') currentVal = 1 / Math.sin(currentRad);

        // Only draw if within visual range
        if (Math.abs(currentVal) <= Y_RANGE) {
            const dotX = mapX(currentAngle);
            const dotY = mapY(currentVal);

            ctx.beginPath();
            ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
            ctx.fillStyle = theme.bg;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        }

    }, [trace, theme, angleUnit, color, dataKey, currentAngle]);

    return (
        <div className="mb-2 last:mb-0">
            <div className="flex justify-between items-center px-1 mb-1">
                <span className="text-xs font-bold uppercase" style={{ color }}>{label}</span>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-[120px] rounded border border-slate-100 dark:border-slate-700 bg-white dark:bg-gray-800"
            />
        </div>
    );
};

export const TrigGraph: React.FC<TrigGraphProps> = ({ trace, toggles, theme, angleUnit, onReset, currentAngle }) => {
    // Collect active graphs
    const activeGraphs = [];
    if (toggles.sin) activeGraphs.push({ key: 'sin', label: 'Sine', color: theme.sin });
    if (toggles.cos) activeGraphs.push({ key: 'cos', label: 'Cosine', color: theme.cos });
    if (toggles.tan) activeGraphs.push({ key: 'tan', label: 'Tangent', color: theme.tan });
    if (toggles.cot) activeGraphs.push({ key: 'cot', label: 'Cotangent', color: theme.cot });
    if (toggles.sec) activeGraphs.push({ key: 'sec', label: 'Secant', color: theme.sec });
    if (toggles.csc) activeGraphs.push({ key: 'csc', label: 'Cosecant', color: theme.csc });

    return (
        <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Graphs</h3>
                <button
                    onClick={onReset}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-4">
                {activeGraphs.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm italic border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                        Toggle functions to see graphs
                    </div>
                )}
                {activeGraphs.map(g => (
                    <SingleGraph
                        key={g.key}
                        dataKey={g.key as any}
                        label={g.label}
                        color={g.color}
                        trace={trace}
                        theme={theme}
                        angleUnit={angleUnit}
                        currentAngle={currentAngle}
                    />
                ))}
            </div>
        </div>
    );
};
