# AGENTS.md

Instructions for AI agents working on this codebase.

## Project Overview

**Visual Trig** is an interactive educational web app for visualizing trigonometric concepts. It uses React, TypeScript, Canvas 2D, and GSAP animations.

## Architecture

```
src/
├── components/
│   ├── UnitCircle/           # Main visualization components
│   │   ├── UnitCircle.tsx    # Main container with state management
│   │   ├── UnitCircleRenderer.ts # Canvas drawing (imports from canvas/)
│   │   ├── canvas/           # Extracted canvas helpers
│   │   │   ├── helpers.ts    # drawLine, drawText, drawPoint, drawQuadrants
│   │   │   └── proofs.ts     # Proof visualization functions
│   │   ├── LessonPanel.tsx   # Lesson content & selection
│   │   ├── Controls.tsx      # Toggle controls (uses theme colors)
│   │   ├── DiagramPanel.tsx  # Proof stepper container
│   │   └── steppers/         # Interactive proof steppers
│   ├── TrigGraph.tsx         # Waveform graphs
│   └── shared/               # Reusable UI components
├── context/
│   └── ThemeContext.tsx      # App-level theme provider
├── data/
│   └── lessons.tsx           # Lesson definitions
├── hooks/
│   └── useCanvas.ts          # Canvas rendering hook
├── types/
│   └── index.ts              # TypeScript interfaces (SINGLE SOURCE)
├── theme/
│   ├── colors.ts             # Color definitions (LIGHT_THEME, DARK_THEME)
│   └── overlays.ts           # Alpha-blending utilities (withAlpha, OVERLAY_ALPHA)
└── utils/
    └── math.ts               # Math utilities (toRad, toDeg, etc.)
```

## Key Patterns

1. **Canvas Rendering**: Use `UnitCircleRenderer.ts` for drawing. Helper functions are in `canvas/helpers.ts`.

2. **GSAP Animations**: Use GSAP timelines for sequenced animations. Always update React state in `onUpdate` callbacks.

3. **Lesson System**: Add new lessons to `LESSONS` array in `data/lessons.tsx`. Each lesson has an `apply()` function that sets toggles.

4. **Type Definitions**: Types are defined ONCE in `types/index.ts`. Import from there, never duplicate.

5. **Theme Colors**: Use `ThemeContext` for nested components. Pass theme via props for canvas. Never hardcode hex values or Tailwind color classes.
6. **Semantic Tokens**: Always use semantic tokens (`action_primary`, `surface_selected`, etc.) instead of hardcoded colors. See `STYLING-GUIDE.md` for complete token reference.
7. **Shared Components**: Use `Button`, `Toggle`, and `ControlSection` from `components/shared/` instead of primitives. Do not create raw `<button>` elements for UI controls.
8. **Canvas Text Tokens**: Use `theme.label_primary`, `theme.label_on_fill`, and `theme.halo` for text. Do NOT use `theme.text` for canvas labels unless you're sure of the background.
9. **Overlay Colors**: Use `withAlpha(theme.color, OVERLAY_ALPHA.fill)` from `theme/overlays.ts` for transparent fills.

## Avoiding Common Errors

### TypeScript/Lint Prevention

1. **Unused imports**: Remove imports when extracting code to new files
2. **Duplicate types**: Always import from `types/index.ts`, never redefine
3. **Hardcoded colors**: Use semantic tokens (`bg-action-danger`, `text-surface-selected-text`) instead of `bg-red-50`, `bg-gray-200`, etc.
4. **Wrong import source**: Import `UnitCircleState` from `types`, not from `UnitCircleRenderer`
5. **Missing props**: When adding props to a component, update all call sites

### Build Verification

Always run after significant changes:
```bash
npm run build    # Catches TypeScript errors
npm run lint     # Catches style issues
```

## Agent Workflows

Use `/add-toggle`, `/add-lesson`, or `/add-proof-visualization` slash commands for step-by-step guidance.

## Adding Features

1. **New Toggle**: See `.agent/workflows/add-toggle.md`
2. **New Lesson**: See `.agent/workflows/add-lesson.md`
3. **New Proof**: See `.agent/workflows/add-proof-visualization.md`
4. **New Helper**: Add to `canvas/helpers.ts` with JSDoc comment

---
*Last updated: 2025-12-24 (v0.1.0)*
