# GarmentIQ Premium Eye-Comfort UI Theme & Design System Specification
*(এন্টারপ্রাইজ আই-কমফোর্ট ডিজাইন সিস্টেম ও মাস্টার থিম স্পেসিফিকেশন)*

**Version:** 2.0 (Official Final Enterprise Standard)  
**Date:** 22 October 2026  
**Stack:** Tailwind CSS 4 · React 19 · Vite 6 · Lucide React · shadcn/ui  
**Theme Direction:** Refined Midnight Navy (`#142B45`) + Soft Slate (`#F3F5F7`) + Refined Teal (`#0F766E`)  
**Supervisors:** 👩‍💻 Sadia Jahan (Senior Frontend & UI/UX Lead) & 👨‍💼 Tanvir Ahmed (Chief Solutions Architect)  
**Rules Reference:** [Rule 07 (File Length)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/07_file_length_and_modularity.md) | [Rule 15 (Bilingual)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/15_bilingual_code_commenting_standards.md) | [Rule 20 (Design Tokens)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/20_centralized_design_tokens_and_zero_inline_styles.md) | [Rule 21 (Components)](file:///g:/ERP-Software/Garments-ERP/.agents/rules/21_component_based_ui_ux_architecture.md)

---

## 1. Purpose (উদ্দেশ্য ও ভূমিকা)

This document defines the single, authoritative, consistent, low-glare visual system for the GarmentIQ Enterprise ERP platform (RMG Woven, Denim & Non-Denim). It is engineered specifically for long work sessions (8–10 hours daily) by merchandisers, planning officers, cutting supervisors, industrial laundry managers, and commercial accounts teams without sacrificing readability, clear state communication, or WCAG 2.2 AA accessibility.

“Eye-comfort” is an engineered ergonomic goal: contrast, font rendering, ambient light compatibility, display brightness, and zero-glare soft slate neutral surfaces work together to eliminate visual fatigue.

---

## 2. Design Principles (ডিজাইন নীতিমালা)

- **Calm by Default (চোখের জন্য স্বস্তিদায়ক ক্যানভাস):** Use a soft neutral workspace (`#F3F5F7`) rather than a full-screen glaring pure-white canvas.
- **Hierarchy Before Decoration (অলংকরণের আগে হায়ারার্কি):** Typography, spatial padding, alignment, and surface elevation separate modules and cards cleanly.
- **Navy for Structure (কাঠামোর জন্য মিডনাইট নেভি):** Deep Midnight Navy (`#142B45`) anchors the application brand, headers, and sidebar navigation, without overwhelming the content canvas.
- **Teal for Action (অ্যাকশন ও সিঙ্ক নির্দেশনায় রিফাইনড টিল):** Reserve the energetic Teal accent (`#0F766E`) strictly for high-intent primary actions (Save, Submit, Approve, Create), active indicators, and meaningful operational progress.
- **Semantic Colors (সুনির্দিষ্ট সেমান্টিক অর্থ):** Success (`#15803D`), Warning (`#B45309`), Danger (`#B91C1C`), and Info (`#1D4ED8`) communicate state consistently across all modules.
- **Dense but Legible (উচ্চ ঘনত্ব কিন্তু শতভাগ পাঠযোগ্য):** Enterprise tables, BOM matrices, and marker ratio grids remain compact and operable.
- **Single Master Layout (একক মাস্টার লেআউট):** Single Topbar (64px, `#FFFFFF`), collapsible sidebar (60px/240px), 3-level navigation (Domain > Module > Menu), and zero second topbar.
- **Centralized Tokens (শতভাগ সেন্ট্রালাইজড টোকেনস):** Zero hardcoded hex values in UI components; every color, border, and radius flows from `frontend/src/index.css`.
- **Optional Dark Theme (ঐচ্ছিক ডার্ক মোড):** Dark mode is an ergonomic user choice for night shifts and low-light environments, not a forced default.

---

## 3. Brand Palette & Semantic Tokens (ব্র্যান্ড প্যালেট ও সেমান্টিক টোকেনস)

| Token Name | Hex Code | Purpose & Usage in GarmentIQ |
|---|---|---|
| **Primary / Midnight Navy** | `#142B45` | Brand structure, sidebar navigation, headers, table sticky anchors |
| **Primary Hover** | `#1D3B5A` | Hover state for dark primary structural elements |
| **Primary Soft** | `#E8EEF4` | Selected navigation background, subtle badge background |
| **Accent / Refined Teal** | `#0F766E` | Primary action buttons (CTA), active state indicator, progress |
| **Accent Hover** | `#115E59` | Hover state for teal primary action buttons |
| **Workspace / Soft Slate** | `#F3F5F7` | Main application background (low-glare canvas) |
| **Surface / Cloud White** | `#FFFFFF` | Cards, dialogs, forms, virtual data table grids |
| **Surface Muted** | `#EAF0F4` | Sunken panels, table row hover, segmented tabs, search inputs |
| **Border / Subtle Gray** | `#D8E0E8` | Input borders, separators, card outlines, table gridlines |
| **Text Primary / Deep Slate** | `#182536` | Main headings, table data values, high-contrast body copy |
| **Text Secondary / Slate Muted**| `#526579` | Form labels, descriptions, secondary navigation |
| **Text Muted / Placeholder** | `#64748B` | Form placeholders, metadata, auxiliary timestamps |
| **Success / Forest Green** | `#15803D` | Completed, approved, QC passed, within tolerance |
| **Warning / Amber Ochre** | `#B45309` | Pending review, attention required, nearing SLA limit |
| **Danger / Crimson Red** | `#B91C1C` | Rejected, failed QC, destructive action, overdue shipment |
| **Info / Royal Blue** | `#1D4ED8` | Informational callouts, active system sync notices |

---

## 4. Suggested Color Distribution (স্ক্রিন কালার রেশিও বন্টন)

| Color Family | Approximate Share | Enterprise Ergonomic Guidance |
|---|---:|---|
| **Workspace Neutrals & Surfaces** | **70–80%** | Most of the screen consists of quiet neutral space (`#F3F5F7`) and white content surfaces (`#FFFFFF`). |
| **Navy Structure** | **10–18%** | Navigation sidebar, brand mark, topbar anchors, subtle section headers. |
| **Teal Accent** | **5–8%** | Primary action buttons and selected tab indicators; never color decorative icons arbitrarily. |
| **Semantic Status Colors** | **1–3%** | Badges, alerts, and tolerance exception chips; never used for general decoration. |

---

## 5. Light Theme Tokens (`:root`)

```css
:root {
  color-scheme: light;

  /* Brand Structure */
  --primary: #142B45;
  --primary-hover: #1D3B5A;
  --primary-soft: #E8EEF4;

  /* Primary Accent & Action */
  --accent: #0F766E;
  --accent-hover: #115E59;

  /* Canvas & Surfaces */
  --background: #F3F5F7;
  --surface: #FFFFFF;
  --surface-muted: #EAF0F4;

  /* Typography & Lines */
  --foreground: #182536;
  --muted-foreground: #526579;
  --border: #D8E0E8;

  /* Semantic Status */
  --success: #15803D;
  --warning: #B45309;
  --danger: #B91C1C;
  --info: #1D4ED8;
}
```

---

## 6. Optional Dark Theme Tokens (`.dark`)

```css
.dark,
[data-theme="dark"] {
  color-scheme: dark;

  /* Brand Structure (Dark) */
  --primary: #A9C4E0;
  --primary-hover: #C2D7EB;
  --primary-soft: #253B52;

  /* Primary Accent & Action (Dark) */
  --accent: #5EE0CF;
  --accent-hover: #8AEADD;

  /* Canvas & Surfaces (Dark) */
  --background: #111A24;
  --surface: #192531;
  --surface-muted: #22313F;

  /* Typography & Lines (Dark) */
  --foreground: #E5ECF3;
  --muted-foreground: #A6B5C5;
  --border: #344454;

  /* Semantic Status (Dark) */
  --success: #4ADE80;
  --warning: #FBBF24;
  --danger: #F87171;
  --info: #93C5FD;
}
```

---

## 7. Tailwind CSS 4 `@theme inline` Implementation

In `frontend/src/index.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);

  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);

  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);

  --color-border: var(--border);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-info: var(--info);

  --font-sans: "Inter", "Noto Sans Bengali", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --radius-lg: 0.625rem;
}
```

---

## 8. Master Layout Architecture (একক মাস্টার শেল)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. GLOBAL TOPBAR (64px, Single Header, #FFFFFF, border-b #D8E0E8, z-20)               │
│ [Brand Logo] [Sidebar Toggle]   [Breadcrumb Nav]        [Global Search] [Theme] [User] │
├────────────────────────┬───────────────────────────────────────────────────────────────┤
│ 2. MASTER SIDEBAR      │ 3. WORKSPACE CANVAS (PageShell, bg-background #F3F5F7)        │
│ Fixed top-16 (64px)    │ ┌───────────────────────────────────────────────────────────┐ │
│ Expanded: 240px        │ │ PageHeader: Breadcrumbs + Title + Sticky Action Toolbar   │ │
│ Collapsed: 60px        │ ├───────────────────────────────────────────────────────────┤ │
│                        │ │ KPI Metric Cards Grid (bg-surface, border border-border)  │ │
│ • L1 Domain Picker     │ ├───────────────────────────────────────────────────────────┤ │
│ • L2 Module Accordions │ │ Virtualized Data Table (TanStack Table v8, bg-surface)    │ │
│ • L3 Menu Nav Links    │ └───────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────┘
```

- **Single Topbar Only:** 64px height, sticky top-0, pure white surface (`#FFFFFF`). Zero 2nd topbar.
- **3-Level Navigation Hierarchy:**
  1. **Level 1 (Domain):** Selected via `SidebarDomainPicker` popover at the top of the sidebar.
  2. **Level 2 (Module):** Collapsible accordion group headers with folder icons and badges.
  3. **Level 3 (Menu):** Active route links (`/merchandising/buyers`, `/merchandising/orders`, etc.).

---

## 9. Component Rules (কম্পোনেন্ট ব্যবহারের সুনির্দিষ্ট নিয়ম)

### 9.1 Buttons (`Button.tsx`)
- **Primary Button:** `bg-accent hover:bg-accent-hover text-white` (Refined Teal `#0F766E` with hover `#115E59`). Reserved for primary submit, approve, and save actions.
- **Secondary Button:** `bg-surface hover:bg-surface-muted text-foreground border border-border`.
- **Outline Button:** `bg-transparent hover:bg-accent/10 text-accent border border-accent`.
- **Ghost Button:** `bg-transparent hover:bg-surface-muted text-muted-foreground hover:text-foreground`.
- **Destructive / Danger Button:** `bg-danger hover:bg-red-700 text-white`.

### 9.2 Data Tables (`DataTable.tsx`)
- Data table containers use `bg-surface border border-border rounded-lg shadow-2xs`.
- Table headers use `bg-surface-muted text-foreground font-semibold border-b border-border`.
- Table rows use `hover:bg-background transition-colors` with subtle dividers (`border-b border-border/60`).
- Right-align numeric quantities, fabric weights, prices, and financial amounts.

### 9.3 Forms & Inputs
- Persistent labels in `text-xs font-semibold text-foreground`.
- Input fields use `h-10 px-3 bg-surface border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent`.
- Server-side validation errors trigger `border-danger focus:ring-danger` and display `.erp-error-message`.

---

## 10. Design Sub-Specifications Index

For granular engineering details, consult the following dedicated sub-specifications:

1. [01_TYPOGRAPHY_AND_TYPE_SCALE.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/01_TYPOGRAPHY_AND_TYPE_SCALE.md) — 10-level type scale (10px–36px), font weights, and tabular numbers.
2. [02_COLOR_PALETTES_AND_VARIANTS.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/02_COLOR_PALETTES_AND_VARIANTS.md) — Tonal ramps, hex values, and contrast audit.
3. [03_SPATIAL_GRID_AND_ELEVATION.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/03_SPATIAL_GRID_AND_ELEVATION.md) — 4px/8px baseline grid, radii ramp, and z-index elevation scale.
4. [04_COMPONENT_ANATOMY_AND_VARIANTS.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/04_COMPONENT_ANATOMY_AND_VARIANTS.md) — Button, badge, input, and modal specifications.
5. [05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/05_SCREEN_COLOR_RATIO_AND_COMPONENT_MAPPING.md) — 70-80% / 10-18% / 5-8% / 1-3% distribution matrix.
6. [06_THEME_LAYOUT_ARCHITECTURE.md](file:///g:/ERP-Software/Garments-ERP/docs/specifications/design-system/06_THEME_LAYOUT_ARCHITECTURE.md) — Master shell DOM hierarchy, single topbar, and 3-level sidebar.
