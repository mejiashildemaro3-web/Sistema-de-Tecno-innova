---
name: Tecno-Innova Secure Ops
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base_unit: 4px
  container_margin: 24px
  gutter_horizontal: 16px
  gutter_vertical: 16px
  sidebar_width: 260px
  card_padding: 20px
---

## Brand & Style

This design system establishes a high-trust, mission-critical environment for security operations. The brand personality is authoritative yet approachable, emphasizing precision, real-time responsiveness, and institutional stability. 

The aesthetic follows a **Corporate Modern** style with a focus on data density and clarity. It utilizes a structured information architecture characterized by clean lines, ample negative space within data modules, and a clear visual hierarchy that prioritizes urgent alerts without inducing fatigue. The goal is to evoke a sense of "calm control" for operators managing complex security infrastructures.

## Colors

The palette is anchored by **Elegant Navy Blue (#1e293b)** for high-level navigation and structural framing, providing a solid foundation of authority. **Corporate Blue (#2563eb)** serves as the primary action color, used sparingly for buttons and active states to maintain focus.

The background utilizes **Light Gray (#f8fafc)** to reduce eye strain during long shifts, while **White (#ffffff)** surfaces clearly demarcate functional modules and cards. Semantic colors for Error, Warning, and Success follow industry standards to ensure immediate cognitive recognition of system statuses.

## Typography

The design system utilizes **Inter** as the primary typeface for its exceptional legibility in digital interfaces and neutral, professional tone. For technical data, IP addresses, and logs, **JetBrains Mono** is introduced to provide clear character differentiation and a technical "security" feel.

Typography is scaled to support information-dense layouts. Headlines use tighter letter spacing for a modern look, while labels utilize uppercase styling to differentiate metadata from primary content. On mobile devices, `display-lg` should scale down to 24px to ensure headlines do not wrap excessively.

## Layout & Spacing

The design system employs a **Fluid Grid** model with a 12-column structure for the main content area. A fixed **Sidebar** is anchored to the left at 260px, while the main dashboard area expands to fill the viewport.

A strict 4px baseline grid governs all spacing increments. Components should utilize 16px (4 units) or 24px (6 units) for internal padding and margins to maintain a rhythmic, professional balance. On mobile devices, the sidebar transitions to a hidden off-canvas drawer, and side margins compress to 16px to maximize screen real estate.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. The Light Gray background sits at the lowest elevation (z-0). Cards and data containers are placed at z-1, utilizing a very soft, diffused shadow (0px 4px 12px rgba(30, 41, 59, 0.05)) to appear slightly raised.

Active floating elements, such as dropdowns or modals, use a more pronounced elevation (z-2) with a deeper shadow to command attention. Borders should remain subtle (#e2e8f0) and serve as the primary separator for low-elevation elements like table rows or sidebar items.

## Shapes

The shape language is **Soft**, utilizing a standard 4px (0.25rem) border radius for inputs and small buttons. Larger containers and cards use a 8px (0.5rem) radius. This approach strikes a balance between the precision of sharp corners and the modern friendliness of rounded elements, ensuring the interface feels updated without losing its professional edge.

## Components

### Buttons
- **Primary:** Solid Corporate Blue with white text. No gradients.
- **Secondary:** Ghost style with Corporate Blue border and text.
- **Critical:** Solid Red (#ef4444) for destructive actions only.

### Cards
- White background, 8px corner radius, subtle 1px border (#e2e8f0).
- Headers should include a 1px bottom border to separate titles from data.

### Input Fields
- White background with a 1px slate-200 border.
- On-focus: 1px Corporate Blue border with a soft blue outer glow (2px blur).

### Status Badges (Chips)
- Small, uppercase text. 
- Use "Soft" fills (e.g., 10% opacity of the status color with 100% opacity text) for a refined, non-distracting look.

### Data Tables
- Row hover state: Lightest blue/gray tint (#f1f5f9).
- Column headers: Uppercase, bold, 11px Inter, Slate-500 color.

### Additional Components
- **System Health Indicator:** A persistent pulse icon in the top-right header showing real-time connectivity status.
- **Activity Feed:** A vertical timeline component for recent security logs with monospaced timestamps.