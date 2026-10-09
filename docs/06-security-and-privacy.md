# Security and Privacy Checklist — paradu'l

Work through this **before your first push**, and again before you submit. It is
short, none of it is exotic, and a grader can check most of it in two minutes.

Your repository is public, in your own account, and permanent. That is the point
of it, and it is also why this file exists.

---

## 1. Repository Hygiene & Secret Protection

- [x] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it.
- [x] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing.
- [x] `.env.example` is committed, with **placeholder** values only.
- [x] No private connection strings, secret keys, or passwords anywhere in the repository or screenshots.
- [x] No `student.json`, and no student numbers or sensitive credentials committed.

---

## 2. The Application & Backend Security

- [x] **Row-Level Security (RLS) in Supabase:** Configured on all database tables (`clothing_items`, `outfits`, `schedules`, `wear_records`) so users can only read and mutate their own data via `auth.uid() = user_id`.
- [x] **Client-Side Sanitization & Validation:** Inputs are trimmed, length-limited, and sanitized before payload creation.
- [x] **Safe Public Client Keys:** Only the publishable Supabase anonymous key (`sb_publishable_...`) is embedded in the client build, strictly governed by PostgreSQL RLS.
- [x] **Stateless JWT Authentication:** Managed securely through Supabase Auth without plaintext credentials in local stores.
- [x] `npm audit` run, and dependencies kept up to date without high-severity vulnerabilities.

---

## 3. Privacy & Philippine Data Privacy Act (RA 10173) Compliance

- [x] **No real classmates' names, numbers, emails, or personal photos** anywhere in seed data, screenshots, or demo materials.
- [x] **Invented / Stock Clothing Assets:** All sample items use clean, neutral illustrations or royalty-free clothing photography.
- [x] **Minimal Data Collection:** The application only collects what is functionally required for wardrobe styling (piece names, categories, colors, prices, and wear dates). No location, biometric, or contact harvesting.
- [x] **Local Image Processing:** Background removal and photo downscaling occur entirely client-side inside the user's browser canvas before transmission, preventing raw personal photo leaks to third-party APIs.

---

## 4. Security & Privacy Reflection (Journal Entry)

> **Risk & Tradeoff Analysis:**  
> The highest-risk element of **paradu'l** was handling user-uploaded personal clothing photos and private wardrobe valuations. Rather than transmitting raw high-resolution user photos to third-party cloud vision APIs where image privacy could be compromised, I made the conscious engineering tradeoff to execute image keying and background removal directly in the browser using an HTML5 Canvas algorithm. Furthermore, on the database tier, I enforced PostgreSQL Row-Level Security (RLS) policies tied to `auth.uid() = user_id` across all tables, ensuring that even if the public client API key is visible in network requests, unauthorized users cannot read or modify another person's closet data.
