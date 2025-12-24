# PRD: UX Enhancements

**Priority**: P2 (Medium)  
**Estimated Effort**: 1 hour

## Problem Statement

Controls panel has usability gaps:
- No keyboard navigation for common actions
- No quick reset for all toggles
- 17 toggles may overwhelm new users

## Goals

1. Add keyboard shortcuts for power users
2. Provide quick reset capability
3. Improve controls organization

## Non-Goals

- Mobile touch gestures
- Gamepad/controller support
- Full accessibility audit (ARIA, screen readers)

## Requirements

### R1: Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Space | Play/Pause animation |
| ← | Decrease angle by 5° |
| → | Increase angle by 5° |
| R | Reset all toggles |

### R2: Reset All Button
- Add button in Controls header: "Reset All"
- Clicking resets all toggles to `RESET_DEFAULTS`
- Visual feedback on click

### R3: Collapsible Sections (Optional)
- Wrap control sections in `<details>/<summary>`
- Remember collapsed state in localStorage
- Default: all expanded

## Success Criteria

- [ ] Spacebar toggles play/pause
- [ ] Arrow keys adjust angle smoothly
- [ ] R key resets all toggles to off
- [ ] Reset All button visible and functional

## Dependencies

None - can be implemented independently.

## Risks

Low - additive changes with no breaking impact.

## Future Considerations

- Add keyboard shortcut hints (tooltips)
- Custom keybinding configuration
- Touch gesture equivalents for mobile
