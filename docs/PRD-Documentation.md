# PRD: Documentation Cleanup

**Priority**: P1 (High)  
**Estimated Effort**: 30 minutes

## Problem Statement

Critical documentation is missing or outdated:
- `STYLING-GUIDE.md` does not exist (referenced in review)
- `AGENTS.md` references non-existent `useTrigMath.ts` hook

## Goals

1. Create comprehensive styling guide
2. Fix outdated architecture documentation
3. Establish documentation accuracy baseline

## Non-Goals

- Documenting every function (JSDoc task is separate)
- Creating tutorials or user guides

## Requirements

### R1: Create STYLING-GUIDE.md
Document:
- Canonical color palette with hex values
- Typography (fonts, sizes, weights)
- Canvas rendering conventions
- Component styling patterns

### R2: Fix AGENTS.md
- Remove `useTrigMath.ts` from architecture diagram
- Verify all other file references are accurate

### R3: Cross-Reference Updates
- Add link from `STRATEGY-Visualization.md` to `STYLING-GUIDE.md`

## Success Criteria

- [ ] `STYLING-GUIDE.md` exists with color table
- [ ] `grep -r "useTrigMath" .` returns 0 matches
- [ ] All file paths in docs resolve to existing files

## Dependencies

Should follow Plan 1 (color decisions) for accurate documentation.

## Risks

Low - documentation-only changes.
