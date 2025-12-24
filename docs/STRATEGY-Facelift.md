# STRATEGY: Pastel Aesthetic Facelift

**Feature:** UI Modernization & Design System Enhancement  
**Architect:** Principal Web Architect  
**Date:** December 2025  
**Status:** Implemented (Dec 24, 2025)

---

## 1. Architecture Decision Record (ADR)

### 1.1 State Management Decision

**Decision:** Continue using **React Context** for theme state. No additional state library required.

**Rationale:**
- Theme state is simple: `{ themePreference, isDark }`
- Already implemented in `ThemeContext.tsx` with localStorage persistence
- Theme changes are infrequent (user-initiated only)
- No complex derived state or async operations
- **Jotai is NOT needed** - would be over-engineering for this use case

**Trade-offs:**
- ✅ Zero additional dependencies
- ✅ Minimal re-render surface (only components consuming theme)
- ✅ Simple mental model for contributors
- ⚠️ If we add complex UI state (e.g., undo/redo, collaborative features), revisit this decision

### 1.2 CSS Architecture Decision

**Decision:** Use **CSS Variables (Custom Properties)** for all color tokens, mapped through Tailwind.

**Rationale:**
- Already implemented in `index.css` with `:root` and `.dark` scopes
- Instant theme switching without JavaScript re-renders
- Canvas can read computed CSS variables via `getComputedStyle()`
- Tailwind config references variables (e.g., `bg-[color:var(--surface-2)]`)

**Implementation Pattern:**
```css
/* index.css */
:root {
  --surface-2: oklch(100% 0 0);
  --color-sin: oklch(65% 0.22 25);
}

.dark {
  --surface-2: oklch(25% 0.02 260);
}
```

```tsx
// Component usage
<div className="bg-[color:var(--surface-2)]" />

// Canvas usage
const bg = getComputedStyle(document.documentElement)
  .getPropertyValue('--surface-2').trim();
```

### 1.3 Typography Strategy

**Decision:** Use Google Fonts CDN with font-display: swap.

**Fonts:**
- **Headings:** Nunito (700, 800) - Rounded, friendly
- **Body:** Inter (400, 500, 600) - Clean, readable
- **Monospace:** JetBrains Mono (500) - Numbers, code

**Implementation:**
- Add `<link>` tags to `index.html`
- Update `tailwind.config.js` font families
- Apply via `@layer base` in `index.css`

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
App (ThemeProvider wrapper)
├── Header (Logo, ThemeToggle)
├── UnitCircle (Main container)
│   ├── LessonPanel (Left column)
│   ├── Visualization (Center column)
│   │   ├── Canvas (UnitCircleRenderer)
│   │   └── TrigGraph
│   └── Controls (Right column)
│       ├── AngleControl (Slider + Play button)
│       ├── ControlSection[] (Collapsible groups)
│       │   └── Toggle[] (Custom switches)
│       └── ReadoutPanel
└── Footer
```

### 2.2 Data Flow

**Theme Flow:**
```
ThemeContext (isDark) 
  → UnitCircle (derives LIGHT_THEME | DARK_THEME)
    → Canvas (theme object)
    → Controls (theme object)
    → LessonPanel (theme object)
```

**Angle/Toggle Flow:**
```
UnitCircle (useState)
  → Controls (props: angle, setAngle, toggles, setToggles)
  → Canvas (props: angle, toggles)
  → TrigGraph (props: angle, trace)
```

**No prop drilling issues** - state lives at appropriate level (UnitCircle).

### 2.3 Presentational vs Container Pattern

| Component | Type | Responsibility |
|-----------|------|----------------|
| `UnitCircle.tsx` | Container | State management, orchestration |
| `Controls.tsx` | Presentational | Render controls, emit events |
| `LessonPanel.tsx` | Presentational | Render lesson content |
| `Toggle.tsx` | Presentational | Reusable switch UI |
| `ControlSection.tsx` | Presentational | Collapsible wrapper |

---

## 3. File Structure & Modularity

### 3.1 Current Structure (Good)
```
src/
├── components/
│   ├── UnitCircle/          # Feature-based grouping ✅
│   └── shared/              # Reusable primitives ✅
├── contexts/                # Global state ✅
├── theme/                   # Design tokens ✅
├── types/                   # Single source of truth ✅
└── utils/                   # Pure functions ✅
```

### 3.2 Proposed Additions

**New shared components:**
- `src/components/shared/Button.tsx` - Pill-shaped primary/secondary buttons
- `src/components/shared/Slider.tsx` - Custom range input (extract from Controls)

**Rationale:**
- Reusability across future features
- Easier to maintain consistent styling
- Testable in isolation

---

## 4. Canvas Integration Strategy

### 4.1 Challenge
Canvas 2D API requires **hex/rgb strings**, but our theme uses **OKLCH**.

### 4.2 Solution
**Option A (Current):** Theme object (`colors.ts`) provides OKLCH strings directly.  
**Option B (Proposed):** Canvas reads CSS variables at runtime.

**Recommendation:** Stick with **Option A** for now.
- `UnitCircleRenderer.ts` already receives `theme` object
- No runtime CSS parsing overhead
- Type-safe color references

**Future Enhancement:** If we need dynamic color adjustments (e.g., user-customizable themes), migrate to Option B.

---

## 5. Interaction & Animation Strategy

### 5.1 Micro-interactions

| Element | Interaction | Implementation |
|---------|-------------|----------------|
| Buttons | Hover lift, Click bounce | `hover:-translate-y-0.5`, `active:scale-95` |
| Toggles | Spring transition | `transition-transform duration-300 ease-spring` |
| Slider thumb | Hover expand | `:hover { transform: scale(1.1) }` |
| Panels | Smooth expand/collapse | `ControlSection` with height animation |

### 5.2 GSAP Usage
- **Current:** Used for proof animations (Pythagorean rearrangement)
- **Facelift Scope:** No new GSAP animations required
- **Recommendation:** Keep GSAP for complex multi-step animations only

---

## 6. Responsive Strategy

### 6.1 Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px (3-column layout threshold)

### 6.2 Layout Behavior
```
Mobile (<xl):     Stacked vertical (Visualization → Controls → Lessons)
Desktop (≥xl):    3-column grid (Lessons | Visualization | Controls)
```

**Implementation:** Already in `UnitCircle.tsx` via `flex-col xl:flex-row`.

---

## 7. Performance Considerations

### 7.1 Re-render Optimization
- ✅ Theme context only triggers re-renders on theme change (rare)
- ✅ Canvas uses `useCallback` for draw function
- ✅ Memoized theme object derivation

### 7.2 Bundle Size
- ⚠️ Google Fonts adds ~50KB (acceptable for UX gain)
- ✅ No new JS dependencies
- ✅ Phosphor Icons already in use

---

## 8. Testing Strategy

### Manual Verification Checklist
- [ ] Theme toggle (Light → Dark → System)
- [ ] Responsive breakpoints (resize browser)
- [ ] Keyboard shortcuts (Space, Arrows, R)
- [ ] Touch interactions (mobile slider)
- [ ] Canvas color consistency with UI
- [ ] Typography rendering (no FOUT)

### Automated (Future)
- Unit tests for `Toggle`, `Button` components
- Visual regression tests (Chromatic/Percy)

---

## 9. Migration Path

### Phase 1: Foundation (Low Risk)
1. Add Google Fonts to `index.html`
2. Update Tailwind font config
3. Verify CSS variables in `index.css`

### Phase 2: Components (Medium Risk)
4. Enhance `Toggle.tsx` styling
5. Create `Button.tsx` component
6. Refactor `Controls.tsx` to use new components
7. Update `LessonPanel.tsx` typography

### Phase 3: Polish (Low Risk)
8. Add micro-interactions (hover, active states)
9. Verify canvas color alignment
10. Mobile responsive testing

---

## 10. Rollback Plan

**If issues arise:**
1. CSS variables are additive - old Tailwind classes still work
2. Component changes are isolated - revert individual files
3. No database/API changes - purely frontend

**Critical Path:** Canvas rendering. If colors break, theme object in `colors.ts` is source of truth.

---

## Conclusion

This architecture leverages existing patterns (React Context, CSS Variables) without introducing complexity. The facelift is primarily a **styling enhancement**, not a structural refactor.

**Key Principle:** Enhance, don't rebuild.
