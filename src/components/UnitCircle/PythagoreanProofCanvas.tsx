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

interface LabelPositions {
    topA: number;
    topB: number;
    leftA: number;
    leftB: number;
}

interface Opacities {
    c2: number;
    a2b2: number;
}

export const PythagoreanProofCanvas: React.FC<PythagoreanProofCanvasProps> = ({
    step,
    width = 280,
    height = 280,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trianglesRef = useRef<Triangle[]>([]);
    const labelsRef = useRef<LabelPositions | null>(null);
    const opacitiesRef = useRef<Opacities>({ c2: 0, a2b2: 0 });
    const [, setTick] = useState(0);

    const padding = 30;
    const S = width - padding * 2;
    const a = S * 0.4;
    const b = S * 0.6;
    const ox = padding;
    const oy = padding;

    const getLabels1 = useCallback((): LabelPositions => ({
        topA: ox + b + a / 2, topB: ox + b / 2,
        leftA: oy + a / 2, leftB: oy + a + b / 2,
    }), [ox, oy, a, b]);

    const getLabels2 = useCallback((): LabelPositions => ({
        topA: ox + a / 2, topB: ox + a + b / 2,
        leftA: oy + b + a / 2, leftB: oy + b / 2,
    }), [ox, oy, a, b]);

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
        { p1: { x: ox, y: oy }, p2: { x: ox, y: oy + b }, p3: { x: ox + a, y: oy + b } },
    ], [ox, oy, S, a, b]);

    useEffect(() => {
        const config1 = getConfig1();
        const config2 = getConfig2();
        const labels1 = getLabels1();
        const labels2 = getLabels2();

        if (step === 0) {
            trianglesRef.current = [];
            labelsRef.current = null;
            opacitiesRef.current = { c2: 0, a2b2: 0 };
            setTick(t => t + 1);
        } else if (step === 1) {
            // Step 1: Show triangles and labels, no c²
            if (!labelsRef.current) labelsRef.current = { ...labels1 };
            if (trianglesRef.current.length === 0) {
                trianglesRef.current = config1.map(t => ({ p1: { ...t.p1 }, p2: { ...t.p2 }, p3: { ...t.p3 } }));
                opacitiesRef.current = { c2: 0, a2b2: 0 };
            } else {
                // Coming back from any step - fade out both c² and a²+b²
                gsap.to(opacitiesRef.current, {
                    c2: 0,
                    a2b2: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    onUpdate: () => setTick(t => t + 1)
                });
                // Also reset triangles and labels to config1 positions
                config1.forEach((target, i) => {
                    gsap.to(trianglesRef.current[i].p1, { x: target.p1.x, y: target.p1.y, duration: 0.8, ease: 'power2.inOut', onUpdate: () => setTick(t => t + 1) });
                    gsap.to(trianglesRef.current[i].p2, { x: target.p2.x, y: target.p2.y, duration: 0.8, ease: 'power2.inOut' });
                    gsap.to(trianglesRef.current[i].p3, { x: target.p3.x, y: target.p3.y, duration: 0.8, ease: 'power2.inOut' });
                });
                gsap.to(labelsRef.current!, { ...labels1, duration: 0.8, ease: 'power2.inOut' });
            }
            setTick(t => t + 1);
        } else if (step === 2) {
            // Step 2: Fade in c²
            if (!labelsRef.current) labelsRef.current = { ...labels1 };
            if (trianglesRef.current.length === 0) {
                trianglesRef.current = config1.map(t => ({ p1: { ...t.p1 }, p2: { ...t.p2 }, p3: { ...t.p3 } }));
            }

            if (opacitiesRef.current.a2b2 > 0) {
                // Coming back from step 3: 1. Fade out a²b² → 2. Move triangles → 3. Fade in c²
                const tl = gsap.timeline();
                tl.to(opacitiesRef.current, { a2b2: 0, duration: 0.4, ease: 'power2.out', onUpdate: () => setTick(t => t + 1) });
                tl.add(() => {
                    config1.forEach((target, i) => {
                        gsap.to(trianglesRef.current[i].p1, { x: target.p1.x, y: target.p1.y, duration: 1.0, ease: 'power2.inOut', onUpdate: () => setTick(t => t + 1) });
                        gsap.to(trianglesRef.current[i].p2, { x: target.p2.x, y: target.p2.y, duration: 1.0, ease: 'power2.inOut' });
                        gsap.to(trianglesRef.current[i].p3, { x: target.p3.x, y: target.p3.y, duration: 1.0, ease: 'power2.inOut' });
                    });
                    gsap.to(labelsRef.current!, { ...labels1, duration: 1.0, ease: 'power2.inOut' });
                }, '+=0.1');
                tl.to(opacitiesRef.current, { c2: 1, duration: 0.4, ease: 'power2.in', onUpdate: () => setTick(t => t + 1) }, '+=0.8');
            } else {
                // Coming from step 1: just fade in c²
                gsap.to(opacitiesRef.current, {
                    c2: 1,
                    duration: 0.5,
                    ease: 'power2.in',
                    onUpdate: () => setTick(t => t + 1)
                });
            }
            setTick(t => t + 1);
        } else if (step === 3) {
            // Step 3: 1. Fade out c² → 2. Move triangles/labels → 3. Fade in a²b²
            if (!labelsRef.current) labelsRef.current = { ...labels1 };
            if (trianglesRef.current.length === 0) {
                trianglesRef.current = config1.map(t => ({ p1: { ...t.p1 }, p2: { ...t.p2 }, p3: { ...t.p3 } }));
            }

            const tl = gsap.timeline();
            tl.to(opacitiesRef.current, { c2: 0, duration: 0.4, ease: 'power2.out', onUpdate: () => setTick(t => t + 1) });
            tl.add(() => {
                config2.forEach((target, i) => {
                    gsap.to(trianglesRef.current[i].p1, { x: target.p1.x, y: target.p1.y, duration: 1.0, ease: 'power2.inOut', onUpdate: () => setTick(t => t + 1) });
                    gsap.to(trianglesRef.current[i].p2, { x: target.p2.x, y: target.p2.y, duration: 1.0, ease: 'power2.inOut' });
                    gsap.to(trianglesRef.current[i].p3, { x: target.p3.x, y: target.p3.y, duration: 1.0, ease: 'power2.inOut' });
                });
                gsap.to(labelsRef.current!, { topA: labels2.topA, topB: labels2.topB, leftA: labels2.leftA, leftB: labels2.leftB, duration: 1.0, ease: 'power2.inOut' });
            }, '+=0.1');
            tl.to(opacitiesRef.current, { a2b2: 1, duration: 0.4, ease: 'power2.in', onUpdate: () => setTick(t => t + 1) }, '+=0.8');
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

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, S, S);

        // Edge labels
        if (step >= 1 && labelsRef.current) {
            const labels = labelsRef.current;
            ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#3b82f6';
            ctx.fillText('a', labels.topA, oy - 14);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('b', labels.topB, oy - 14);

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

            ctx.lineWidth = 3;
            const isRearranged = step >= 3; // Steps 3 and 4 use rearranged positions
            const topAStart = isRearranged ? ox : ox + b;
            const topAEnd = isRearranged ? ox + a : ox + S;
            const topBStart = isRearranged ? ox + a : ox;
            const topBEnd = isRearranged ? ox + S : ox + b;

            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath(); ctx.moveTo(topAStart, oy - 6); ctx.lineTo(topAEnd, oy - 6); ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath(); ctx.moveTo(topBStart, oy - 6); ctx.lineTo(topBEnd, oy - 6); ctx.stroke();

            const leftAStart = isRearranged ? oy + b : oy;
            const leftAEnd = isRearranged ? oy + S : oy + a;
            const leftBStart = isRearranged ? oy : oy + a;
            const leftBEnd = isRearranged ? oy + b : oy + S;

            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath(); ctx.moveTo(ox - 6, leftAStart); ctx.lineTo(ox - 6, leftAEnd); ctx.stroke();
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath(); ctx.moveTo(ox - 6, leftBStart); ctx.lineTo(ox - 6, leftBEnd); ctx.stroke();
        }

        // Triangles
        const colors = ['#219654', '#3267BF', '#AF3E7D', '#B85D21'];
        const triLabels = ['I', 'II', 'III', 'IV'];

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

            const cx = (tri.p1.x + tri.p2.x + tri.p3.x) / 3;
            const cy = (tri.p1.y + tri.p2.y + tri.p3.y) / 3;
            ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(triLabels[i], cx, cy);

            // Find hypotenuse (longest edge) for 'c' label
            if (step >= 1) {
                const dist = (a: { x: number, y: number }, b: { x: number, y: number }) =>
                    Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
                const d12 = dist(tri.p1, tri.p2);
                const d23 = dist(tri.p2, tri.p3);
                const d31 = dist(tri.p3, tri.p1);

                let hx1: number, hy1: number, hx2: number, hy2: number;
                if (d12 >= d23 && d12 >= d31) {
                    hx1 = tri.p1.x; hy1 = tri.p1.y; hx2 = tri.p2.x; hy2 = tri.p2.y;
                } else if (d23 >= d12 && d23 >= d31) {
                    hx1 = tri.p2.x; hy1 = tri.p2.y; hx2 = tri.p3.x; hy2 = tri.p3.y;
                } else {
                    hx1 = tri.p3.x; hy1 = tri.p3.y; hx2 = tri.p1.x; hy2 = tri.p1.y;
                }

                const mx = (hx1 + hx2) / 2;
                const my = (hy1 + hy2) / 2;
                ctx.font = 'bold 9px Inter, system-ui, sans-serif';
                ctx.fillStyle = '#22d3ee';
                ctx.fillText('c', mx, my);
            }
        });

        // c² square
        if (step >= 2 && trianglesRef.current.length === 4 && opacitiesRef.current.c2 > 0) {
            ctx.globalAlpha = opacitiesRef.current.c2;
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
            ctx.globalAlpha = 1;
        }

        // a² and b²
        if (opacitiesRef.current.a2b2 > 0) {
            ctx.globalAlpha = opacitiesRef.current.a2b2;

            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.fillRect(ox, oy + b, a, a);
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
            ctx.strokeRect(ox, oy + b, a, a);
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#3b82f6';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('a²', ox + a / 2, oy + b + a / 2);

            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.fillRect(ox + a, oy, b, b);
            ctx.strokeStyle = '#ef4444';
            ctx.strokeRect(ox + a, oy, b, b);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('b²', ox + a + b / 2, oy + b / 2);

            ctx.globalAlpha = 1;
        }
    });

    return <canvas ref={canvasRef} className="rounded-lg border border-slate-600" />;
};
