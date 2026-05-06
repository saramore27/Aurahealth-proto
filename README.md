# 🌿 AuraHealth

Holistic health platform. Ayurvedic + modern solutions, fitness tracking, yoga/mudra guide, AI chatbot for symptoms + navigation + YouTube links. Store medical history local.

## ✨ Features

**🌿 Ayurveda & Modern**  
Dosha quiz, herb profiles, modern health tips

**🏃 Fitness Tracker**  
Log workouts (type, duration, calories, steps). View today stats + full history

**🧘 Yoga & Mudra**  
Step-by-step poses, mudras, breathing exercises. Modal detail views

**🤖 AI Chatbot**  
Symptom insights, app navigation commands, curated YouTube health videos

**📋 Medical History**  
Store, filter, manage health records (diagnoses, prescriptions, labs). Local only

## 🚀 Get Started

Pure frontend. No server. No build.

**Clone + Run**
```bash
git clone https://github.com/saramore27/AuraHealth.git
cd AuraHealth
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```


**Or serve local** (better for CDN fonts/icons):
```bash
npx serve .
# visit http://localhost:3000
```
## 🗂️ Structure

```
AuraHealth/
├── index.html              # Main SPA
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── app.js              # Core: nav, utils
│   ├── ayurveda.js         # Dosha quiz, herbs, tips
│   ├── fitness.js          # Workout log + stats
│   ├── yoga.js             # Poses, mudras, breathing
│   ├── chatbot.js          # AI: symptoms, YouTube, nav
│   └── medical.js          # Medical history CRUD
└── README.md
```

## 🤖 Chatbot Examples

| Input | Response |
|-------|----------|
| headache, stress, fatigue | Symptom insights + ayurvedic tips + YouTube links |
| yoga videos, meditation | Curated YouTube recommendations |
| open fitness, go to yoga | Navigate to section |
| tips, help | General health advice |

## 💾 Data Storage

All data in browser localStorage. Nothing leave device.

## 🔮 Roadmap

- Wearables integration (heart rate, steps sync)
- Personalised daily tips
- Community forums
- Expert partnerships + teleconsult
- PWA support
