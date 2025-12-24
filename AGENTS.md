# AGENTS.md

Instructions for AI agents working on this codebase.

## Project Overview

**TrigFlow** is an interactive educational web app for visualizing trigonometric concepts. It uses React, TypeScript, Canvas 2D, and GSAP animations.

## Architecture

```
src/
├── components/
│   └── UnitCircle/           # Main visualization components
│       ├── UnitCircle.tsx    # Main container with state management
│       ├── UnitCircleRenderer.ts # Canvas drawing logic
│       ├── PythagoreanProofCanvas.tsx # Standalone animated proof
│       ├── LessonPanel.tsx   # Lesson content & selection
│       ├── DiagramPanel.tsx  # Proof stepper container
│       ├── TrigGraph.tsx     # Waveform graphs
│       └── steppers/         # Interactive proof steppers
├── hooks/
│   ├── useCanvas.ts          # Canvas rendering hook
│   └── useTrigMath.ts        # Trigonometric calculations
├── types/
│   └── index.ts              # TypeScript interfaces
└── themes/                   # Color themes
```

## Key Patterns

1. **Canvas Rendering**: Use `UnitCircleRenderer.ts` for drawing on the unit circle canvas. Access via `state.toggles` for conditional rendering.

2. **GSAP Animations**: Use GSAP timelines for sequenced animations. Always update React state in `onUpdate` callbacks for re-renders.

3. **Lesson System**: Add new lessons to `LESSONS` array in `LessonPanel.tsx`. Each lesson has an `apply()` function that sets toggles.

4. **Standalone Proofs**: Create separate canvas components (like `PythagoreanProofCanvas.tsx`) for complex proofs that don't overlay the unit circle.

## Code Style

- Functional React components with hooks
- TypeScript strict mode
- Tailwind CSS for styling
- Canvas 2D for mathematical visualizations
- GSAP for smooth animations

## Testing

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
```

## Adding Features

1. **New Toggle**: Add to `UnitCircleToggles` interface in `types/index.ts`
2. **New Drawing**: Add conditional block in `UnitCircleRenderer.ts`
3. **New Lesson**: Add to `LESSONS` array in `LessonPanel.tsx`
4. **New Stepper**: Create in `steppers/` folder, add to `DiagramPanel.tsx`
