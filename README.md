# 🇮🇳 Smart Bharat – AI-Powered Civic Companion

> **Team:** DEVENGERS | **Hackathon:** PromptWars 2026 | **Category:** Smart Bharat – AI Civic Companion

---

## 🚀 Live Demo

🔗 **Deployed App:** [Deploy to GitHub Pages or Netlify — see below]

📁 **GitHub Repository:** *(set to public before submission)*

---

## 📖 Project Description

**Smart Bharat** is a GenAI-powered civic companion platform designed to bridge the gap between Indian citizens and government services. It features **Seva Sathi**, an intelligent AI chatbot that understands natural language questions in English, Hindi, Tamil, Telugu, Bengali, and Marathi, and provides structured, actionable guidance on government schemes, document requirements, and civic issue resolution.

### Core Problems Solved

| Problem | Solution |
|---|---|
| Citizens don't know which schemes they're eligible for | Yojana Finder with filters by category, state, income |
| Government website language is complex | Seva Sathi AI simplifies and explains in plain language |
| Document rejection due to missing paperwork | Interactive Document Checklist with step-by-step guides |
| No easy way to report and track civic issues | Issue Reporter with GPS + AI image analysis + Tracker |
| Language barriers for non-English speakers | 6 language UI with voice I/O |
| Accessibility for differently-abled citizens | High contrast mode, font scaling, screen-reader support |

---

## ✨ Features

### 🤖 Seva Sathi – AI Civic Companion
- **Gemini 2.0 Flash** integration via user-provided API key for live intelligent responses
- Smart rule-based fallback for 100% offline functionality
- **Voice Input** (Web Speech API) and **Text-to-Speech** output
- Multilingual chat: English, Hindi, Tamil, Telugu, Bengali, Marathi
- Covers: Aadhaar, Passport, PM-KISAN, Ayushman Bharat, scholarships, housing, driving license, and more

### 📋 Yojana Finder
- 14 real government schemes with filter by category, state, and income
- One-click "Ask Seva Sathi" to get detailed eligibility guidance
- Direct links to official government portals

### 📍 Civic Issue Reporter
- Issue categories: Pothole, Garbage, Water, Electricity, Sewer, Encroachment
- **Leaflet.js map** with click-to-pin location + GPS geolocation
- AI image analysis simulation (detects issue type and severity from photo)
- Persistent local storage tracking

### 📊 Complaint Tracker
- Real-time status tracking with visual timeline
- Search by tracking ID, location, or title
- Color-coded issue type badges

### 📄 Document Guide (Kagaz-Patra)
- Interactive document checklists for 7 major services
- Step-by-step application process guide
- Direct links to official portals
- Progress tracker (documents collected)

### ♿ Accessibility
- High Contrast Mode (WCAG compliant)
- Font scaling (80%–150%)
- Screen reader landmarks and ARIA labels
- Keyboard navigable

---

## 🧠 Prompt Workflow / Strategy

### Prompt Engineering Architecture

```
Citizen Query
     │
     ▼
[Language Detection]
     │
     ▼
[Intent Classification]  ──────────────────────────────────
     │                                                      │
  Scheme         Document         Issue         General     │
  Query          Query            Query         Civic       │
     │               │               │          Query       │
     ▼               ▼               ▼            │         │
[Keyword           [Service      [Reporting   [Default  ◄───┘
 Matching]          Lookup]       Flow]        Response]
     │               │               │
     ▼               ▼               ▼
[Gemini API] → [Structured Response] → [Rendered in Chat]
     │
[Fallback: Rule-based KB if no API key]
```

### System Prompt Strategy

```
You are Seva Sathi, an AI civic companion for Indian citizens.
Answer this question about government services, schemes, or civic issues 
in a helpful, structured way.
If the question is in Hindi or another Indian language, respond in the same language.
Question: [user_query]
```

### Key Prompt Design Decisions

1. **Role Injection**: The model is explicitly told it's "Seva Sathi" — an Indian civic companion — to anchor responses in the correct domain.
2. **Language Mirroring**: The prompt instructs the model to auto-detect and respond in the user's language.
3. **Domain Grounding**: The system message restricts the model to civic/government topics, preventing hallucinations.
4. **Graceful Fallback**: When no Gemini API key is provided, a rich rule-based knowledge base (15 topics) handles common queries at 100% accuracy.
5. **Structured Formatting**: Responses use markdown-style bold text, numbered lists, and emoji for visual clarity rendered in the chat UI.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| AI / LLM | Google Gemini 2.0 Flash API |
| Maps | Leaflet.js + OpenStreetMap |
| Fonts | Google Fonts (Outfit, Inter, Noto Sans Devanagari) |
| Speech | Web Speech API (STT + TTS) |
| Storage | Browser LocalStorage (offline-first) |
| Deploy | GitHub Pages / Netlify |

---

## 🛠️ Local Setup

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/smart-bharat.git
cd smart-bharat

# Serve locally
python -m http.server 8000

# Open browser
http://localhost:8000
```

No build step, no npm, no dependencies to install. Pure static web app.

---

## 🌐 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "🇮🇳 Smart Bharat – AI Civic Companion"
git remote add origin https://github.com/<YOUR_USERNAME>/smart-bharat.git
git push -u origin main
```

Then enable GitHub Pages: Settings → Pages → Source: `main` branch, `/ (root)`

---

## 📸 Screenshots

*(Add screenshots of dashboard, chat, scheme finder, and issue reporter here)*

---

## 👥 Team DEVENGERS

Built with ❤️ for Digital India

> *"Build. Learn. Lead. Impact."* 💛🖤
