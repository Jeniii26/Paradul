# paradu'l

## 1. Overview

**paradu'l** is a web application that helps users digitally organize their wardrobe, mix and match outfits, and use personalized data insights to make smarter fashion choices.

It aims to address impulsive shopping and wardrobe underutilization by providing users with a visual inventory of the clothing items they already own, allowing them to better understand and manage their personal style.

---

## 2. Setup and Installation

> **Status:** The application is currently in **Week 2 — Full Local Prototype & Feature Integration**. 
> All core client features, local persistence (`localStorage`), real device photo uploads, client-side background removal, 3-piece outfit management, calendar scheduling, 7-day automatic laundry tracking, and closet analytics are fully functional.
>
> *Note on Supabase:* Supabase integration has intentionally not been implemented in this phase. The application runs locally without external database credentials or API keys.

### Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended) installed on your machine.
* Git installed on your machine.
* A modern web browser (Chrome, Edge, Firefox, Safari).

### Clone the Repository

```bash
git clone https://github.com/Jeniii26/Paradul-Tongol.git
cd Paradul-Tongol
```

### Install Dependencies

Run the following command inside the `client` folder:

```bash
cd client
npm install
```

### Environment Variables

No external API keys or database environment variables are required for Week 2.

The application operates with `VITE_USE_MOCK_API=true` by default, running against the local browser data store and simulated network latency.

---

## 3. How to Run

### Start the Development Server

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL displayed in your terminal:

```text
http://localhost:5173
```

### Run Automated Tests

To run the verification test suite covering laundry business rules, wear calculations, and analytics:

```bash
npm test
```

### Build for Production

```bash
npm run build
```

---

## 4. Features and Usage (Week 2)

### 1. Mock Authentication
* **Fashion-Forward Login View:** Includes paradu'l branding, email, password, "Remember me", and "Forgot password?" hint.
* **Instant Prototype Access:** Click **"Use Demo Account"** to automatically fill `demo@paradul.com` / `paradul123`, or enter any valid-looking email.
* **Session Persistence:** Login state persists in browser storage with an accessible logout action in the top navigation bar.

### 2. Digital Wardrobe Gallery
* **Transparent PNG Neutral Backdrop:** Clothing cards feature a subtle checkered backdrop specifically designed to display transparent, background-isolated clothing assets crisply.
* **Detailed Metadata Display:** Item name, category badge (`Top`, `Bottom`, `Shoes`), color indicator chip, price formatted in Philippine Pesos (`₱`), style tag, and laundry status.
* **Combinable Multi-Filters:**
  * **Primary Category Filter:** Quick pills to filter by All Pieces, Tops, Bottoms, or Shoes.
  * **Secondary Filters:** Filter by Color, Style, Max Price (up to ₱1,000, ₱2,000, ₱3,000), or live text search across names, colors, and styles.
  * **Laundry Status:** Filter by Available or In Laundry.
  * **Reset Action:** Instant "Reset" button clears all active filters.
* **Quick Laundry Toggle:** Quickly mark any item clean/available or send it to laundry directly from the card.

### 3. Real Photo Upload & Image Processing
* **Device Upload:** Select image files from your computer or drag and drop into the upload zone.
* **Processing UX Pipeline:**
  1. `Preparing your clothing photo...`
  2. `Removing background & isolating clothing...`
  3. `Detecting clothing type and color palette...`
  4. `Ready!` (with visual progress bar)
* **Background Removal:** Client-side HTML5 Canvas perimeter-sampling algorithm isolates clothing from solid or studio backdrops and outputs a real transparent PNG.
* **Preview Mode Switch:** Users can toggle between **"Background Removed (Transparent)"** and **"Original Photo"**.
* **Assisted Clothing Detection:** Analyzes silhouette aspect ratios and dominant RGB colors to pre-select category and color.
* **Manual Metadata Confirmation:** Users can verify or edit the item name, category, color, price (₱), style, and initial laundry status before saving.
* **Graceful Fallback:** If automatic isolation encounters issues, users can click "Use Original Image", retry, or cancel.

### 4. Outfit Manager & Coordinated Outfits
* **Strict 3-Piece Structure:** Every outfit requires exactly **1 Top**, **1 Bottom**, and **1 pair of Shoes** before it can be saved.
* **Live Synchronized Preview:** 3-tier visual stack updates in real time as pieces are selected.
* **Random Outfit Generator:**
  * Clicking **"Randomize Look"** pairs 1 clean top, 1 clean bottom, and 1 clean pair of shoes.
  * **Strictly excludes** any clothing items currently marked as `in_laundry`.
  * Allows re-randomizing or swapping individual pieces.
* **Outfit Actions:** Directly schedule an outfit to the calendar, edit its components, or delete the outfit (deleting an outfit preserves its clothing items).

### 5. Calendar & Outfit Planner
* **Scheduled vs. Worn Distinction:**
  * **Scheduled:** Represents the user's plan to wear an outfit on a given date.
  * **Worn:** Confirmed actual wear. Outfits on the calendar are not considered worn until confirmed.
* **`[ Mark as Worn ]` Action:**
  * Confirms the outfit was worn and creates a `WearRecord` for Analytics.
  * **Automatic 7-Day Laundry:** Automatically places the outfit's **Top** and **Bottom** into laundry for 7 days (`laundryUntil = wearDate + 7 days`).
  * **Shoes:** Kept clean and unaffected (shoes are managed manually).
* **Schedule Management:** Add, edit, or delete calendar events with date, occasion, and notes.

### 6. Laundry Lifecycle & Expiration
* **Automatic Expiration:** Whenever wardrobe data is loaded, `processLaundryExpiration` checks if `currentDate >= laundryUntil`. If expired, status automatically reverts to `available` without requiring a continuously running server process.
* **Manual Override:** Users can toggle laundry status at any time, which takes immediate precedence over automatic schedules.

### 7. Wardrobe Analytics & Style Insights
* **Top 3 Most Used Clothing:** Counted strictly from verified `WearRecord` logs (saved or scheduled outfits do not count). Features #1 Gold, #2 Silver, and #3 Bronze podium cards.
* **Most Used Outfit:** Displays the outfit combination with the highest wear count.
* **Most Used Color:** Analyzes colors across all pieces worn in confirmed outfits.
* **Total Wardrobe Value:** Sums the price of every active clothing item exactly once in Philippine Pesos (`₱`).
* **Closet Distribution:** Category breakdown bars and laundry availability ratio.
* **Recent Wear Logs:** Chronological log table of verified wear events.

### 8. Local Data Persistence
* Data is stored in browser `localStorage` and persists across page reloads:
  * `paradul:clothing`
  * `paradul:outfits`
  * `paradul:schedules`
  * `paradul:wear_records`
  * `paradul:auth_user`
* A **"Reset Demo"** button in the header allows restoring the default dataset at any time.

---

## 5. Project Structure

```text
Paradul-Tongol/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── index.js              # Unified API gateway (mockApi vs httpApi)
│   │   │   ├── mockApi.js            # LocalStorage persistence with simulated delay
│   │   │   ├── httpApi.js            # HTTP client for future Express/PostgreSQL backend
│   │   │   └── sampleData.js         # Pre-loaded wardrobe items, outfits, and wear history
│   │   ├── services/
│   │   │   ├── authService.js        # Mock authentication and session management
│   │   │   ├── laundryService.js     # 7-day wear laundry rules and expiration logic
│   │   │   ├── analyticsService.js   # Pure calculations for top items, outfits, and value
│   │   │   └── imageProcessingService.js # Canvas background removal & detection
│   │   ├── components/
│   │   │   ├── common/               # Modal, Badge, and SVG Icons
│   │   │   ├── Gallery/              # GalleryView, ClothingCard, UploadModal
│   │   │   ├── OutfitManager/        # OutfitManagerView, OutfitCard, OutfitCreatorModal
│   │   │   ├── Calendar/             # CalendarView, ScheduleModal
│   │   │   ├── Analytics/            # AnalyticsView
│   │   │   ├── Header.jsx            # Top navigation bar and user menu
│   │   │   ├── Login.jsx             # Mock login view
│   │   │   └── DemoNotice.jsx        # Demo mode indicator banner
│   │   ├── App.jsx                   # Central state orchestration and tab routing
│   │   ├── main.jsx                  # React application entry point
│   │   └── styles.css                # Design system tokens, checkered canvas, and styling
│   ├── test-services.js              # Automated test suite for business rules & analytics
│   ├── index.html                    # Application HTML shell
│   ├── package.json                  # Dependencies and scripts (dev, build, test)
│   └── vite.config.js                # Vite configuration
│
├── server/                           # Express & PostgreSQL scaffolding for Week 3
│   ├── db/
│   │   ├── pool.js
│   │   ├── run.js
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── server.js
│   └── package.json
│
├── docs/                             # Project planning documents and design systems
├── compose.yml                       # Container setup
└── README.md                         # Project documentation
```

---

## 6. Screenshots

*(Screenshots will be added as UI development progresses.)*

---

## 7. Progress & Next Steps

### Completed in Week 2
* [x] Polished, cohesive fashion UI design system with light/dark theme support.
* [x] Mock authentication with persistent user session.
* [x] Digital Wardrobe Gallery with multi-criteria combinable filtering and search.
* [x] Real device photo upload with client-side canvas background removal and assisted detection.
* [x] 3-piece Outfit Manager (Top, Bottom, Shoes) with live visual stack preview.
* [x] Intelligent Random Outfit Generator strictly excluding items in laundry.
* [x] Calendar & Outfit Planner with explicit "Scheduled" vs. "Worn" distinction.
* [x] Automatic 7-day laundry transition for Tops and Bottoms upon wear.
* [x] Automatic laundry expiration check on load and manual override capabilities.
* [x] Wardrobe Analytics (Top 3 items, top outfit, top color, total wardrobe value).
* [x] Browser `localStorage` data persistence across sessions.
* [x] Automated test suite verifying business logic and calculations (14/14 tests passing).

### Next Steps (Week 3)
1. Updating `server/db/schema.sql` to represent clothing items, outfits, schedules, and wear logs in PostgreSQL.
2. Implementing Express API routes in `server/server.js` corresponding to `httpApi.js`.
3. Connecting the React frontend to the live Express API (`VITE_USE_MOCK_API=false`).
4. Preparing deployment configurations for client, server, and database.
5. Future migration to Supabase Auth and Supabase Storage.

---

## 8. AI Usage

AI tools are used during development as a supporting resource for:
* Assisting with boilerplate scaffolding and component layout design.
* Implementing client-side canvas algorithms for background removal and dominant color extraction.
* Structuring test suites for business logic verification.
* Reviewing code quality, accessibility, and documentation.

All AI-generated code and architecture are reviewed, tested, and understood by the developers. The project developers remain responsible for the implementation and functionality of the application.
