---
name: Tecno-Innova System
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#00163a'
  on-tertiary-container: '#357df1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered to evoke a sense of precision, forward-momentum, and high-fidelity innovation. It targets a professional audience within the software and deep-tech sectors, prioritizing clarity and a "future-ready" aesthetic. 

The visual style is a hybrid of **Corporate Modern** and **Glassmorphism**. It utilizes a sophisticated layering technique where translucent surfaces represent modularity and depth, while a strict adherence to grid systems maintains a professional, trustworthy atmosphere. The emotional response should be one of "effortless power"—complex technology rendered through a clean, approachable, and highly performant interface.

## Colors
The palette is rooted in a **Dark Mode** first philosophy to emphasize the high-tech narrative.

- **Primary:** A deep, saturated "Space Blue" (#0F172A) used for backgrounds and foundational surfaces to provide a high-contrast base for data.
- **Secondary:** A "Vibrant Cyan" (#06B6D4) acting as the high-energy accent for primary actions, progress indicators, and active states.
- **Tertiary:** A "System Blue" (#3B82F6) for secondary interactions and subtle brand reinforcement.
- **Neutral:** A range of "Cool Slates" (#94A3B8) used for secondary text, borders, and inactive elements to ensure visual balance without competing with the accents.

## Typography
The typography utilizes **Inter** for its exceptional legibility and systematic feel across all UI and body text. For technical metadata, code snippets, and small labels, **JetBrains Mono** is introduced to reinforce the developer-centric, "high-tech" nature of the brand.

Headlines should be set with tight letter-spacing to appear more impactful and architectural. Body text maintains a generous line height to ensure readability against dark backgrounds. Use "label-sm" (JetBrains Mono) in uppercase for categorized headers or small status badges to create a distinct visual texture compared to standard prose.

## Layout & Spacing
This design system employs a **Fluid Grid** model with a base-4 spacing rhythm. 

- **Desktop:** 12-column grid with a 24px gutter and 48px side margins. 
- **Tablet:** 8-column grid with a 24px gutter and 32px side margins.
- **Mobile:** 4-column grid with a 16px gutter and 16px side margins.

Alignment should be rigorous; elements should snap to the grid to maintain the "engineered" feel. Use "md" (24px) spacing for most component internal grouping, while "lg" (40px) and above should be reserved for section vertical breathing room.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layering**. 

1.  **Base Layer:** Solid Primary Blue (#0F172A).
2.  **Surface Layer:** Semi-transparent overlays (White at 5% opacity) with a 12px backdrop-blur. 
3.  **Accent Layer:** Subtle, long-offset shadows using the Primary Blue color at a darker value, ensuring they feel like ambient occlusions rather than heavy dropshadows.

Use 1px semi-transparent borders (White at 10% opacity) on all glass elements to define edges against the dark background. This "inner glow" effect is critical for the high-tech aesthetic.

## Shapes
The shape language is consistently **Rounded**. A 0.5rem (8px) base radius is used for standard components like buttons and input fields. Larger containers and cards utilize the `rounded-lg` (1rem / 16px) or `rounded-xl` (1.5rem / 24px) values to soften the technical nature of the UI, making it feel modern and ergonomic. 

Avoid full-pill shapes unless used for small status tags or search bars to maintain a structured, professional appearance.

## Components
- **Buttons:** Primary buttons use a solid Secondary Cyan gradient. Secondary buttons use the "Glass" effect with a 1px border. 
- **Inputs:** Darker than the base surface, using a 1px border that glows (Cyan) on focus.
- **Cards:** Use the Glassmorphism style: 5% White overlay, 12px blur, and a 1px subtle border. No heavy shadows.
- **Chips/Tags:** Monospaced font (JetBrains Mono), small, with high-contrast background tints.
- **Lists:** Separated by low-opacity neutral dividers (10% opacity). Hover states should trigger a subtle 2% brightness increase.
- **Specialty Components:** Include "Data Visualization Widgets" using thin stroke-widths and "Code Blocks" using the JetBrains Mono font on a deep black background.