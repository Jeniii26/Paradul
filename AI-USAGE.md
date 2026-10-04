# AI Usage

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

This project was built with AI assistance. This file is the record of it. It is
graded as the finals badge, and it is worth 100 points.

> **Note on commit history:**  
> On September 23 and 24, my time was spent writing, clarifying, and updating `README.md` and setting up the initial Week 1 project structure. Because of that, `AI-USAGE.md` was not committed separately on those first two days. I kept my prompt notes and consolidated all entries here when my Week 2 prototype features came together on September 27.

---

## 1. How I used AI

At least six entries. One per real use. Every entry needs a commit link.

### 2026-09-23 - Initial project concept and README

- **Tool:** ChatGPT (GPT-4o)
- **What I asked for:** Help drafting the initial project description, value proposition, and feature outline for **paradu'l**, a digital wardrobe app meant to help people stop buying clothes impulsively.
- **What it gave back:** A draft README that read like an e-commerce website with shopping carts, checkout screens, and product catalogs.
- **What I kept, what I changed, and why:** I kept the core problem statement about organizing clothes you already own to reduce unnecessary shopping. I deleted all the shopping cart and checkout parts because paradu'l is a personal closet organizer, not an online clothing store.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/6cc1bac70550a7048cc469abf2e67ac936963b75

### 2026-09-24 - Week 1 scaffolding and React state

- **Tool:** Claude 3.5 Sonnet
- **What I asked for:** A simple single-file React component (`App.jsx`) for Week 1 using React state arrays to hold clothing items, saved outfits, and logged outfits.
- **What it gave back:** A basic React component with `clothingItems`, `savedOutfits`, and `wearLogs` arrays, an "+ Add Item" button, and placeholder images.
- **What I kept, what I changed, and why:** I kept the state-driven approach. I adjusted the clothing properties (type, color, season, price) to fit what I wanted for the app, and kept the UI unstyled to meet the Week 1 demo mode requirements without adding unnecessary complexity.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/d94082ae33a844f6b6912b75f865cbcd2f2af2a1

### 2026-09-27 - Background removal using HTML5 Canvas

- **Tool:** Google Antigravity (Gemini 3.8 Flash)
- **What I asked for:** A way to let users upload clothing photos from their device and remove the background locally in the browser without relying on external cloud APIs or huge model downloads.
- **What it gave back:** An `imageProcessingService.js` file that draws the image onto a canvas, checks the edge pixels to detect the background color, and turns matching pixels transparent.
- **What I kept, what I changed, and why:** I kept the canvas background keying approach. I added an automatic resize step (capping photos at 640px) so image data doesn't exceed browser `localStorage` limits (around 5MB). I also added edge feathering so clothing edges look smooth, and added a preview toggle button so users can compare the transparent image with their original photo.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

### 2026-09-27 - 3-piece outfit builder and randomizer

- **Tool:** Google Antigravity (Gemini 3.8 Flash)
- **What I asked for:** Components to create, edit, preview, and randomize 3-piece outfits made of 1 Top, 1 Bottom, and 1 Shoes.
- **What it gave back:** `OutfitCreatorModal.jsx` and `OutfitCard.jsx` with category dropdowns and a randomizer function.
- **What I kept, what I changed, and why:** The AI's randomizer picked items at random without checking if they were clean. I changed it so it strictly filters out clothes currently in the laundry (`laundryStatus !== 'in_laundry'`). I also added validation so the user cannot save an outfit unless all three pieces are selected, and built the real-time visual stack preview.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

### 2026-09-27 - Calendar scheduling and 7-day automatic laundry

- **Tool:** Google Antigravity (Gemini 3.8 Flash)
- **What I asked for:** A calendar view to schedule outfits on specific dates and trigger laundry when an outfit is marked as worn.
- **What it gave back:** A calendar event handler that marked outfits as worn and put every item in the outfit into laundry.
- **What I kept, what I changed, and why:** I kept the schedule event structure (`id`, `outfitId`, `date`, `occasion`, `status`). I changed the laundry logic so shoes are left clean (shoes are washed manually). For tops and bottoms, I set a 7-day return date (`wearDate + 7 days`). I also added an expiration check that runs whenever the app loads so clean clothes automatically become available once the 7 days are up.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

### 2026-09-27 - Closet analytics and automated tests

- **Tool:** Google Antigravity (Gemini 3.8 Flash)
- **What I asked for:** Functions in `analyticsService.js` to calculate top 3 most worn clothes, top outfit, top color, and total wardrobe value in Philippine Pesos (`₱`), plus a test script.
- **What it gave back:** Analytics calculation functions and basic assertions.
- **What I kept, what I changed, and why:** The AI calculated wear counts based on saved outfits. I changed this completely: saving an outfit doesn't mean you wore it! I made analytics count only verified `WearRecord` logs that get created when someone clicks "[ Mark as Worn ]". I also made sure wardrobe value counts each clothing item only once, even if it is in multiple outfits. Finally, I built a 14-test suite in `test-services.js` that runs with `npm test`.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

---

## 2. Where the AI got it wrong

Three cases. Be specific. If you write that the AI was never wrong, this section
scores zero.

### Case 1 - Suggested a 40MB AI model for an offline prototype

- **What it gave me:** When I asked how to isolate clothing images from backgrounds, the AI suggested installing `@imgly/background-removal`, an npm package that downloads over 40MB of neural network files from the internet while the app is running.
- **What was wrong with it:** For a local prototype and school grading, downloading 40MB at runtime causes timeout errors, CORS issues, and crashes when offline.
- **What I did instead:** I had it build a native HTML5 Canvas script using perimeter color sampling. It runs 100% locally in under a second with zero downloads, and I added a toggle button so the user can easily fall back to their original photo if needed.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

### Case 2 - Counted saved outfits as "worn" in analytics

- **What it gave me:** The AI wrote a function that calculated how many times clothes were worn by counting how many times an item appeared in `savedOutfits`.
- **What was wrong with it:** Saving an outfit is just planning, not wearing it. If I created three different outfits with my white shirt, the AI counted that as 3 wears even if I never wore it once in real life.
- **What I did instead:** I separated "Scheduled" from "Worn" and created an independent `WearRecord` list. The analytics functions now strictly count wears from verified wear logs created only when the user clicks "[ Mark as Worn ]" on the Calendar.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

### Case 3 - Imported an icon that was never created, breaking the build

- **What it gave me:** In `OutfitCard.jsx`, the AI imported `{ IconEdit }` from `../common/Icons.jsx`.
- **What was wrong with it:** It forgot to actually create `IconEdit` in `Icons.jsx`. The development server loaded fine, but when I ran `npm run build`, Vite/Rollup crashed with an error: `"IconEdit" is not exported by "src/components/common/Icons.jsx"`.
- **What I did instead:** I opened `Icons.jsx`, wrote the missing SVG code for the edit pencil icon, exported it, and tested `npm run build` again until it built with 0 errors.
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c

---

## 3. Who wrote what

At least a fifth of this project is code you wrote yourself. Name it, and explain
it in your own words.

### Written by me

#### Part 1: Laundry rules and automatic expiration
- **File:** `client/src/services/laundryService.js`
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c
- **What it does and why it is built this way:**  
  I wrote the business rules for tracking clean and dirty clothes:
  1. `applyWearToClothingLaundry`: When an outfit is worn, it automatically puts the top and bottom into laundry for 7 days (`wearDate + 7 days`). It leaves shoes alone because shoes are cleaned manually and don't go into weekly laundry.
  2. `processLaundryExpiration`: This function checks the dates every time the app loads. If today is past the 7-day laundry date (`todayStr >= item.laundryUntil`), it automatically turns the item back to "Available". This is built this way so the app doesn't need a complex backend server running 24/7 just to update laundry status.
  3. `toggleItemLaundryStatus`: Lets the user manually click a button on any clothing card to flip it between "Available" and "In Laundry" anytime.

#### Part 2: Calendar workflow and "Mark as Worn" confirmation
- **File:** `client/src/components/Calendar/CalendarView.jsx`
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c
- **What it does and why it is built this way:**  
  I designed the calendar user interface and how outfits are tracked over time:
  - I created a clear visual difference between "Scheduled" (a planned outfit for a future date) and "Worn" (an outfit you actually wore).
  - I built the `[ Mark as Worn ]` button. When clicked, it coordinates three things across the app at once: it changes the calendar event status to "worn", creates a wear record that updates the Analytics page, and marks the top and bottom as in laundry for 7 days in the Gallery.
  - It is built this way so that a single user action updates all parts of the app consistently without duplicate code.

#### Part 3: Automated verification test suite
- **File:** `client/test-services.js`
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c
- **What it does and why it is built this way:**  
  I wrote an automated test script using Node.js's built-in `node:assert` module. It runs with `npm test` and tests 14 distinct rules across the app:
  - Email format validation
  - 7-day laundry date calculations and month boundaries
  - Automatic laundry expiration when the date arrives
  - Manual laundry toggles
  - Analytics calculations: top 3 most worn items, top outfit, top color, and wardrobe value without double counting.  
  It is built this way so I can run `npm test` anytime and immediately know if any core business logic broke.

---

### The AI-written part I understand best

- **File:** `client/src/services/imageProcessingService.js`
- **Commit:** https://github.com/Jeniii26/Paradul-Tongol/commit/401aa7816789a1b6e4cf8f39eb218e412341b20c
- **What it does and why I kept it:**  
  This file handles the client-side background removal when a user uploads a clothing photo from their phone or computer.

  Here is how it works step-by-step:
  1. **Loads and resizes the photo:** It takes the uploaded image file and draws it on an invisible HTML5 canvas. It shrinks it down to at most 640 pixels wide so it doesn't take up too much memory in `localStorage` (which only allows ~5MB).
  2. **Samples the background color:** It samples the pixels along the four outer edges of the image (top, bottom, left, and right borders) to find the average background color (for example, a white wall, bedsheet, or studio backdrop).
  3. **Removes the background:** It loops through every pixel in the picture and calculates the color distance to the background color. If the color is close to the background, it sets the alpha channel to 0, making that pixel completely transparent. It also softens the edges so the clothes don't look jagged.
  4. **Detects category and color:** It looks at the shape (aspect ratio) and the non-transparent pixels to automatically guess if the item is a Top, Bottom, or Shoes, and what color it is.

  I kept this code because it runs 100% in the browser in less than half a second, requires no external servers or API keys, and outputs real transparent PNG images for my wardrobe gallery.
