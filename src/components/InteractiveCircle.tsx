import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTrigMath } from '../hooks/useTrigMath';

interface InteractiveCircleProps {
    className?: string;
}

export const InteractiveCircle: React.FC<InteractiveCircleProps> = ({ className }) => {
    const {
        theta,
        sin, cos, tan, cot,
        setAngleFromMouse,
        deg
    } = useTrigMath(45); // Start at 45 deg

    const svgRef = useRef<SVGSVGElement>(null);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.buttons !== 1) return; // Only drag on left click
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();

        // Transform mouse client coordinates to SVG 0,0 centered coordinates
        // SVG ViewBox is likely -2.2 to 2.2
        // We can just calculate relative to center of rect
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = e.clientX - centerX;
        const y = e.clientY - centerY;

        // In Cartesian: Y is up. In CSS: Y is down.
        // So Cartesian Y = -CSS delta Y

        setAngleFromMouse(x, y);
        // Note: useTrigMath expects (x, y) where Y is CSS Y (down), and handles the flip internally?
        // Let's check useTrigMath: `Math.atan2(-y, x)`. 
        // If my input `y` here is (mouseY - centerY), then +y is DOWN.
        // So `-y` is UP. Correct.
    };

    // SVG coordinate system helpers
    // We will use viewBox="-2.2 -2.2 4.4 4.4"
    // Center is 0,0.
    // X goes right. Y goes down.
    // So math (x,y) -> svg (x, -y).

    // Coordinates
    const P = { x: cos, y: -sin };
    const CosPt = { x: cos, y: 0 };
    // Tan point: starts at (1,0), goes up/down to (1, -tan)
    const TanEnd = { x: 1, y: -tan };
    // Cot point: starts at (0, -1), goes left/right to (cot, -1)
    const CotEnd = { x: cot, y: -1 };

    // Styles for "Neon/Glowing" look
    const strokeWidth = 0.03;
    const axisColor = "#334155"; // slate-700
    const circleColor = "#475569"; // slate-600

    return (
        <div className={clsx("flex flex-col items-center gap-4", className)}>
            <div className="relative w-full max-w-2xl aspect-square p-4">
                <svg
                    ref={svgRef}
                    viewBox="-2.2 -2.2 4.4 4.4"
                    className="w-full h-full bg-slate-900 rounded-xl shadow-2xl cursor-crosshair touch-none select-none"
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerMove} // Allow click to jump
                >
                    <defs>
                        {/* Glow filters could go here */}
                    </defs>

                    {/* Grid / Axes */}
                    <line x1="-2.2" y1="0" x2="2.2" y2="0" stroke={axisColor} strokeWidth={strokeWidth / 2} />
                    <line x1="0" y1="-2.2" x2="0" y2="2.2" stroke={axisColor} strokeWidth={strokeWidth / 2} />

                    {/* Unit Circle */}
                    <circle cx="0" cy="0" r="1" fill="none" stroke={circleColor} strokeWidth={strokeWidth} />

                    {/* --- VISUALIZATIONS --- */}

                    {/* Cotangent Line (y=1) -> SVG y=-1 */}
                    <line
                        x1="0" y1="-1" x2={cot} y2="-1"
                        stroke="#22c55e" strokeWidth={strokeWidth}
                        className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    />
                    {/* Connector from Origin to Cot (Radius extension) */}
                    {/* Only show if sin > 0 else it shoots down? Cot is usually defined on the top line y=1 */}
                    <line
                        x1="0" y1="0" x2={cot} y2="-1"
                        stroke="#22c55e" strokeWidth={strokeWidth / 3} strokeDasharray="0.05, 0.05"
                        opacity={0.5}
                    />


                    {/* Tangent Line (x=1) */}
                    <line
                        x1="1" y1="0" x2={1} y2={-tan}
                        stroke="#f59e0b" strokeWidth={strokeWidth}
                        className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    />
                    {/* Connector from Origin to Tan (Radius extension) */}
                    <line
                        x1="0" y1="0" x2={1} y2={-tan}
                        stroke="#f59e0b" strokeWidth={strokeWidth / 3} strokeDasharray="0.05, 0.05"
                        opacity={0.5}
                    />

                    {/* Cosine (BLUE) */}
                    <line
                        x1="0" y1="0" x2={cos} y2="0"
                        stroke="#3b82f6" strokeWidth={strokeWidth}
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />

                    {/* Sine (RED) */}
                    <line
                        x1={cos} y1="0" x2={cos} y2={-sin}
                        stroke="#ef4444" strokeWidth={strokeWidth}
                        className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    />

                    {/* Hypotenuse / Radius (WHITE/PURPLE) */}
                    <line
                        x1="0" y1="0" x2={P.x} y2={P.y}
                        stroke="#fff" strokeWidth={strokeWidth}
                    />

                    {/* Points */}
                    <circle cx={P.x} cy={P.y} r={0.06} fill="white" />

                </svg>
            </div>

            {/* Info Panel */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl bg-slate-900 p-6 rounded-xl border border-slate-800">
                <Metric label="θ (deg)" value={deg.toFixed(1)} color="text-white" />
                <Metric label="sin(θ)" value={sin.toFixed(3)} color="text-red-500" />
                <Metric label="cos(θ)" value={cos.toFixed(3)} color="text-blue-500" />
                <Metric label="tan(θ)" value={tan.toFixed(3)} color="text-amber-500" />
                <Metric label="cot(θ)" value={cot.toFixed(3)} color="text-green-500" />
            </div>
        </div>
    );
};

const Metric = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex flex-col">
        <span className="text-xs text-slate-400 font-mono mb-1">{label}</span>
        <span className={clsx("text-2xl font-bold font-mono", color)}>{value}</span>
    </div>
);
