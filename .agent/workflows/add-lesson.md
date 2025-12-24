---
description: How to add a new lesson to TrigFlow
---

# Adding a New Lesson

Follow these steps to add a new educational lesson to TrigFlow.

## Steps

1. **Add lesson ID** to `src/data/lessons.tsx`
   - Add to the `LessonId` type union
   ```typescript
   export type LessonId = 'unit_circle' | 'sine' | ... | 'my_new_lesson';
   ```

2. **Create lesson data** in `src/data/lessons.tsx`
   - Add a new object to the `LESSONS` array
   - Include all required properties:
   ```typescript
   {
       id: 'my_new_lesson',
       title: 'My New Lesson',
       quote: <span className="text-xl font-light">Main concept statement.</span>,
       details: [
           "Key concept 1",
           "Key concept 2",
           <>JSX for <em>formatted</em> content</>
       ],
       diagram: 'none', // or 'tangent_identity', 'pythagorean', etc.
       apply: (set) => set(prev => ({
           ...prev,
           ...RESET_DEFAULTS,
           // Enable specific toggles for this lesson
           sin: true,
           cos: true,
       }))
   }
   ```

3. **Add diagram stepper** (if `diagram` is not 'none')
   - Create stepper component in `src/components/UnitCircle/steppers/`
   - Register diagram type in `src/components/UnitCircle/DiagramPanel.tsx`

// turbo
4. **Verify build**
   ```bash
   npm run build
   ```

## Diagram Types

| Type | Description |
|------|-------------|
| `'none'` | No diagram panel, shows Controls instead |
| `'tangent_identity'` | Tangent identity proof stepper |
| `'general_form'` | SOH CAH TOA general form |
| `'pythagorean'` | Pythagorean theorem rearrangement |
| `'pythagorean_identity'` | sin² + cos² = 1 proof |

## Best Practices

- Keep lesson titles short (< 25 chars)
- Quote should be a memorable one-liner
- Details should be 2-5 bullet points
- Test lesson navigation (Previous/Next works correctly)
