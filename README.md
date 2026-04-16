# FitTrack — Health & Budget Dashboard

A web application built for Pakistani university students to track their health metrics and manage their monthly budget in one place.

**Student:** Ayan Ahmed | **ID:** 23044295 | **Year:** 2026

---

## Features

- **BMI Calculator** — Enter weight and height to get your BMI, category, and personalised diet advice
- **Weight History Tracking** — Every BMI calculation is logged with a date; the Analytics page plots your real progress over time
- **PKR Budget Tracker** — Enter your monthly allowance and daily spending to see how much you'll save or overspend
- **Calorie Tracker** — Track daily intake against your calorie goal
- **Analytics Dashboard** — Line chart of real weight history and a doughnut chart of budget breakdown
- **Meal Hub** — Four budget-friendly healthy recipes with a full ingredient and instruction modal
- **Streak Counter** — Calculates consecutive days you've logged your weight (real data, not hardcoded)
- **Dark Mode** — Persists across all pages using localStorage
- **Cloud Sync** — Settings saved to Firebase Firestore, linked to your anonymous session

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 / CSS3 | Structure and styling |
| JavaScript (ES Modules) | All interactivity and logic |
| Firebase Firestore | Cloud storage for user profile/settings |
| Firebase Auth (Anonymous) | Per-user data isolation |
| Chart.js | Weight and budget charts |
| localStorage | Weight history, BMI, budget data |

---

## Setup & Running

This is a static web app — no build step required.

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. Go to **Settings** and fill in your profile, then click **Save & Sync to Cloud**
4. Return to the Dashboard to start logging your BMI daily

> **Note:** The app uses Firebase Anonymous Authentication. Each browser session automatically gets its own user ID, so your data is private to your browser. No login is required.

---

## File Structure

```
fittrack/
├── index.html       # Dashboard — BMI, budget, calorie calculators + reference tables
├── analytics.html   # Charts — real weight history + budget breakdown
├── meals.html       # Meal Hub — recipe cards with modal pop-ups
├── settings.html    # Profile & goal settings, cloud sync
├── script.js        # All JavaScript logic (Firebase, calculators, dark mode, streak)
├── analytics.js     # Chart rendering using real localStorage data
├── style.css        # All styles including dark mode and mobile responsive layout
└── README.md        # This file
```

---

## Key Design Decisions

**Why anonymous auth instead of email login?**
Firebase Anonymous Auth gives every user their own Firestore document (keyed by `uid`) without requiring a sign-up form. This means no two users share data, while keeping the experience frictionless for a student-facing prototype.

**Why localStorage for weight history?**
Weight entries are logged locally (up to 30 entries) for instant access by the Analytics page without a Firestore read on every visit. Cloud sync is reserved for the profile settings which rarely change.

**Why PKR?**
The app is designed specifically for Pakistani students. Budget amounts, food items (roti, daal), and calorie references are all contextualised for a local audience.

