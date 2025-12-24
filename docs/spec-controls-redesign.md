# Spec: Lesson-Centric Controls Redesign

## 1. User Story
**As a** Student learning trigonometry,
**I want** the control panel to only show buttons and settings relevant to the current lesson,
**So that** I am not overwhelmed by irrelevant options and can focus on the specific concept being taught.

## 2. UX Specification

### Behavioral Changes
*   **Contextual Flexibility:** Each lesson defines a strict subset of "Visible Controls". Controls not in this set are hidden entirely.
*   **Declarative Defaults:** Each lesson defines the "Initial State" of all toggles (On/Off). This replaces imperative "apply" logic.
*   **Global vs Contextual:** 
    *   **Global:** Angle (Slider/Play), Unit (Deg/Rad), and Reset remain always visible.
    *   **Contextual:** All visibility toggles (Sin, Cos, Grid, etc.) are filtered.

### Data Structure Update (`LessonData`)
We will extend the `LessonData` interface to include:
```typescript
interface LessonData {
    // ... existing fields
    context: {
        visible: string[]; // List of IDs of controls to show
        defaults: Record<string, boolean>; // Initial state overrides
    }
}
```

### Component Logic (`Controls.tsx`)
*   The component will take the `visible` list as a prop.
*   It will iterate through its standard sections ("Foundational", "Basic Trig", etc.).
*   Inside each section, it checks if a toggle is in the `visible` list.
*   **Smart Sections:** If a section has NO visible toggles, the entire section header is hidden.

## 3. Visual Blueprint (ASCII)

### Layout Overview
```text
+-------------------------------------------------------+
|  GLOBAL CONTROLS (Sticky / Always Top)                |
|  [ Play/Pause ] [ --------------------O- ] [DEG/RAD]  |
|                 (Angle Slider with visual feedback)   |
+-------------------------------------------------------+
|  LESSON SPECIFIC (Scrollable container)               |
|                                                       |
|  +-------------------------------------------------+  |
|  | [Section Title]                                 |  |
|  | [X] Toggle A      [ ] Toggle B                  |  |
|  +-------------------------------------------------+  |
|                                                       |
|  (Only relevant sections appear below)                |
|                                                       |
+-------------------------------------------------------+
```

### Example: "Sine" Lesson
*Goal: Focus purely on vertical displacement.*
```text
+-------------------------------------------------------+
|  (Global Controls...)                                 |
+-------------------------------------------------------+
|                                                       |
|  VISUALIZATION                                        |
|  [x] Sine Function (Color: Red)                       |
|  [ ] Cosine (Hidden/Disabled or not shown?)           |
|                                                       |
|  GUIDES                                               |
|  [x] Quadrant Labels                                  |
|  [ ] Grid (Hypotenuse)                                |
|                                                       |
+-------------------------------------------------------+
```

### Example: "Tangent Identity" Lesson
*Goal: Show relation between Tan, Sin, Cos.*
```text
+-------------------------------------------------------+
|  (Global Controls...)                                 |
+-------------------------------------------------------+
|                                                       |
|  COMPONENTS                                           |
|  [x] Sine    [x] Cosine    [x] Tangent                |
|                                                       |
|  PROOFS / HELPERS                                     |
|  [x] Similar Triangles (Sin/Cos/1)                    |
|  [x] Similar Triangles (Tan/1/Sec)                    |
|                                                       |
+-------------------------------------------------------+
```

## 4. Technical Migration Plan
1.  **Type Definition:** Update `LessonData` in `src/data/lessons.tsx`.
2.  **Data Migration:** Refactor `LESSONS` array.
    *   Convert `apply` functions to `defaults` object.
    *   Define `visible` arrays for each lesson based on its `details`.
3.  **Component Refactor:** rewriting `Controls.tsx` to filter render output based on context.
