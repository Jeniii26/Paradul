# App Proposal — paradu'l

## 1. Project Overview

### App Name
**paradu'l**

### One-Sentence Summary
**paradu'l** is a web application that helps users digitally organize their wardrobe, mix and match outfits, and use personalized data insights to make smarter fashion choices.

---

## 2. Target Audience & Problem Statement

### Who It Is For
* **Target Users:** People who want to maximize the use of their existing clothes, understand their personal style, and curb impulsive fast-fashion shopping habits.
* **Core Job to Be Done:** 
  1. Digitally catalog existing clothes with transparent background cutouts.
  2. Plan and style 3-piece coordinated outfits (Top, Bottom, Shoes).
  3. Schedule looks on a calendar and track what has actually been worn.
  4. Automatically track laundry readiness (7-day wash cycle for Tops and Bottoms).
  5. Gain objective wardrobe analytics (total closet value in ₱, most worn clothes, and wear logs).

---

## 3. Application Structure & Core Sections

The application is structured into **4 primary navigation views**:

| # | Section / Route | Purpose & Key Features |
|---|---|---|
| **1** | **Digital Wardrobe Gallery** | View, search, and filter individual clothing items by category (Tops, Bottoms, Shoes), color, style, max price (₱), and laundry status. Upload new clothing photos with client-side canvas background removal. Quick actions to edit metadata, toggle laundry status, or delete items. |
| **2** | **Outfit Manager** | Mix and match items into strictly coordinated 3-piece outfits (1 Top, 1 Bottom, 1 Shoes). Live visual stack preview, direct scheduling to the calendar, and a smart clean-clothes randomizer that strictly excludes items in laundry. |
| **3** | **Calendar & Outfit Planner** | Schedule looks for specific dates and occasions. Filter by All Events, Scheduled, or Confirmed Worn. Contains the **`[ Mark as Worn ]`** action which confirms wear, records wear events, and automatically places Tops and Bottoms into 7-day laundry while exempting shoes. |
| **4** | **Wardrobe Analytics** | Data insights derived from confirmed wear events: 3 KPI cards (Total Wardrobe Value in ₱, Most Used Outfit, Most Used Color), Laundry & Availability readiness bar, Category Distribution progress bars, Top 3 Most Used Clothing podium with rank badges (#1, #2, #3), and Recent Wear Logs chronological history. |

---

## 4. Application State & Data Architecture

The application holds relational data managed through a unified API layer connecting to **Supabase (PostgreSQL + Auth)** with offline `localStorage` fallback:

| Data Entity | Shape (Schema) | Owner / Store | Changes When... |
|---|---|---|---|
| `clothingItems` | `[{ id, name, category, color, price, style, laundryStatus, laundryUntil, imageUrl, details }]` | App / API Store | A user uploads a new piece, edits clothing metadata, toggles clean/laundry status, deletes an item, or when an outfit is marked worn. |
| `savedOutfits` | `[{ id, name, topId, bottomId, shoesId, style, occasion }]` | App / API Store | A user creates a new 3-piece combination, uses the randomizer to save a look, edits an outfit, or deletes an outfit. |
| `schedules` | `[{ id, outfitId, date, occasion, notes, status }]` | App / API Store | A user plans an outfit for a calendar date, updates event notes, cancels a plan, or clicks `[ Mark as Worn ]`. |
| `wearRecords` | `[{ id, scheduleId, outfitId, wornDate, createdAt }]` | App / API Store | A user confirms that a scheduled look was actually worn today. |

---

## 5. Screen Breakdown & UI Blocks

### Screen 1: Digital Wardrobe Gallery
* **Hero Motivational Quote Banner:** Dynamic editorial quote cycling per session with laundry basket artwork.
* **Category Filter Pills:** All | Tops | Bottoms | Shoes.
* **Filter & Search Toolbar:** Status (All, Clean, In Laundry), Color, Style, Max Price (₱1,000, ₱2,000, ₱3,000), and live search input.
* **Clothing Card Grid:** Inset photo frames with checkered backdrops, status dot badges, micro-category, Cormorant Garamond serif titles, descriptions, color indicators, wear counters, and hover quick-actions (Edit, Laundry toggle, Delete).
* **Upload Modal:** File picker, multi-stage processing UX, client-side background removal toggle, assisted detection, and manual metadata confirmation.
* **Edit Modal:** Form to edit name, category, color, price, style, and laundry status.

### Screen 2: Outfit Manager
* **Heading Actions:** "Randomize" secondary button and "Create Outfit" primary button with proper design system spacing.
* **3-Piece Outfit Cards:** Trio of photo frames (Top, Bottom, Shoes), micro-label, serif title, wear badge, schedule button, and edit/delete actions.
* **Outfit Creator & Randomizer Modal:** 3-tier selector with clean-only filter guarantee and real-time visual stack preview.

### Screen 3: Calendar & Outfit Planner
* **Category Filter Pills:** All Events | Scheduled | Confirmed Worn.
* **Horizontal Event Cards:** Mauve (Scheduled) and Sage (Worn) date badges, trio of piece thumbnails, uppercase piece summary, notes, and `[ Mark as Worn ]` interactive trigger.

### Screen 4: Wardrobe Analytics
* **3 KPI Summary Cards:** Total Wardrobe Value (summed once without double counting), Most Used Outfit, and Most Used Color.
* **Laundry & Availability Section:** Clean vs In Laundry counts with an animated availability readiness bar.
* **Category Distribution Section:** Progress bars showing Tops, Bottoms, and Shoes ratios.
* **Top 3 Most Used Clothing:** Podium grid with rank badges (#1, #2, #3) counted strictly from confirmed wear records.
* **Recent Wear Logs:** Chronological table displaying Date, Outfit Name, and Style badge for the last 5 confirmed wears.

---

## 6. Technical Stack & Service Architecture

* **Frontend:** React 19 (Vite), CSS Custom Properties design system with `Cormorant Garamond` (editorial serif display) and `Plus Jakarta Sans` (clean sans body).
* **Backend-as-a-Service (BaaS):** **Supabase** (PostgreSQL database, Row-Level Security, and Supabase Auth).
* **Local Fallback:** Namespaced browser `localStorage` engine with simulated network delay ensuring 100% offline usability.
* **Image Processing:** Client-side HTML5 Canvas perimeter-sampling algorithm for background removal and auto-scaling to prevent storage bloat.
* **Hosting & Deployment:** 
  * Live on **Vercel**: [https://paradul.vercel.app/](https://paradul.vercel.app/)
  * Live on **GitHub Pages**: [https://jeniii26.github.io/Paradul/](https://jeniii26.github.io/Paradul/)

---

## 7. Key Project Risks & How They Were Resolved

* **Initial Risk (Image Upload & Storage):** Handling user image uploads efficiently without slow performance, file bloat, or dependence on expensive third-party paid cloud services like Cloudinary.
* **Resolution:** Implemented client-side HTML5 Canvas processing that automatically downscales photos (max 640px) and strips backgrounds in the browser. This allows transparent PNGs to be stored directly in Supabase or browser storage without exceeding payload limits.
* **Business Logic Integrity Risk:** Preventing saved or scheduled outfits from corrupting actual wear data.
* **Resolution:** Enforced an explicit `WearRecord` entity created exclusively when the user clicks `[ Mark as Worn ]`. All analytics counters and podium rankings compute strictly from verified `WearRecord` instances.
