# Demo Video & Deployment

## Links

- **Demo Video:** [Watch the Video Recording](https://drive.google.com/drive/folders/1KLe95kHFs4N8nk9EJBeRkLDtNpXZLj50?usp=sharing)
- **Live Deployed App:** [https://paradul.vercel.app/](https://paradul.vercel.app/)

---

## How to Access the Live Application

1. Open the live site in any modern web browser: **[https://paradul.vercel.app/](https://paradul.vercel.app/)**
2. **Sign In or Register:**
   - On the authentication screen, you can create a new personal account by clicking **Create Account**, or sign in directly with an existing account.
   - Enter your email and password (minimum 6 characters) to enter the app.
3. **Exploring the 4 Main Features:**
   - **Gallery:** Browse clothing items, filter by category (Tops, Bottoms, Shoes), color, price, or laundry status, and toggle items between clean and laundry.
   - **Outfit Manager:** Build and view 3-piece coordinated outfits (1 Top, 1 Bottom, 1 Shoes), preview the visual stack, or use the clean-only outfit randomizer.
   - **Calendar:** View planned outfits by date and click `[ Mark as Worn ]` to confirm an outfit was worn, which automatically schedules a 7-day laundry period for Tops and Bottoms while keeping Shoes clean.
   - **Analytics:** View live calculations for the Top 3 Most Used clothing pieces, Top Outfit, Top Color, and Total Wardrobe Value in Philippine Pesos (`₱`).

---

## Video Presentation Structure

I recorded this 3 to 4-minute demonstration following this structure:

### 1. Introduction (0:00 – 0:30)
- **What I show:** The live deployed website on Vercel at [https://paradul.vercel.app/](https://paradul.vercel.app/), starting on the Gallery view.
- **What I explain:**
  - I introduce myself and my project, **paradu'l** — a digital wardrobe and mindful style management app.
  - I explain the problem I wanted to solve: helping people stop impulsive fast-fashion shopping by rediscovering, organizing, and styling clothes they already own.
  - I highlight that I designed this as a personal closet management tool rather than an e-commerce shopping catalog.

### 2. Main Flow Walkthrough (0:30 – 2:45)
- **What I show:**
  - **Gallery:** I filter pieces by Tops, Bottoms, and Shoes, show metadata formatted in Philippine Pesos (`₱`), and demonstrate how I display transparent clothing cutouts. I show the manual laundry toggle button on an individual card.
  - **Outfit Manager:** I showcase the strict 3-piece structure (1 Top, 1 Bottom, 1 Shoes) and demonstrate the clean outfit randomizer that automatically filters out dirty clothes currently in the laundry.
  - **Calendar & Automated 7-Day Laundry:** I navigate to the calendar, locate a scheduled outfit, and click `[ Mark as Worn ]`. I demonstrate the cross-system sync: the event is confirmed, the Top and Bottom automatically receive a 7-day laundry schedule in the Gallery while Shoes remain clean, and the wear count updates in Analytics.
  - **Analytics:** I show the real-time podium for Top 3 Most Used clothes, Top Outfit, Top Color, and total wardrobe value calculated without double-counting.

### 3. Technical Deep Dive: Code I Wrote Myself (2:45 – 3:25)
- **What I show:** I switch to my code editor and open `client/src/services/laundryService.js`.
- **What I explain:**
  - I showcase the business logic functions I authored: `applyWearToClothingLaundry` (lines 64–91) and `processLaundryExpiration` (lines 40–61).
  - I explain my design decision: when an outfit is worn, my code isolates Tops and Bottoms for the 7-day laundry cycle while exempting Shoes, because shoes are cleaned manually and do not belong in weekly wash cycles.
  - I explain how I made laundry expiration check timestamps client-side whenever the wardrobe loads (`currentDate >= laundryUntil`), allowing items to automatically become clean after 7 days without needing an expensive background server cron daemon.
  - I mention my 14-test verification suite in `client/test-services.js` that tests this expiration logic and calendar boundaries.

### 4. Honest Reflection (3:25 – 3:55)
- **What I explain:**
  - If I were starting this project over from scratch, I would set up a relational database schema in PostgreSQL or Supabase with foreign keys and Row-Level Security right from Day 1.
  - Starting with browser `localStorage` state arrays allowed me to prototype quickly in Week 1, but migrating interconnected relational data (outfits referencing clothing IDs, and calendar events referencing outfit IDs) required refactoring my API services later. Starting with a relational database earlier would have saved refactoring time.

---

## Pre-Recording Checklist I Followed

- [x] Verified the live deployed site at [https://paradul.vercel.app/](https://paradul.vercel.app/) before recording
- [x] Pre-seeded realistic clothing items, outfits, and calendar schedules
- [x] Closed all personal tabs, notifications, and hidden `.env` files
- [x] Recorded with my own voice in a single take without slides
