# Changelog

All notable changes to TrigFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-24

### Added
- **Semantic Token System Extension**
  - `action_primary`, `action_primary_hover` - Main CTA states
  - `action_danger`, `action_danger_subtle` - Destructive action states
  - `surface_selected`, `surface_selected_text` - Selection states
  - `border_focus`, `border_selected` - Focus and selection rings
  - `fill_angle_wedge` - Theme-aware theta angle fill
- **Segmented Deg/Rad Toggle** - Both options now visible simultaneously
- **Control Panel Reorganization**
  - "Foundational" section (Radius, Quadrants, Coordinates, Axis Intersections)
  - "Basic Trig Functions" section (Sine, Cosine, Tangent)
  - "Other Functions" section (Cotangent, Cosecant, Secant)

### Changed
- **Cosine Visualization** - Now always uses complementary position (vertical line from point to Y-axis)
- **Graph Header** - Renamed from "Historical Graphs" to "Graphs"
- **Footer** - Updated to show "TrigFlow • v0.1.0"
- **Dropdown Styling** - Enhanced with better padding, focus rings, and borders
- **Theta Wedge** - Now uses theme-aware color instead of hardcoded blue

### Fixed
- **Play Button Shadow** - No longer cropped (added overflow-visible)
- **Special Angle Button Rings** - No longer cropped (increased gap)
- **Hardcoded Colors** - Removed all hardcoded Tailwind color classes in favor of semantic tokens

### Removed
- `cosOnCompSide` toggle - Cosine now always uses complementary position
- "Complementary Functions" section - Functions reorganized into clearer groups
- Hardcoded color references (`bg-red-50`, `bg-gray-200`, etc.)

### Documentation
- Updated `STYLING-GUIDE.md` with new semantic token reference
- Updated `AGENTS.md` with semantic token guidance
- Added comprehensive `walkthrough.md` documenting all changes

---

## [0.0.0] - 2025-12-23

### Added
- Initial release of TrigFlow
- Interactive unit circle visualization
- Lesson system for educational content
- Proof visualizations for trigonometric identities
- Canvas-based rendering with GSAP animations
- Dark mode support
- OKLCH color system
