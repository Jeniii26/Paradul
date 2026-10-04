# paradu'l — UI Design System Specification

> Reference: Figma frame **"paradu'l — UI Design System"** (`node-id=20:36`)  
> Implementation: `client/src/styles.css` & `client/index.html`

The visual design system of **paradu'l** follows a high-fashion, editorial aesthetic combining warm porcelain neutrals, rich midnight plum typography, dusky violet interactive elements, dusty rose and sage accents, and framed photographic wardrobe cards.

---

## 1. Color Palette

All colors are recorded as CSS custom properties in `client/src/styles.css` with WCAG AA compliance ($\ge 4.5:1$ contrast ratio for regular text against background).

### Surfaces & Neutrals
| Name | Hex | Code Property | Purpose |
| :--- | :--- | :--- | :--- |
| **Porcelain Canvas** | `#F6F4F2` | `--bg` | Warm linen background for all app pages |
| **Oat Subtle** | `#EFECE7` | `--bg-subtle` | Inset backgrounds, filter containers, toolbars |
| **Card White** | `#FFFFFF` | `--card` | Elevated card surface for clothing items, outfits, and modals |
| **Card Elevated** | `#FAF8F5` | `--card-elevated` | Hover elevation and dropdown menus |
| **Linen Inset** | `#F4F0E8` | `--card-inset` | Warm neutral frame backdrop for background-removed clothing |
| **Border Line** | `#E5E0D8` | `--line` | Clean hairline dividers and card outlines |
| **Strong Border** | `#D1C9BE` | `--line-strong` | Active outlines and emphasized borders |

### Typography & Text
| Name | Hex | Code Property | Contrast vs Canvas |
| :--- | :--- | :--- | :--- |
| **Deep Ink / Plum Charcoal** | `#2B2336` | `--fg` | **10.8:1** (WCAG AAA) |
| **Slate Plum** | `#5D5666` | `--fg-secondary` | **5.4:1** (WCAG AA) |
| **Mauve Grey** | `#8A8393` | `--muted` | Subtitles, helper text, and placeholders |

### Brand & Fashion Accents
| Name | Hex | Code Property | Purpose |
| :--- | :--- | :--- | :--- |
| **Dusky Violet** | `#7E6E98` | `--accent` / `--color-violet` | Primary buttons, active pill tabs, active filters |
| **Violet Hover** | `#6A5B83` | `--accent-hover` | Hover state for primary buttons |
| **Midnight Plum** | `#472C61` | `--accent-active` / `--color-plum` | Display headings, brand titles, deep active buttons |
| **Lilac Mist** | `#F1ECF5` | `--accent-light` | Secondary button backgrounds, active nav pill backgrounds |
| **Dusty Rose / Mauve** | `#C897AA` | `--color-mauve` / `--highlight` | Category accents, chart progress bars, highlights |
| **Soft Lilac** | `#A37C95` | `--color-lilac` | Sub-category indicators, decorative pills |
| **Sage Green** | `#BDC6B7` | `--color-sage` | Bottoms category, available status, clean indicators |
| **Warm Cream** | `#FAF2E9` | `--color-cream` | Notice banners, neutral button backgrounds |
| **Deep Berry / Wine** | `#A2434C` | `--color-berry` | Danger actions, delete buttons, error alerts |

### Category Badges
- **Tops**: Background `#F1ECF5`, Text `#533B6E`, Border `#D5C8E4` (`--top-badge-*`)
- **Bottoms**: Background `#F2F5F0`, Text `#435941`, Border `#C5D3C1` (`--bot-badge-*`)
- **Shoes**: Background `#FAF5ED`, Text `#7D5D3B`, Border `#E8DBC6` (`--sho-badge-*`)

### Laundry & Status Indicators
- **Available / Clean**: Background `#EFF5F1`, Text `#3E6148`, Border `#BDC6B7`
- **In Laundry (7-Day)**: Background `#F3EBF7`, Text `#5A3875`, Border `#D5C5E3`
- **Warning / Overdue**: Background `#FBF4E9`, Text `#87551D`, Border `#ECD5B5`
- **Danger / Error**: Background `#FBF0F1`, Text `#A2434C`, Border `#F0CCD1`

---

## 2. Typography

Two coordinated Google Font families create the editorial balance:

| Role | Font Family | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Display / Serif** | `'Cormorant Garamond', Georgia, serif` | 600, 700, Italic | Brand logo, view titles (`H1`), card headings (`H2-H3`), modal titles, metric stat values |
| **Body & UI** | `'Plus Jakarta Sans', sans-serif` | 400, 500, 600, 700 | Body text, navigation tabs, buttons, chips, form inputs, metadata labels |
| **Monospace** | `ui-monospace, SFMono-Regular, Consolas` | 400 | Code snippets, technical hashes, system IDs |

### Type Scale
- **Display 1 (Hero Title)**: `2.85rem` / `45px` (Cormorant Garamond Bold, line-height 1.05)
- **Title 1 (View Heading)**: `1.65rem` / `26px` (Cormorant Garamond SemiBold, tracking -0.01em)
- **Title 2 (Card / Section)**: `1.25rem` / `20px` (Cormorant Garamond SemiBold)
- **Metric Value (Analytics)**: `2.10rem` / `33px` (Cormorant Garamond Bold)
- **Body Regular**: `0.95rem` / `15px` (Plus Jakarta Sans Regular, line-height 1.55)
- **UI Small / Buttons**: `0.88rem` / `14px` (Plus Jakarta Sans Medium/SemiBold)
- **Badges / Microcopy**: `0.74rem` / `12px` (Plus Jakarta Sans SemiBold)

---

## 3. Spacing Scale

Strict 4px/8px incremental rhythm:

| Token | Size | Code / Common Usage |
| :--- | :--- | :--- |
| `space-1` | `4px` (`0.25rem`) | Chip internal padding, tight icon gaps |
| `space-2` | `8px` (`0.50rem`) | Button icon gaps, card metadata spacing |
| `space-3` | `12px` (`0.75rem`) | Form input padding, toolbar item gaps |
| `space-4` | `16px` (`1.00rem`) | Card interior padding, section margin |
| `space-6` | `24px` (`1.50rem`) | Grid gutter gaps, layout section padding |
| `space-8` | `32px` (`2.00rem`) | Modal interior padding, hero separation |
| `space-12` | `48px` (`3.00rem`) | Page bottom clearance, empty state padding |

---

## 4. Radii & Elevation Scale

### Border Radius
- **Small (`--radius-sm`)**: `6px` – Action buttons, text inputs, small dropdowns
- **Medium (`--radius-md`)**: `10px` – Inset image frames, podium cards, notice blocks
- **Large (`--radius-lg`)**: `14px` – Main wardrobe cards, outfit cards, stat containers
- **Extra Large (`--radius-xl`)**: `20px` – Modal dialogues, login auth container
- **Full Pill (`--radius-full`)**: `9999px` – Filter chips, navigation tabs, status badges, avatar badges

### Shadows (Plum Charcoal Tinted)
- **Low (`--shadow-sm`)**: `0 1px 3px rgba(43, 35, 54, 0.05), 0 1px 2px rgba(43, 35, 54, 0.03)`
- **Medium (`--shadow-md`)**: `0 4px 16px rgba(43, 35, 54, 0.07), 0 1px 4px rgba(43, 35, 54, 0.03)`
- **High (`--shadow-lg`)**: `0 12px 32px rgba(43, 35, 54, 0.10), 0 2px 8px rgba(43, 35, 54, 0.04)`

---

## 5. Reusable Component States

### Buttons
| Variant | Default | Hover | Active / Focus |
| :--- | :--- | :--- | :--- |
| **Primary** | Solid Dusky Violet (`#7E6E98`), White text | `#6A5B83`, translateY(-1px), shadow-sm | `#472C61`, ring: `rgba(126, 110, 152, 0.35)` |
| **Secondary** | Lilac Mist (`#F1ECF5`), Plum text (`#472C61`), border `#D5C8E4` | `#E8DFF0`, border `#7E6E98` | `#D8C9E4` |
| **Neutral** | Warm Cream (`#FAF2E9`), Deep Ink text, border `#E5E0D8` | `#F4ECE0`, border `#D1C9BE` | `#EDE2D2` |
| **Danger** | Deep Berry (`#A2434C`), White text | `#8E3740`, translateY(-1px) | `#792D35` |

### Tags & Chips
- **Inactive**: White card background, border `#E5E0D8`, text `#5D5666`. Hover: Lilac Mist `#F1ECF5`.
- **Active**: Solid Dusky Violet `#7E6E98`, White text, border `#7E6E98`, shadow-sm.

### Clothing & Outfit Cards
- **Normal**: White card background, border `#E5E0D8`, border-radius `14px`, inset photo frame `#F4F0E8`.
- **Hover**: Subtle lift (`translateY(-2px)`), shadow-md, photo zoom (`scale(1.03)`).
- **Selected**: 2px solid Dusky Violet (`#7E6E98`) border with checkmark badge.

### Form Inputs
- **Normal**: White background, 1px solid `#E5E0D8`, border-radius `8px`, text `#2B2336`.
- **Focus**: Border `#7E6E98`, focus ring `0 0 0 3px rgba(126, 110, 152, 0.35)`.

---

## 6. Page & State Handling

1. **Loading State**: Rotating minimalist spinner with Cormorant serif caption `"Loading your digital wardrobe..."`.
2. **Empty State**: Inset circular icon in `--accent-light`, display heading, and descriptive copy with primary CTA button.
3. **Error State**: Rose-tinted alert banner (`#FBF0F1` with `#A2434C` text and border).
4. **Data State**: Responsive CSS grid with smooth transition cards and accessible ARIA attributes.
