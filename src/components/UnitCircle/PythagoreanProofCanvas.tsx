import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface PythagoreanProofCanvasProps {
    step: number;
    width?: number;
    height?: number;
}

interface Triangle {
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    p3: { x: number; y: number };
}

// Animated label positions
interface LabelPositions {
    topA: number;   // x position of 'a' on top edge
    topB: number;   // x position of 'b' on top edge
    leftA: number;  // y position of 'a' on left edge
    leftB: number;  // y position of 'b' on left edge
}

export const PythagoreanProofCanvas: React.FC<PythagoreanProofCanvasProps> = ({
    step,
    width = 280,
    height = 280,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trianglesRef = useRef<Triangle[]>([]);
    const labelsRef = useRef<LabelPositions | null>(null);
    const [, setTick] = useState(0);

    const padding = 30;
    const S = width - padding * 2;
    const a = S * 0.4;
    const b = S * 0.6;
    const ox = padding;
    const oy = padding;

    // Label positions for each step
    // Step 1: Top b|a (b at start, a at end), Left a|b (a at top, b at bottom)
    // Step 2: Top a|b (a at start, b at end), Left b|a (b at top, a at bottom)
    const getLabels1 = useCallback((): LabelPositions => ({
        topA: ox + b + a / 2,  // 'a' on right side of top
        topB: ox + b / 2,      // 'b' on left side of top
        leftA: oy + a / 2,     // 'a' at top of left
        leftB: oy + a + b / 2, // 'b' at bottom of left
    }), [ox, oy, a, b]);

    const getLabels2 = useCallback((): LabelPositions => ({
        topA: ox + a / 2,      // 'a' on left side of top
        topB: ox + a + b / 2,  // 'b' on right side of top
        leftA: oy + b + a / 2, // 'a' at bottom of left
        leftB: oy + b / 2,     // 'b' at top of left
    }), [ox, oy, a, b]);

    // Triangle configs
    const getConfig1 = useCallback((): Triangle[] => [
        { p1: { x: ox, y: oy }, p2: { x: ox + b, y: oy }, p3: { x: ox, y: oy + a } },
        { p1: { x: ox + S, y: oy }, p2: { x: ox + b, y: oy }, p3: { x: ox + S, y: oy + b } },
        { p1: { x: ox + a, y: oy + S }, p2: { x: ox + S, y: oy + S }, p3: { x: ox + S, y: oy + b } },
        { p1: { x: ox, y: oy + a }, p2: { x: ox, y: oy + S }, p3: { x: ox + a, y: oy + S } },
    ], [ox, oy, S, a, b]);

    const getConfig2 = useCallback((): Triangle[] => [
        { p1: { x: ox + a, y: oy + b }, p2: { x: ox + b + a, y: oy + b }, p3: { x: ox + a, y: oy + a + b } },
        { p1: { x: ox + S - b, y: oy }, p2: { x: ox + b - b, y: oy }, p3: { x: ox + S - b, y: oy + b } },
        { p1: { x: ox + a, y: oy + S }, p2: { x: ox + S, y: oy + S }, p3: { x: ox + S, y: oy + b } },
        { p1: { x: ox, y: oy + a - a }, p2: { x: ox, y: oy + S - a }, p3: { x: ox + a, y: oy + S - a } },
    ], [ox, oy, S, a, b]);

    useEffect(() => {
        const config1 = getConfig1();
        const config2 = getConfig2();
        const labels1 = getLabels1();
        const labels2 = getLabels2();

        if (step === 0) {
            trianglesRef.current = [];
            labelsRef.current = null;
            setTick(t => t + 1);
        } else if (step === 1) {
            // Initialize labels
            if (!labelsRef.current) {
                labelsRef.current = { ...labels1 };
            } else {
                // Animate labels to step 1 positions
                gsap.to(labelsRef.current, {
                    topA: labels1.topA, topB: labels1.topB,
                    leftA: labels1.leftA, leftB: labels1.leftB,
                    duration: 0.8, ease: 'power2.inOut',
                    onUpdate: () => setTick(t => t + 1)
                });
            }
            // Initialize or animate triangles
            if (trianglesRef.current.length === 0) {
                trianglesRef.current = config1.map(t => ({ p1: { ...t.p1 }, p2: { ...t.p2 }, p3: { ...t.p3 } }));
            } else {
                config1.forEach((target, i) => {
                    gsap.to(trianglesRef.current[i].p1, { x: target.p1.x, y: target.p1.y, duration: 0.8, ease: 'power2.inOut', onUpdate: () => setTick(t => t + 1) });
                    gsap.to(trianglesRef.current[i].p2, { x: target.p2.x, y: target.p2.y, duration: 0.8, ease: 'power2.inOut' });
                    gsap.to(trianglesRef.current[i].p3, { x: target.p3.x, y: target.p3.y, duration: 0.8, ease: 'power2.inOut' });
                });
            }
            setTick(t => t + 1);
        } else if (step === 2) {
            // Initialize if needed
            if (!labelsRef.current) {
                labelsRef.current = { ...labels1 };
            }
            if (trianglesRef.current.length === 0) {
                trianglesRef.current = config1.map(t => ({ p1: { ...t.p1 }, p2: { ...t.p2 }, p3: { ...t.p3 } }));
            }
            setTimeout(() => {
                // Animate labels to step 2 positions
                gsap.to(labelsRef.current!, {
                    topA: labels2.topA, topB: labels2.topB,
                    leftA: labels2.leftA, leftB: labels2.leftB,
                    duration: 1.2, ease: 'power2.inOut',
                    onUpdate: () => setTick(t => t + 1)
                });
                // Animate triangles
                config2.forEach((target, i) => {
                    gsap.to(trianglesRef.current[i].p1, { x: target.p1.x, y: target.p1.y, duration: 1.2, ease: 'power2.inOut', onUpdate: () => setTick(t => t + 1) });
                    gsap.to(trianglesRef.current[i].p2, { x: target.p2.x, y: target.p2.y, duration: 1.2, ease: 'power2.inOut' });
                    gsap.to(trianglesRef.current[i].p3, { x: target.p3.x, y: target.p3.y, duration: 1.2, ease: 'power2.inOut' });
                });
            }, 50);
        }
    }, [step, getConfig1, getConfig2, getLabels1, getLabels2]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);

        // Outer square
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, S, S);

        // Animated edge labels (step 1 and 2)
        if ((step === 1 || step === 2) && labelsRef.current) {
            const labels = labelsRef.current;
            ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Top edge labels
            ctx.fillStyle = '#3b82f6';
            ctx.fillText('a', labels.topA, oy - 14);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('b', labels.topB, oy - 14);

            // Left edge labels (rotated)
            ctx.save();
            ctx.translate(ox - 14, labels.leftA);
            ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fillText('a', 0, 0);
            ctx.restore();

            ctx.save();
            ctx.translate(ox - 14, labels.leftB);
            ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('b', 0, 0);
            ctx.restore();

            // Draw the segment lines based on current label positions
            ctx.lineWidth = 3;
            // Top segments (derive from label positions)
            const topAStart = step === 1 ? ox + b : ox;
            const topAEnd = step === 1 ? ox + S : ox + a;
            const topBStart = step === 1 ? ox : ox + a;
            const topBEnd = step === 1 ? ox + b : ox + S;

            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath(); ctx.moveTo(topAStart, oy - 6); ctx.lineTo(topAEnd, oy - 6); ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath(); ctx.moveTo(topBStart, oy - 6); ctx.lineTo(topBEnd, oy - 6); ctx.stroke();

            // Left segments
            const leftAStart = step === 1 ? oy : oy + b;
            const leftAEnd = step === 1 ? oy + a : oy + S;
            const leftBStart = step === 1 ? oy + a : oy;
            const leftBEnd = step === 1 ? oy + S : oy + b;

            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath(); ctx.moveTo(ox - 6, leftAStart); ctx.lineTo(ox - 6, leftAEnd); ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath(); ctx.moveTo(ox - 6, leftBStart); ctx.lineTo(ox - 6, leftBEnd); ctx.stroke();
        }

        // Triangle colors
        const colors = ['#219654', '#3267BF', '#AF3E7D', '#B85D21'];
        const labels = ['I', 'II', 'III', 'IV'];

        trianglesRef.current.forEach((tri, i) => {
            ctx.beginPath();
            ctx.moveTo(tri.p1.x, tri.p1.y);
            ctx.lineTo(tri.p2.x, tri.p2.y);
            ctx.lineTo(tri.p3.x, tri.p3.y);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label at centroid
            const cx = (tri.p1.x + tri.p2.x + tri.p3.x) / 3;
            const cy = (tri.p1.y + tri.p2.y + tri.p3.y) / 3;
            ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], cx, cy);

            // c label on hypotenuse
            if (step >= 1) {
                const mx = (tri.p2.x + tri.p3.x) / 2;
                const my = (tri.p2.y + tri.p3.y) / 2;
                ctx.font = 'bold 9px Inter, system-ui, sans-serif';
                ctx.fillStyle = '#22d3ee';
                ctx.fillText('c', mx, my);
            }
        });

        // c² square (step 1)
        if (step === 1 && trianglesRef.current.length === 4) {
            ctx.beginPath();
            ctx.moveTo(ox + b, oy);
            ctx.lineTo(ox + S, oy + b);
            ctx.lineTo(ox + a, oy + S);
            ctx.lineTo(ox, oy + a);
            ctx.closePath();
            ctx.fillStyle = 'rgba(45, 212, 191, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.font = 'bold 18px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#2dd4bf';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('c²', ox + S / 2, oy + S / 2);
        }

        // a² and b² (step 2)
        if (step === 2) {
            // a² at BOTTOM-LEFT
            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.fillRect(ox, oy + b, a, a);
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
            ctx.strokeRect(ox, oy + b, a, a);
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#3b82f6';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('a²', ox + a / 2, oy + b + a / 2);

            // b² at TOP-RIGHT
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.fillRect(ox + a, oy, b, b);
            ctx.strokeStyle = '#ef4444';
            ctx.strokeRect(ox + a, oy, b, b);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('b²', ox + a + b / 2, oy + b / 2);
        }
    });

    return <canvas ref={canvasRef} className="rounded-lg border border-slate-600" />;
};
