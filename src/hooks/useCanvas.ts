import { useRef, useEffect } from 'react';

export const useCanvas = (
    draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void,
    options: {
        width: number,
        height: number,
        animate?: boolean
    }
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const frameCountRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            frameCountRef.current++;

            // Handle DPI scaling
            const dpr = window.devicePixelRatio || 1;
            const { width, height } = options;

            // Set display size (css pixels)
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Set actual size in memory (scaled to account for extra pixel density)
            if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                // Normalize coordinate system to use css pixels
                ctx.scale(dpr, dpr);
            }

            // Check if context has lost scale through reset/clear
            // We use save/restore in draw usually, but to be safe we can rely on 
            // the width/height check above to re-scale if needed.
            // For robust animation loops we often just clear and redraw.

            // It's often safer to reset transform and scale every frame if we clear everything
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            draw(ctx, frameCountRef.current);

            if (options.animate) {
                requestRef.current = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [draw, options.animate, options.width, options.height]);

    return canvasRef;
};
