---
description: How to add a new toggle to TrigFlow
---

# Adding a New Toggle

Follow these steps to add a new visualization toggle to TrigFlow.

## Steps

1. **Define the toggle property** in `src/types/index.ts`
   - Add to the `UnitCircleToggles` interface
   - Include a JSDoc comment explaining what the toggle does
   - Use descriptive naming (e.g., `showAngles`, `proof_xyz`)
   ```typescript
   /** Shows [description of what this toggle visualizes] */
   myNewToggle?: boolean;
   ```

2. **Add to reset defaults** in `src/data/lessons.tsx`
   - Add the toggle to `RESET_DEFAULTS` object
   - Set initial value (usually `false`)
   ```typescript
   export const RESET_DEFAULTS: Partial<UnitCircleState['toggles']> = {
       // ... existing toggles
       myNewToggle: false,
   };
   ```

3. **Add drawing logic** in `src/components/UnitCircle/UnitCircleRenderer.ts`
   - Add conditional rendering block
   - Use helpers from `canvas/helpers.ts` for drawing primitives
   - Use theme colors, never hardcode hex values
   ```typescript
   if (toggles.myNewToggle) {
       drawLine(ctx, point1, point2, theme.sin, 2);
       drawText(ctx, "label", labelPos, theme.text);
   }
   ```

4. **Add UI toggle** in `src/components/UnitCircle/Controls.tsx`
   - Add `<Toggle>` component to appropriate section
   - Use theme color for the toggle indicator
   ```tsx
   <Toggle
       label="My New Feature"
       checked={toggles.myNewToggle ?? false}
       onChange={() => toggle('myNewToggle')}
       color={theme.sin}
       description="Optional helper text"
   />
   ```

// turbo
5. **Verify build**
   ```bash
   npm run build
   ```

## Notes

- For complex drawing, consider adding a helper function to `canvas/helpers.ts`
- For proof visualizations, add to `canvas/proofs.ts` instead
- Always test in both light and dark modes
