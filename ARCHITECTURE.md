# 🏗️ Resilience App — System Architecture

> **Last Updated:** November 1, 2025  
> **Status:** Finalized for MVP Development

---

## 🎯 Core Philosophy

**Resilience over streaks. Privacy by default. Honest tradeoffs.**

- **Self-determined progress:** Users chart their own path; we provide tools, not rules
- **Dual purpose:** Habit-quitting AND habit-building in one interface
- **Resilience metric:** Measures recovery and consistency, NOT perfectionism
- **Privacy-first:** Local-only by default; cloud features are opt-in
- **Radical honesty:** AI breaks privacy; we say so explicitly

**Key principle:** Journaling is highly encouraged across all tiers. Streaks are de-emphasized—we celebrate recovery, not perfection.

---

## 💰 Monetization Tiers

### **Free Tier**
- **6 total habits** (3 build + 3 quit)
- Basic resilience metric (consistency + recovery formula)
- Timeline view of habit logs
- Manual emotion/trigger tagging
- Local-only (no cloud sync)
- Manual export/import for backup
- Journaling encouraged

**Purpose:** Try before you buy. Prove the value.

---

### **Lifetime Unlock — $15 (One-Time)**
- **Unlimited habits** (build + quit)
- **Premium local insights:**
  - Trigger pattern detection (day/time/emotion correlations)
  - Cross-habit analysis ("meditation prevents doom scrolling")
  - Emotional heatmaps (when/where you struggle)
  - Historical trend analysis
- **Local NLP** (TensorFlow.js for sentiment + emotion auto-tagging)
- **Advanced resilience breakdown** (what's helping/hurting your score)
- **Optional cloud sync** (Supabase with RLS protection)
  - Multi-device sync when enabled
  - Still works 100% offline
  - User chooses: privacy (local-only) OR convenience (cloud sync)
- Cross-platform license recovery (via license key)

**Purpose:** The full experience. One payment, forever.

---

### **AI Subscription — $5/month (Requires Lifetime Unlock)**
- **GPT-4 journal analysis** ("Based on your patterns, it seems...")
- **Conversational coaching** (personalized advice for your situation)
- **Dynamic challenge generation** (custom exercises based on your data)
- **Predictive insights** (more sophisticated than local pattern detection)
- **⚠️ Privacy tradeoff acknowledged:**
  - Requires sending journal text to AI providers (OpenAI/Anthropic)
  - User explicitly opts in per feature
  - Less private than local-only mode

**Purpose:** Power users who want a personal coach. Optional, not required.

**Important:** If you don't want AI features, DO NOT subscribe. Lifetime Unlock includes cloud sync; AI Subscription only adds AI capabilities.

---

## 🗄️ Database Architecture

### **Two-Database System**

#### **1. Local Database (Primary, Source of Truth)**
**Technology:** Expo SQLite + expo-sqlite/kv-store  
**Location:** User's device  
**Purpose:** All user data lives here first

**Schema:**
```sql
-- Habits
CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  user_id TEXT,              -- null until cloud sync enabled
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('build', 'quit')),
  created_at INTEGER,
  updated_at INTEGER,
  archived INTEGER DEFAULT 0,
  synced INTEGER DEFAULT 0   -- sync flag
);

-- Habit Logs
CREATE TABLE habit_logs (
  id TEXT PRIMARY KEY,
  habit_id TEXT REFERENCES habits(id),
  timestamp INTEGER,
  emotion_tags TEXT,         -- JSON array
  trigger_tags TEXT,         -- JSON array
  note TEXT,
  synced INTEGER DEFAULT 0
);

-- Journal Entries
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  content TEXT,
  sentiment_score REAL,      -- local NLP result
  emotion_tags TEXT,         -- auto-detected emotions
  keywords TEXT,             -- extracted keywords
  created_at INTEGER,
  synced INTEGER DEFAULT 0
);

-- Resilience Metrics
CREATE TABLE resilience_metrics (
  id TEXT PRIMARY KEY,
  date INTEGER,
  score REAL,
  consistency_factor REAL,
  recovery_factor REAL,
  reflection_factor REAL,
  synced INTEGER DEFAULT 0
);
```

**Data flow:**
```
User action → SQLite (instant) → UI updates immediately
           → Background sync to Supabase (if enabled, when online)
```

---

#### **2. Cloud Database (Optional Sync)**
**Technology:** Supabase (PostgreSQL)  
**Location:** Cloud (user opt-in)  
**Purpose:** Backup + multi-device sync

**Schema (mirrors local):**
```sql
-- Habits (with RLS)
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  archived BOOLEAN DEFAULT false
);

-- Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own habits"
ON habits FOR ALL
USING (auth.uid() = user_id);

-- Similar structure for habit_logs, journal_entries, resilience_metrics
```

**License Management (separate from user data):**
```sql
CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  license_key TEXT UNIQUE,
  product_type TEXT,         -- 'lifetime', 'ai_subscription'
  platform TEXT,             -- 'ios', 'android', 'web'
  purchased_at TIMESTAMP,
  email TEXT,                -- optional, for recovery
  active BOOLEAN DEFAULT true
);

-- RLS: Users can only verify their own license
CREATE POLICY "Users can verify own license"
ON licenses FOR SELECT
USING (license_key = current_setting('request.jwt.claim.license_key', true));
```

**AI Subscription Management:**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_type TEXT,         -- 'ai_monthly', 'ai_annual'
  status TEXT,               -- 'active', 'cancelled', 'expired'
  platform TEXT,             -- 'stripe', 'apple', 'google'
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

---

### **Sync Strategy**

**Local-First Architecture:**
1. All writes go to SQLite first (instant, no lag)
2. Background job syncs changes to Supabase (when online, if enabled)
3. App works 100% offline always
4. Conflict resolution: last-write-wins + timestamp comparison

**User chooses:**
- **Privacy mode:** Local-only, manual export for backup
- **Sync mode:** Automatic Supabase sync, multi-device convenience

---

## 🧠 Intelligence Layers

### **Free Tier: Manual Tagging**
- User manually tags emotions (anxious, stressed, calm)
- User manually tags triggers (work, social, evening)
- Basic timeline view

### **Lifetime: Local NLP (TensorFlow.js)**

**Phase 1 (MVP):** Rule-based sentiment
```typescript
// Simple keyword-based sentiment
const sentimentWords = {
  positive: ['happy', 'grateful', 'proud', 'hopeful', 'calm'],
  negative: ['anxious', 'stressed', 'overwhelmed', 'sad', 'angry']
};

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(word => {
    if (sentimentWords.positive.includes(word)) score += 1;
    if (sentimentWords.negative.includes(word)) score -= 1;
  });
  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}
```

**Phase 2 (Post-MVP):** Lightweight TF.js model
- Pre-trained sentiment classifier (~3-5 MB)
- 75-80% accuracy
- Runs on-device, <500ms inference time
- Auto-tags journal entries with emotions + sentiment score

**Premium Insights (Algorithmic, No AI):**
```typescript
// Trigger pattern detection
function detectTriggers(logs: HabitLog[]) {
  // Group relapses by day of week
  // Find high-frequency days
  // Cross-reference with emotion tags
  // Generate rule-based suggestions
}

// Cross-habit correlation
function findCorrelations(logs: HabitLog[]) {
  // "When you complete A, you're 67% less likely to fail at B"
  // Statistical analysis, not AI
}

// Resilience breakdown
function analyzeResilience(metrics: ResilienceMetric[]) {
  // "Your score dropped 15% this month because:"
  // - Fewer journal entries (-30%)
  // - Longer recovery time (+2 days avg)
}
```

### **AI Subscription: Cloud GPT-4**

**Supabase Edge Function:**
```typescript
// /functions/ai-insight
export default async (req) => {
  const { journal_text, user_id } = await req.json();
  
  // Verify active AI subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('active, expires_at')
    .eq('user_id', user_id)
    .single();
  
  if (!sub?.active || new Date(sub.expires_at) < new Date()) {
    return new Response('AI subscription required', { status: 403 });
  }
  
  // Call OpenRouter / OpenAI API
  const insight = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a supportive habit coach...' },
        { role: 'user', content: journal_text }
      ]
    })
  });
  
  const result = await insight.json();
  
  // Return insight (don't store prompts/responses for privacy)
  return new Response(JSON.stringify({ 
    insight: result.choices[0].message.content 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

**AI Features:**
- Journal sentiment analysis (nuanced, contextual)
- Conversational coaching ("Based on what you wrote...")
- Dynamic challenge generation
- Predictive insights ("Your patterns suggest...")

---

## 🔐 Privacy Model

### **Privacy Levels by Tier**

| Tier | Data Location | Sync | AI | Privacy Level |
|------|---------------|------|-----|---------------|
| **Free (Local)** | Device only | Manual export | None | 🟢 Perfect |
| **Lifetime (Local)** | Device only | Manual export | Local TF.js | 🟢 Perfect |
| **Lifetime (Sync)** | Device + Supabase | Auto sync | Local TF.js | 🟡 Good (RLS) |
| **AI Subscription** | Device + Supabase + AI API | Auto sync | GPT-4 | 🔴 Limited |

### **Privacy Guarantees**

**What we NEVER do:**
- ❌ Behavioral tracking (no analytics without consent)
- ❌ Sell user data
- ❌ Show ads
- ❌ Third-party SDKs (Facebook, Google Analytics, etc.)
- ❌ Collect metadata beyond what's needed for sync
- ❌ Store AI prompts/responses (ephemeral only)

**What we DO:**
- ✅ Default to local-only (no account required)
- ✅ Explicit consent for cloud sync
- ✅ Explicit consent for AI features (with privacy warning)
- ✅ Row Level Security (RLS) on all Supabase tables
- ✅ Easy data export (JSON download)
- ✅ One-click account deletion (cascade deletes all data)
- ✅ Transparent privacy policy (plain English)

### **Data Security**

**Local:**
- Expo SecureStore for sensitive settings (license keys, encryption keys)
- Optional biometric lock (Face ID / fingerprint)
- SQLite stored in app sandbox (OS-level protection)

**Cloud:**
- Supabase RLS (users can only access their own data)
- HTTPS/TLS for all connections
- Optional: client-side encryption for journal entries (future enhancement)

---

## 🔄 License & Payment Flow

### **Purchase Flow**

**iOS/Android:**
1. User purchases via App Store / Google Play
2. Receipt verified on device
3. Generate `license_key` (UUID)
4. Store locally + register on Supabase `licenses` table
5. Unlock features

**Cross-Platform Recovery:**
1. User installs on new device
2. "Restore Purchase" → Enter license key or email
3. Verify against Supabase
4. Unlock features locally

**Offline Grace Period:**
- License stored locally (encrypted)
- If internet unavailable, trust local license for 30 days
- Re-verify when online

### **AI Subscription (RevenueCat)**

**Why RevenueCat:** Handles iOS, Android, and Stripe subscriptions in one SDK

```typescript
import Purchases from 'react-native-purchases';

// Check subscription status
const purchaserInfo = await Purchases.getCustomerInfo();
const hasAI = purchaserInfo.entitlements.active['ai_features'];

// Sync with Supabase
if (hasAI) {
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    status: 'active',
    expires_at: hasAI.expirationDate
  });
}
```

---

## 📊 Resilience Metric Algorithm

**Formula (calculated locally):**

```typescript
function calculateResilience(logs: HabitLog[], journals: JournalEntry[]): number {
  // Factor 1: Consistency (40% weight)
  const totalDays = 30; // last 30 days
  const completedDays = logs.filter(l => l.type === 'completed').length;
  const consistency = completedDays / totalDays;
  
  // Factor 2: Recovery Speed (40% weight)
  const relapses = logs.filter(l => l.type === 'relapse');
  const recoveryTimes = relapses.map(r => {
    const nextSuccess = logs.find(l => 
      l.timestamp > r.timestamp && l.type === 'completed'
    );
    return nextSuccess ? (nextSuccess.timestamp - r.timestamp) / (1000 * 60 * 60 * 24) : 7; // days
  });
  const avgRecovery = average(recoveryTimes);
  const recovery = 1 - Math.min(avgRecovery / 7, 1); // normalize to 0-1 (7 days = 0)
  
  // Factor 3: Reflection (20% weight)
  const journalCount = journals.length;
  const reflection = Math.min(journalCount / 10, 1); // 10+ journals = max score
  
  // Weighted sum (0-100 scale)
  const score = (consistency * 0.4 + recovery * 0.4 + reflection * 0.2) * 100;
  
  return Math.round(score);
}
```

**Philosophy:**
- **NOT** based on streak length (perfectionism)
- **IS** based on getting back up (resilience)
- Rewards self-reflection (journaling)
- Penalizes long recovery times, rewards fast rebounds

**Display:**
```
Resilience Score: 73/100

What's helping:
  ✅ Fast recovery (1.2 days avg)
  ✅ Regular journaling (12 entries this month)

What's hurting:
  ⚠️ Consistency dropped 15% (21/30 days vs. 26/30 last month)
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React Native + Expo SDK ~54 | Cross-platform mobile |
| **Language** | TypeScript (strict mode) | Type safety |
| **Navigation** | Expo Router ~6.0 | File-based routing |
| **Local DB** | Expo SQLite + kv-store | Primary data storage |
| **Cloud DB** | Supabase (PostgreSQL) | Optional sync + auth |
| **Auth** | Supabase Auth | Optional accounts |
| **Payments (iOS/Android)** | RevenueCat | Subscription management |
| **Payments (Web)** | Stripe | Direct integration |
| **Local AI** | TensorFlow.js (React Native) | On-device NLP |
| **Cloud AI** | OpenRouter / OpenAI API | GPT-4 insights |
| **Analytics** | PostHog (self-hosted, optional) | Aggregate metrics only |
| **Animations** | React Native Reanimated | Smooth UX |
| **Gestures** | React Native Gesture Handler | Native feel |
| **Secure Storage** | Expo SecureStore | Encryption keys, licenses |
| **CI/CD** | EAS Build + GitHub Actions | Automated deployment |

---

## 🗺️ Development Roadmap

### **Phase 1: MVP (Weeks 1-4)**
- [ ] Local SQLite setup (habits, logs, journal tables)
- [ ] Basic UI (habit tracker, timeline, journal)
- [ ] Resilience score calculation (local algorithm)
- [ ] Rule-based sentiment analysis
- [ ] Manual tagging (emotions, triggers)
- [ ] Free tier limits (6 habits)
- [ ] In-app purchase flow (lifetime unlock)
- [ ] Local license verification

### **Phase 2: Premium Features (Weeks 5-8)**
- [ ] Pattern detection algorithms (triggers, correlations)
- [ ] Premium insights UI (heatmaps, trends)
- [ ] Lightweight TF.js NLP model (sentiment + emotions)
- [ ] Advanced resilience breakdown
- [ ] Export/import functionality

### **Phase 3: Cloud Sync (Weeks 9-12)**
- [ ] Supabase setup (schema, RLS policies)
- [ ] Auth flow (anonymous or email)
- [ ] Background sync engine (conflict resolution)
- [ ] License verification via Supabase
- [ ] Cross-platform license recovery

### **Phase 4: AI Subscription (Post-MVP)**
- [ ] RevenueCat integration
- [ ] Supabase Edge Functions (AI API calls)
- [ ] AI consent flow UI
- [ ] GPT-4 journal insights
- [ ] Conversational coaching
- [ ] Dynamic challenge generation

### **Phase 5: Polish & Launch**
- [ ] Biometric lock (Face ID / fingerprint)
- [ ] Push notifications (habit reminders)
- [ ] Onboarding flow
- [ ] Settings dashboard (privacy controls)
- [ ] Beta testing (TestFlight + Google Play Internal)
- [ ] App Store submission

---

## 🎭 User Experience Principles

1. **Offline-first:** App never breaks due to connectivity
2. **Fast:** All actions instant (local-first architecture)
3. **Honest:** No dark patterns, explicit tradeoffs
4. **Forgiving:** No streak shame, celebrate recovery
5. **Elegant:** Minimalist UI, focus on content
6. **Empowering:** User controls data, features, privacy

---

## ✅ Success Metrics (Non-Invasive)

**What we measure (aggregated, anonymized):**
- Daily active users (DAU)
- Conversion rate (free → lifetime)
- Subscription retention (AI features)
- Crash reports (error tracking only)

**What we DON'T measure:**
- Individual user behavior
- Habit types or content
- Journal text or sentiment
- Time spent in app (no surveillance)

**Analytics approach:**
- Self-hosted PostHog (optional, opt-in)
- Event tracking (e.g., "habit_created", "journal_entry_saved")
- No PII, no content, just counts

---

## 🔮 Future Enhancements (Post-Launch)

- **Peer accountability:** Anonymous buddy matching
- **Guided courses:** CBT, Stoicism, habit science
- **WearOS / watchOS:** Quick check-ins from wrist
- **Desktop app:** Electron-based journaling
- **Data viz dashboard:** Advanced analytics export
- **Self-hosted option:** Deploy your own Supabase instance
- **Open source:** Public audit of codebase

---

## 📝 Notes

**Why this architecture works:**
1. **Privacy-respecting:** Default is local-only, cloud is opt-in
2. **Scalable:** Supabase handles growth, local-first handles offline
3. **Monetizable:** Clear value tiers, no subscription trap
4. **Honest:** AI = less private, we say so explicitly
5. **Philosophical alignment:** Resilience, self-determination, honesty

**Key decisions locked in:**
- ✅ Local-first architecture (SQLite primary)
- ✅ Three-tier pricing (Free, Lifetime, AI Subscription)
- ✅ Cloud sync included in Lifetime (not separately monetized)
- ✅ RLS for privacy (not E2E encryption, pragmatic choice)
- ✅ TF.js for local NLP (good enough for MVP)
- ✅ RevenueCat for subscriptions (cross-platform)
- ✅ Resilience metric over streaks (philosophy-aligned)

**Questions resolved:**
- ✅ Privacy vs. AI: Honest tradeoff, user chooses
- ✅ Sync vs. local: Optional, both supported
- ✅ Free vs. paid: Generous free tier, clear value in paid
- ✅ Lifetime vs. subscription: Both, for different features
- ✅ Local NLP feasibility: Yes, TF.js for sentiment + emotions

---

**Last updated:** November 1, 2025  
**Next step:** Start Phase 1 — Build the local SQLite foundation

*"Find your North. Forge your Path."*

