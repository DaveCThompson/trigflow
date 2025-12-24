# PRD: Architecture Refactoring

**Priority**: P2 (Medium)  
**Estimated Effort**: 3-4 hours

## Problem Statement

Two files exceed maintainable size:
- `UnitCircleRenderer.ts` — 921 lines (drawing + proofs + helpers)
- `LessonPanel.tsx` — 532 lines (data + UI + logic)

## Goals

1. Split monolithic files into focused modules
2. Improve code discoverability
3. Enable parallel development

## Non-Goals

- Changing rendering behavior
- Adding new features
- Performance optimization

## Requirements

### R1: Canvas Helper Extraction
Create `src/components/UnitCircle/canvas/helpers.ts`:
- `drawLine()`, `drawText()`, `drawPoint()`, `drawQuadrants()`
- Export all with consistent signatures

### R2: Proof Rendering Extraction
Create `src/components/UnitCircle/canvas/proofs.ts`:
- `drawSineTriangleProof()`
- `drawTangentTriangleProof()`
- `drawGeneralFormProof()`
- `drawPythagoreanProof()`

### R3: Lesson Data Extraction
Create `src/data/lessons.ts`:
- `LESSONS` array with all lesson definitions
- `RESET_DEFAULTS` constant
- Type exports for `LessonId`, `LessonData`

### R4: File Size Targets
| File | Before | Target |
|------|--------|--------|
| UnitCircleRenderer.ts | 921 | <400 |
| LessonPanel.tsx | 532 | <150 |

## Success Criteria

- [ ] `npm run build` passes
- [ ] All lessons load and display correctly
- [ ] All proof animations work as before
- [ ] No file exceeds 500 lines

## Dependencies

Depends on Plan 1 (type consolidation) for clean imports.

## Risks

Medium - refactoring may introduce subtle bugs. Requires visual verification of all proofs.
