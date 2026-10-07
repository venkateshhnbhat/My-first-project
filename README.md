# AuraCare — AI-Powered Dynamic Mental Health Monitoring & Distress Prediction System

A privacy-preserving, trauma-informed digital health web application designed to voluntarily record mental-health-related indicators and provide longitudinal insights about changes in reported distress over time.

---

## ⚠️ Critical Safety & Non-Diagnostic Notice

> **AuraCare is a mental-health screening, monitoring, and early-support system, NOT a medical diagnostic platform.**
> 
> * The system never diagnoses depression, PTSD, anxiety disorders, or any other psychiatric condition.
> * System estimates are presented in supportive, observational language (e.g., *"Your recent responses indicate an increase in reported distress"*).
> * The platform prioritizes immediate human support, trusted contacts, qualified mental-health professionals, and emergency crisis hotlines in elevated situations.
> * If you are in immediate danger or experiencing severe crisis, please contact local emergency authorities or call/text **988** (US/Canada).

---

## ✨ Features

- **Voluntary Daily Check-In**: 1–10 controlled rating sliders for Mood, Stress, Anxiety, Sleep Quality, Energy, Social Connection, and Daily Functioning.
- **Optional Reflective Journal**: Encrypted private reflections with optional AI-assisted emotional signal detection.
- **Dynamic Trend Analysis Engine**: Deterministic calculations across 7, 14, and 30-day windows calculating moving averages, variance, persistence, volatility, and percentage drift.
- **Non-Diagnostic Distress Screening**: 0–100 standardized Composite Distress Index categorized into `LOW`, `MODERATE`, `HIGH`, or `URGENT_SUPPORT`.
- **Early-Warning Supportive Guidance**: Actionable steps, grounding techniques, and recommendations to connect with supportive people or professionals.
- **Verified Support Directory**: Filterable directory of crisis hotlines, text lines, and international directories (988, Crisis Text Line 741741, Trevor Project, Samaritans, Befrienders Worldwide).
- **Emergency Support Portal**: Fast, accessible crisis guidance with box-breathing exercises.
- **Data Sovereignty & Privacy Controls**:
  - One-click full JSON personal data export.
  - Per-item deletion of check-ins and journal reflections.
  - Permanent account and data purge.
  - Informed consent withdrawal.
- **Database Isolation & Security**:
  - Supabase PostgreSQL schema with strict Row Level Security (RLS) on all user tables.
  - Check constraints (1–10 limits) and automated `updated_at` triggers.
  - Secure backend Express API integrating Google Gemini (`@google/genai`) with Zod schema validation.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router 6
- **Backend**: Node.js, Express, TypeScript, `@google/genai`, Helmet, CORS, Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 4. Supabase Database Migration
Execute the SQL migration located in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor to set up tables, triggers, and Row Level Security policies.

### 5. Environment Variables
Copy `.env.example` to `.env` and configure credentials:
```env
# Frontend
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api

# Backend
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
```

---

## 📜 License & Ethics

Built with deep respect for survivor dignity, autonomy, and privacy. Free for personal health tracking.
