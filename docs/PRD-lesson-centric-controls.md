# PRD: Lesson-Centric Controls & Integrated Header

## 1. Overview
This initiative redesigns the application's control architecture to support **"Lesson-Centric Visibility"** and integrates a new **"Floating Glass Header"** into the canvas.

**The Problem:** The current control panel is static, overwhelming students with irrelevant toggles. The global controls (playback/angle) are disconnected from the canvas, breaking immersion.
**The Solution:** A contextual control system where lessons strictly define visible options, combined with a premium, focused "Heads-Up Display" (HUD) for global interaction centered on the content.

## 2. Problem & Goals

### User Story
**As a** student learning a specific trigonometric concept (e.g., Sine),
**I want** to see only the relevant visualization layers and have the main playback controls right on the interactive surface,
**So that** I can focus entirely on the relationship being taught without cognitive overload or interface friction.

### Success Metrics
*   **Cognitive Load Reduction:** Control panel shows < 5 items for basic lessons (down from 15+).
*   **Immersion:** Users spend 100% of their interaction time within the "Center Stage" area (Canvas + Header) during exploration.
*   **Maintainability:** Adding a new lesson requires zero changes to `Controls.tsx`, only configuration in `data/lessons.tsx`.

## 3. Scope & Key Initiatives

### In Scope
1.  **Canvas Header Integration (Design Option 1: Floating Glass)**
    *   Migrate Angle Slider, Play/Pause, Speed, and Unit Toggle to a new overlay component inside the Canvas container.
    *   Implement "Frosted Glass" aesthetic (`backdrop-filter`) for premium feel.
2.  **Lesson-Centric Control Visibility**
    *   Refactor `LessonData` to support `context.visible`: an allowlist of control IDs.
    *   Refactor `Controls.tsx` to filter sections/toggles based on this list.
    *   Refactor `LessonPanel.tsx` to utilize declarative `defaults` instead of imperative `apply()` functions.

### Out of Scope
*   **Analysis/Graph Panel Redesign:** The bottom-right graph panel remains as is.
*   **New Lessons:** We are migrating existing lessons, not writing new educational content.
*   **Mobile Interface Overhaul:** We will ensure responsiveness (stacking/scaling), but a dedicated mobile-specific layout (e.g., bottom sheet) is deferred.

## 4. UX/UI Specification

### A. The Floating Glass Header (Canvas Overlay)
A pill-shaped container floating *inside* the canvas padding area (top-center or distributed).

**visual Style:**
*   **Background:** `bg-ui-bg-panel/60` (Light) / `rgba(30, 41, 59, 0.6)` (Dark).
*   **Blur:** `backdrop-filter: blur(12px)`.
*   **Border:** 1px solid `theme.border_subtle` (e.g., white/20).
*   **Shadow:** `shadow-lg` (soft distinct shadow).

**Interaction:**
*   **Play/Pause:** Primary Action color. Hover lift effect (`-translate-y-0.5`).
*   **Slider:** Custom styled range input. Thumb color tracks `theme.cos` (or primary lesson color). Track gradient shows value.
*   **Unit Toggle:** Segmented control (RAD/DEG) matches strict styling guide pill shape.

**ASCII Wireframe (Desktop):**
```text
+-------------------------------------------------------------------+
|  CANVAS CONTAINER (Relative)                                      |
|                                                                   |
|    +---------------------------------------------------------+    |
|    | [> Play]   [----O-----------------------]  [ Rad | Deg ]|    |
|    +---------------------------------------------------------+    |
|       (Floating, centered, z-index: 10, backdrop-blur-md)        |
|                                                                   |
+-------------------------------------------------------------------+
```

### B. Lesson-Centric Control Panel (Right Sidebar)
The sidebar now acts as a "Toolbox" that adapts to the lesson.

**Behavior:**
*   **Filtering:** If a `ControlSection` has no visible children, the section is hidden.
*   **Empty State:** If a lesson has NO controls (rare), show a "Observe Mode" message.
*   **Transition:** Smooth opacity/height transition when controls appear/disappear. Use `AnimatePresence` or CSS transitions.

**ASCII Wireframe (Sine Lesson):**
```text
+------------------------------+
|  CONTROLS                    |
|                              |
|  BASIC FUNCTIONS             |
|  [x] Sine (Primary)          |
|  [ ] Cosine                  |
|                              |
|  GUIDES                      |
|  [ ] Quadrants               |
|  [ ] Coordinates             |
|                              |
|  (Other sections hidden)     |
+------------------------------+
```

### C. Responsiveness & Edge Cases
*   **Mobile (< 768px):** The Glass Header should scale down (0.9x) or stack:
    *   Row 1: Play | Rad/Deg
    *   Row 2: Angle Slider (Full Width)
*   **Overflow:** Ensure the floating header does not cover the main drawing area of the unit circle on small screens (Canvas max size might need adjusting).
*   **Dark Mode:** Ensure `backdrop-blur` works on dark backgrounds without looking muddy (use higher opacity or lighter border).

### D. Accessibility
*   **Keyboard Nav:** The floating header must be the first focusable group in the Canvas region.
*   **Tab Order:** Play -> Slider -> Units -> Canvas -> Graph -> Sidebar Controls.
*   **Labels:** All icon-only buttons (Play) must have `aria-label`.

### E. Technical Tokens (Styling Guide Alignment)
*   **Header Background:** `bg-ui-bg-panel/60` (using semantic opacity).
*   **Text:** `text-ui-text`.
*   **Active Elements:** `text-action-primary`.
*   **Borders:** `border-ui-border`.
```css
.glass-header {
  @apply absolute top-4 left-1/2 -translate-x-1/2;
  @apply flex items-center gap-4 px-6 py-3;
  @apply bg-ui-bg-panel/60 backdrop-blur-md;
  @apply rounded-full border border-white/20 shadow-lg;
  z-index: 20;
}
```
