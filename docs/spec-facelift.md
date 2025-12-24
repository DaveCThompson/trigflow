# Spec: Pastel Aesthetic Facelift

**Feature Name:** Facelift & UX Modernization  
**Owner:** Design Lead & Architect  
**Status:** In Review  
**Date:** December 2025

## 1. User Story

**As a** Student learning Trigonometry,  
**I want** a "Pastel & Friendly" interface that feels modern and approachable, with clear visual hierarchy and smooth interactions,  
**So that** I feel invited to explore the concepts without feeling overwhelmed by a "utility" or "dated" interface.

**As a** Creative Director,  
**I want** to enforce a cohesive design system using OKLCH colors and semantic tokens,  
**So that** the app feels "alive" and premium, and themes (Light/Dark) work flawlessly.

## 2. UX Specification

### 2.1 Aesthetic Vision
The interface moves from "Functional" to "Premium Educational".
*   **Vibe:** Soft, approachable, rounded, "Apple-like" or "Duolingo-like" playfulness.
*   **Motion:** Everything breathes. Buttons bounce, toggles spring, panels slide.
*   **Typography:** Friendly rounded headers (Nunito) paired with clean sans-serif (Inter/Quicksand) and monospaced numbers.

### 2.2 Global Behaviors
*   **Theme Switching:** Instant, no-flash switch using CSS variables.
*   **Responsiveness:**
    *   **Desktop:** 3-Panel Layout (Learn | Visualize | Control).
    *   **Mobile:** Stacked vertical flow with collapsible sections.

### 2.3 Component States

| Component | Default State | Hover State | Active/Focus State |
| :--- | :--- | :--- | :--- |
| **Card (Panel)** | `bg-surface-2`, `shadow-soft`, `rounded-3xl` | N/A | N/A |
| **Primary Button** | `bg-primary`, `text-on-primary`, Pill shape | `scale-105`, `brightness-110` | `scale-95` (Bounce) |
| **Toggle Switch** | `bg-surface-3` (Off), `translate-x-0` | `cursor-pointer` | `bg-active-color`, `translate-x-full` |
| **Slider** | Thick Track (`h-2`), Large Thumb (`h-5`) | Thumb expands | Thumb glows |
| **List Item** | Subtle padding | `bg-surface-3` (Highlight) | N/A |

### 2.4 Control Logic
*   **Reset All:** A dedicated action to return all toggles to the safe default state.
*   **Keyboard Shortcuts:**
    *   `Space`: Play/Pause
    *   `Arrows`: Adjust Angle
    *   `R`: Reset

## 3. Visual Blueprint (ASCII)

### Desktop Layout (1280px+)

```ascii
+-----------------------------------------------------------------------+
|  [Logo] TrigFlow (Gradient Text)                    [Theme] [Github]  |
+-----------------------------------------------------------------------+
|                                                                       |
|  +----------------+  +--------------------------------+  +----------+ |
|  | LESSONS        |  |  VISUALIZATION                 |  | CONTROLS | |
|  |                |  |                                |  |          | |
|  |  (Book Icon)   |  |        (  Unit Circle  )       |  | [Reset]  | |
|  |  "Intro..."    |  |                                |  |          | |
|  |                |  |           .-------.            |  |  Angle   | |
|  |  [<] 1/5 [>]   |  |          /         \           |  |  o-----  | |
|  |                |  |         |     +     |          |  |          | |
|  |  "Quote..."    |  |          \         /           |  | Toggles  | |
|  |                |  |           '-------'            |  | ( ) Sin  | |
|  |  * Detail      |  |                                |  | (x) Cos  | |
|  |  * Detail      |  |  +--------------------------+  |  |          | |
|  |                |  |  | Waveform Graph           |  |  +----------+ |
|  +----------------+  |  | ~^~v~^~v~^~v~            |  |             | |
|                      |  +--------------------------+  |  | READOUT  | |
|                      +--------------------------------+  |          | |
|                                                          | sin: 0.5 | |
|                                                          | cos: 0.8 | |
|                                                          +----------+ |
|                                                                       |
+-----------------------------------------------------------------------+
|  TrigFlow v0.1.0 • Built with <3                                      |
+-----------------------------------------------------------------------+
```

### Mobile Layout (<768px)

```ascii
+-------------------------+
| [Logo]          [Theme] |
+-------------------------+
| VISUALIZATION           |
|                         |
|      ( Circle )         |
|                         |
+-------------------------+
| CONTROLS (Collapsible)  |
| [v] Angle: 45deg        |
| [v] Toggles...          |
+-------------------------+
| LESSONS                 |
| "Intro to Sin"          |
| [Prev]  [Next]          |
+-------------------------+
| READOUT                 |
| ...                     |
+-------------------------+
```

## 4. Implementation Notes (The "Architect Signal")

*   **Design Tokens:** Implement full OKLCH palette in `global.css` CSS variables.
*   **Icons:** Replace Phosphor imports with specific weights (`duotone` vs `bold`).
*   **Canvas:** Update `UnitCircleRenderer.ts` to consume CSS variables for colors to match UI exactly.
