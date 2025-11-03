
# 🧭 Project Overview — *Resilience: A Self-Mastery App*

> “Find your North. Forge your Path.”

---

## 🎯 Vision

**Resilience** is a privacy-first, cross-platform self-improvement and habit-formation app designed to help users quit destructive habits *and* build empowering ones.  
It embodies the philosophy of **self-overcoming** — inspired by Nietzschean ideas of will, accountability, and human potential.  
Rather than enforcing shameful streaks or rigid systems, the app focuses on **resilience**, **reflection**, and **intentional action**.

Users are not bound by external validation; the app merely **nudges**, never dictates.

---

## 💡 Core Philosophy

- **Self-determined progress:** users chart their own path; the app provides tools, not rules.  
- **Dual purpose:** habit-quitting *and* habit-building.  
- **Resilience metric:** replaces streaks; measures recovery, consistency, and learning.  
- **Privacy-first:** data stored locally and encrypted; cloud sync is optional.  
- **Tone:** empowering, not preachy — “You are the master of your fate.”

---

## ⚙️ Tech Stack

| Layer | Tool / Library | Purpose |
|-------|----------------|----------|
| **Framework** | React Native + Expo SDK | Unified Android, iOS, Web codebase |
| **Language** | TypeScript | Type safety and clarity |
| **Backend (BaaS)** | Supabase | Auth, database, edge functions |
| **Offline DB** | Expo SQLite / WatermelonDB | Local-first habit logs and stats |
| **AI** | On-device TensorFlow.js + optional cloud AI (OpenRouter / Hugging Face) | Smart suggestions, journaling sentiment |
| **Push Notifications** | Expo Notifications (FCM + APNs) | Habit reminders and resilience updates |
| **Secure Storage** | Expo SecureStore | Biometric lock and encryption |
| **CI/CD** | Expo EAS + GitHub Actions | Automated builds and deploys |
| **Analytics** | PostHog (self-hosted) | Behavioral insights without tracking users |
| **Design** | Figma | UI/UX prototyping and flow design |

---

## 📱 Core MVP Features

1. **Quick Setup / Onboarding** — select goals, habits, tone, privacy settings.  
2. **Habit Tracker** — track *good* and *bad* habits in the same interface.  
3. **Resilience Score** — adaptive metric reflecting effort, reflection, and recovery.  
4. **Coping Toolbox** — breathing guides, CBT micro-lessons, grounding tools.  
5. **Trigger Map & Patterns** — visualize emotional/temporal triggers.  
6. **Smart Journal** — logs emotion, progress, and AI-driven reflections.  
7. **Offline Mode** — full functionality without internet.  
8. **Biometric Lock** — optional local privacy control.  
9. **AI Integration (Optional)** — on-device sentiment + cloud reflection suggestions.  
10. **Customization** — user-defined theme, philosophy tone (strict, gentle, stoic).  

---

## 🧠 Extended Features (Post-MVP)

- Peer accountability (anonymous buddy or AI coach)  
- Data export and visualization dashboard  
- Guided resilience courses  
- WearOS / watchOS companion  
- AI-powered insights and challenge creation  

---

## 🎨 Brand Identity

- **Motif:** Compass — direction, will, mastery  
- **Tagline:** *Find your North. Forge your Path.*  
- **Primary Color:** Royal Gold `#C5A02E`  
- **Secondary Color:** Charcoal `#2B2B2B`  
- **Accent:** Deep Teal `#184D47`  
- **Font:** Cinzel / Playfair Display (serif elegance) + Inter (body text)  
- **Logo Concept:** `TBD`

---

## 🧩 Folder Structure (Expo Project)

```bash
resilience/
│
├── app/                   # Expo Router pages
│   ├── index.tsx          # Home / dashboard
│   ├── habits/            # Habit logs & detail screens
│   ├── journal/           # Journaling + reflections
│   ├── settings/          # Preferences, privacy, tone
│   └── onboarding/        # Setup flow
│
├── components/            # Reusable UI blocks
├── lib/                   # Supabase, AI, and utility modules
├── assets/                # Images, fonts, icons
├── db/                    # Local DB schema (SQLite / Watermelon)
├── hooks/                 # Custom React hooks
└── README.md
```

---

## 🧠 Development Plan

| Phase | Timeline | Goal |
|--------|-----------|------|
| **Week 1–2** | Design + Architecture | UI mockups in Figma, define DB schema |
| **Week 3–4** | Core Habit Engine | Local DB + basic UI flow |
| **Week 5–6** | Resilience Metric + Analytics | Reflection & insights screens |
| **Week 7** | AI Integration + Testing | Sentiment + journaling AI |
| **Week 8** | Beta & Polishing | EAS builds, internal test release |
| **Launch** | **Jan 1, 2026** | Soft Launch (Google Play + TestFlight) |

---

## 💰 Monetization Plan

1. **Free Core App:** All essential tools available offline.  
2. **One-Time Unlock / Lifetime License:** unlocks premium insights, AI suggestions, and unlimited habits.  
3. **Optional AI Subscription:** for cloud-based coaching and advanced analytics.  
4. **Affiliate / Content Integrations:** mindful courses, book recs, or productivity tools.  
5. **Ethical Ads (Phase 2):** minimal, optional, context-aware.

---

## 🔒 Privacy Philosophy

- Offline-first architecture  
- No behavioral tracking, only anonymous metrics  
- Local encryption using SecureStore + optional Supabase sync  
- Clear data export & deletion tools  
