# Visual Trig

**Interactive Trigonometry Visualization**

An educational web app that makes trigonometric concepts intuitive through interactive visualizations and animated proofs.

![Visual Trig Screenshot](docs/assets/screenshot.png)

## Features

- 🎯 **Unit Circle Visualization** - Interactive unit circle with all six trig functions
- 📐 **Visual Proofs** - Animated proofs for Pythagorean theorem, tangent identity, and more
- 📊 **Live Graphs** - Real-time sine, cosine, and tangent waveforms
- 🎨 **Pastel Aesthetic** - Modern, approachable design with OKLCH colors and Nunito typography
- 🧩 **Premium UI** - Custom controls with smooth spring animations and responsive layout
- 🎓 **Guided Lessons** - Step-by-step educational content
- ⌨️ **Keyboard Shortcuts** - Space (play/pause), Arrow keys (angle control)
- 🌓 **Theme Support** - Light, Dark, and System Sync modes

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Technology Stack

- **React 18** + **TypeScript** - Component framework
- **Vite** - Build tool
- **Canvas 2D** - Mathematical visualizations
- **GSAP** - Smooth animations
- **Tailwind CSS** - Styling

## Lessons

| Lesson | Description |
|--------|-------------|
| Unit Circle | Foundation of trigonometry |
| Sin/Cos/Tan | Primary trig functions |
| Sec/Csc/Cot | Reciprocal functions |
| Tangent Identity | Visual proof of tan = sin/cos |
| Pythagorean Theorem | Animated rearrangement proof |
| Pythagorean Identity | sin² + cos² = 1 |
| Trig Identities | Comprehensive reference |

## Development

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Documentation

- [AGENTS.md](AGENTS.md) - AI agent instructions
- [STYLING-GUIDE.md](STYLING-GUIDE.md) - Design tokens and patterns
- [docs/STRATEGY-Animation.md](docs/STRATEGY-Animation.md) - Animation philosophy
- [docs/STRATEGY-Visualization.md](docs/STRATEGY-Visualization.md) - Visual design principles
- [docs/STRATEGY-Education.md](docs/STRATEGY-Education.md) - Educational approach

## License

MIT
