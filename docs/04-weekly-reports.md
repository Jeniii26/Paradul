# Weekly Reports — paradu'l

---

## Week of: October 9, 2026 (Finals Week)

### What changed this week
* **Full Wireframe Redesign (Figma & `wireframes.pdf`):** Completely overhauled the user interface to match the refined wireframe specification. Implemented the warm porcelain canvas (`#F6F4F2`), midnight plum typography (`#472C61`), Cormorant Garamond serif headers, Plus Jakarta Sans body text, ornamental flourish dividers (`◇ ꕤ ◇`), and the hero motivational quote banner with laundry basket artwork.
* **Supabase BaaS Integration:** Connected the application directly to Supabase as our Backend-as-a-Service (BaaS) for PostgreSQL database storage and user authentication, backed by offline `localStorage` fallback resiliency.
* **Clothing Metadata Editing:** Added an "Edit" quick-action on clothing cards opening a full metadata edit modal (allowing users to update name, category, color, price, style, and laundry status).
* **Analytics Enhancements:** Expanded the Analytics tab to include the Laundry & Availability readiness gauge, Category Distribution progress bars, Recent Wear Logs chronological table, and updated the Top 3 Most Used Clothing podium with `#1`, `#2`, `#3` rank badges.
* **Design System Spacing & Responsive Polish:** Corrected button spacing between "Randomize" and "Create Outfit" in the Outfit Manager, resolved card margin gaps in Analytics, refined wear logs column alignment, and ensured seamless responsiveness across desktop, tablet, and mobile breakpoints.
* **Dual Production Deployment:** Successfully deployed the production application to both **Vercel** ([https://paradul.vercel.app/](https://paradul.vercel.app/)) and **GitHub Pages** ([https://jeniii26.github.io/Paradul/](https://jeniii26.github.io/Paradul/)) with automated GitHub Actions CI/CD.
* **Project Clean-Up:** Audited and removed legacy course starter template files (ghost sightings, unused docker compose, and dead components).

### Why
To complete the final project submission requirements. These changes bring the prototype to production maturity: fulfilling the visual aesthetic specified in our Figma wireframes, enabling real cloud data persistence via Supabase, and providing accessible public deployments on both Vercel and GitHub Pages.

### What broke or what I got stuck on
* **GitHub Pages Subpath 404s:** Hardcoded root image paths (`/logo.png`, `/banner.png`) loaded on Vercel (root domain) but produced 404 errors on GitHub Pages because it runs in a subfolder (`/Paradul/`). Resolved by dynamically prepending Vite's `import.meta.env.BASE_URL`.
* **Missing Supabase Keys in GitHub Actions:** Because `.env` is gitignored, the initial GitHub Pages build defaulted to the offline mock API. Resolved by injecting the Supabase publishable credentials in `.github/workflows/deploy.yml`.
* **Glued Cards in Analytics:** The Top 3 Podium card lacked a bottom margin, causing it to sit flush against the Recent Wear Logs card with zero gap. Resolved by setting `margin-bottom: 32px` and fixing table column proportions.

### What is left
**None.** The project is 100% complete, fully deployed, and verified with all 14 automated tests passing.

---

## Week of: September 27, 2026 (Week 2)

### What changed this week
* **Mock Authentication:** Built a mock login page with session persistence (localStorage), email/password validation, and a quick-fill demo account button (`demo@paradul.com` / `paradul123`).
* **Top Navigation Shell:** Created the 4 primary tabs (Gallery, Outfit Manager, Calendar, Analytics) with active state indicators, user profile pill, and demo reset control.
* **Digital Wardrobe Gallery:** Built the wardrobe inventory grid with transparency-safe checkered backdrops, metadata chips (category, color, ₱ price, style, laundry status), and combinable filters (category, color, style, max price, laundry status, and live search).
* **Real Photo Upload & Canvas Image Processing:** Implemented real file picker upload with a multi-stage processing UX (preparing, isolating background, assisted detection), HTML5 Canvas perimeter-sampling background removal producing transparent PNGs, preview mode toggle (isolated vs original), and assisted category/color detection with manual correction.
* **Outfit Manager & Randomizer:** Created the 3-piece outfit builder enforcing exactly 1 Top + 1 Bottom + 1 pair of Shoes with live visual stack preview, along with an intelligent Randomizer that strictly excludes items currently in laundry.
* **Calendar & Outfit Planner:** Implemented scheduled vs. worn tracking, calendar event management (add, edit, delete), and a `[ Mark as Worn ]` action.
* **Laundry Lifecycle Engine:** Built the automatic 7-day laundry cycle (marking an outfit worn automatically sets tops and bottoms to `in_laundry` for 7 days while shoes remain unaffected), automatic expiration on load (`currentDate >= laundryUntil`), and manual override toggling.
* **Wardrobe Analytics:** Built the analytics view calculating Top 3 most used clothing items (strictly from verified wear records), most used outfit, most used color, total wardrobe value in ₱ (summed once without double counting), category ratios, and chronological wear logs.
* **Data Layer & Testing:** Integrated a unified API layer with localStorage persistence and added an automated 14-point test suite (`npm test`) that verifies all business rules.
* **Documentation:** Updated README.md to reflect Week 2 deliverables, feature breakdowns, and the updated project directory structure.

### Why
These changes were made to complete Week 2 deliverables by converting the Week 1 minimal scaffold into a fully working, polished, interactive local prototype. This allows testing all core user journeys, business logic, outfit coordination, 7-day laundry cycles, and closet insights directly in the browser before wiring up the PostgreSQL database and Express backend.

### What broke or what I got stuck on
* **Vite Build Export Error:** The production build failed during Rollup bundling because `IconEdit` was imported in `OutfitCard.jsx` but was missing from `Icons.jsx`. Resolved by adding the missing SVG icon export.
* **PowerShell Command Chaining:** Attempting to chain `npm test && npm run build` produced a PowerShell syntax error because `&&` is not supported in standard Windows PowerShell. Resolved by using `;` as the separator.
* **Browser LocalStorage Quota:** Uploading raw high-resolution photos directly from cameras or phones quickly threatens the ~5MB browser localStorage limit. Solved by downscaling uploaded images on an in-memory canvas (max 640px) before converting to data URLs.
* **Analytics Integrity:** Ensuring analytics strictly reflected verified wear events rather than merely saved or scheduled outfits required creating an explicit `WearRecord` model triggered only when the user confirms an outfit as worn.

### What is left
* Express & PostgreSQL Backend (Week 3): Updating `server/db/schema.sql` to model clothing items, outfits, calendar schedules, and wear logs in PostgreSQL.
* API Endpoints: Implementing Express CRUD routes in `server/server.js` matching `httpApi.js`.
* Frontend-Backend Switch: Flipping `VITE_USE_MOCK_API=false` and pointing the React client to the live API base URL.
* Deployment: Deploying the client to GitHub Pages, the Express API to a hosting service (e.g., Render), and the PostgreSQL database.
* Future Supabase Integration: Migrating mock authentication to Supabase Auth and file storage to Supabase Storage in subsequent milestones.

---

## Week of: September 23, 2026 (Week 1)

### What changed this week
Cloned the project repository, initialized the React front-end using Vite, and built a functional, logic-driven UI skeleton for the Wardrobe Gallery using React state.

### Why
To prove the foundational data flow (clothing items, outfits, and wear logs) works before connecting a real database or styling the interface.

### What broke or what I got stuck on
I struggled with understanding the required file structure and routing between the workspace and the GitHub repository, and had to troubleshoot Vite configuration errors and missing `package.json` files.

### What is left
Styling the application to match the Figma design system, setting up the Express server/Postgres database, and connecting the front-end to the backend.
