# Animation Strategy

Philosophy and principles for animations in Visual Trig.

## Core Philosophy

**Animations should illuminate, not decorate.** Every animation must serve an educational purpose - revealing mathematical relationships that would otherwise be hidden.

## GSAP Timeline Patterns

### Sequenced Transitions

For multi-step proofs, use GSAP timelines to create clear narrative sequences:

```typescript
const tl = gsap.timeline();

// 1. Fade out previous state
tl.to(opacity, { value: 0, duration: 0.4 });

// 2. Transform geometry
tl.add(() => {
    triangles.forEach((t, i) => {
        gsap.to(t.position, { x: target[i].x, duration: 1.0 });
    });
}, '+=0.1');

// 3. Fade in new state
tl.to(newOpacity, { value: 1, duration: 0.4 }, '+=0.8');
```

### Timing Guidelines

| Phase | Duration | Purpose |
|-------|----------|---------|
| Fade out | 0.3-0.4s | Clear visual separation |
| Movement | 0.8-1.2s | Allow comprehension |
| Fade in | 0.3-0.4s | Reveal new insight |

### Easing

- `power2.inOut` - Smooth, natural motion for geometric transformations
- `power2.out` - Quick fade-outs
- `power2.in` - Gentle fade-ins

## React Integration

Always trigger React re-renders from GSAP:

```typescript
gsap.to(ref.current, {
    x: target,
    onUpdate: () => setTick(t => t + 1) // Force re-render
});
```

## Bidirectional Animations

All proof animations must work in reverse. Going backwards should undo transitions in logical sequence.

## Performance

- Use refs for animated values (avoid state for every frame)
- Batch canvas redraws with a single tick state
- Cancel animations on unmount with `gsap.killTweensOf()`
