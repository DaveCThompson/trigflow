import { useState, useMemo } from 'react';
import { getAngleFromPoint, snapAngle } from '../utils/math';

export const useTrigMath = (initialAngleDeg = 45) => {
    // Store internal state in Radians for easier math
    const [theta, setTheta] = useState((initialAngleDeg * Math.PI) / 180);

    const setAngle = (rad: number) => {
        setTheta(snapAngle(rad));
    };

    const setAngleFromMouse = (x: number, y: number) => {
        // Assuming x,y are in Cartesian coordinates relative to center
        const newTheta = getAngleFromPoint(x, -y); // Flip Y because SVG/Screen Y is down, Cartesian Y is up? 
        // Wait, if we use SVG coord system where Y is down:
        // (1, -1) is Top Right (angle 45 deg? No, that's -45 deg in math).
        // Standard Math: Y is UP.
        // SVG: Y is DOWN.
        // So Math Y = -SVG Y.
        // atan2(-svgY, svgX).
        const angle = Math.atan2(-y, x);
        let normalized = angle;
        if (normalized < 0) {
            normalized += 2 * Math.PI;
        }
        setTheta(snapAngle(normalized));
    };

    // Derived values
    const calculations = useMemo(() => {
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);
        const tan = Math.tan(theta);
        const cot = 1 / tan;
        const sec = 1 / cos;
        const csc = 1 / sin;

        return {
            sin,
            cos,
            tan,
            cot,
            sec,
            csc,
            deg: (theta * 180) / Math.PI,
            rad: theta
        };
    }, [theta]);

    return {
        theta,
        setAngle,
        setAngleFromMouse,
        ...calculations
    };
};
