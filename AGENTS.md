# AGENTS.md

Instructions for AI agents working on this codebase.

## Project Overview

**TrigFlow** is an interactive educational web app for visualizing trigonometric concepts. It uses React, TypeScript, Canvas 2D, and GSAP animations.

## Architecture

```
src/
├── components/
│   ├── UnitCircle/           # Main visualization components
│   │   ├── UnitCircle.tsx    # Main container with state management
│   │   ├── UnitCircleRenderer.ts # Canvas drawing (imports from canvas/)
│   │   ├── canvas/           # Extracted canvas helpers
│   │   │   └── helpers.ts    # drawLine, drawText, drawPoint, drawQuadrants
│   │   ├── LessonPanel.tsx   # Lesson content & selection
│   │   ├── Controls.tsx      # Toggle controls (uses theme colors)
│   │   ├── DiagramPanel.tsx  # Proof stepper container
│   │   └── steppers/         # Interactive proof steppers
│   ├── TrigGraph.tsx         # Waveform graphs
│   └── shared/               # Reusable UI components
├── hooks/
│   └── useCanvas.ts          # Canvas rendering hook
├── types/
│   └── index.ts              # TypeScript interfaces (SINGLE SOURCE)
├── theme/
│   └── colors.ts             # Color definitions (LIGHT_THEME, DARK_THEME)
└── utils/
    └── math.ts               # Math utilities (toRad, toDeg, etc.)
```

## Key Patterns

1. **Canvas Rendering**: Use `UnitCircleRenderer.ts` for drawing. Helper functions are in `canvas/helpers.ts`.

2. **GSAP Animations**: Use GSAP timelines for sequenced animations. Always update React state in `onUpdate` callbacks.

3. **Lesson System**: Add new lessons to `LESSONS` array in `LessonPanel.tsx`. Each lesson has an `apply()` function that sets toggles.

4. **Type Definitions**: Types are defined ONCE in `types/index.ts`. Import from there, never duplicate.

5. **Theme Colors**: Pass theme via props, never hardcode hex values in components. See `STYLING-GUIDE.md`.

## Avoiding Common Errors

### TypeScript/Lint Prevention

1. **Unused imports**: Remove imports when extracting code to new files
2. **Duplicate types**: Always import from `types/index.ts`, never redefine
3. **Hardcoded colors**: Use `theme.sin`, `theme.cos`, etc. from props
4. **Missing props**: When adding props to a component, update all call sites

### Build Verification

Always run after significant changes:
```bash
npm run build    # Catches TypeScript errors
npm run lint     # Catches style issues
```

## Adding Features

1. **New Toggle**: Add to `UnitCircleToggles` interface in `types/index.ts`
2. **New Drawing**: Add to `UnitCircleRenderer.ts`, use helpers from `canvas/helpers.ts`
3. **New Lesson**: Add to `LESSONS` array in `LessonPanel.tsx`
4. **New Helper**: Add to `canvas/helpers.ts` with JSDoc comment

