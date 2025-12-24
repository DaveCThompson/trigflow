# PRD: Design System Unification

**Priority**: P0 (Critical)  
**Estimated Effort**: 1-2 hours

## Problem Statement

Colors are defined in three places with conflicting values, and type definitions are duplicated. This creates maintenance burden and visual inconsistencies.

## Goals

1. Single source of truth for color palette
2. Remove duplicate type definitions
3. Eliminate hardcoded color values in components

## Non-Goals

- Complete redesign of color palette
- Adding new color tokens beyond current needs

## Requirements

### R1: Unified Color Palette
- Update `LIGHT_THEME` in `colors.ts` to match documented palette
- Add trig function colors to `tailwind.config.js` extend block
- Update `STRATEGY-Visualization.md` if palette decisions change

### R2: Type Consolidation
- Remove `UnitCircleState` interface from `UnitCircleRenderer.ts`
- Import from `types/index.ts` in all consuming files

### R3: Theme Consumption
- Pass theme to `Controls.tsx` component
- Replace hardcoded `color="#e74c3c"` with `color={theme.sin}` pattern

## Success Criteria

- [ ] `npm run build` passes with no errors
- [ ] All 6 function colors consistent across Controls ↔ Canvas
- [ ] Single type definition found via `grep "UnitCircleState"`

## Dependencies

None - foundational work.

## Risks

Low - straightforward refactoring with clear verification.
