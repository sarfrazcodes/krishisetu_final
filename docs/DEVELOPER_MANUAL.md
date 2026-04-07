# KrishiSetu - Comprehensive Developer Manual

Welcome to the ultimate step-by-step developer manual for **KrishiSetu**, an AI-powered agricultural marketplace platform connecting farmers and buyers. This guide is written so comprehensively that even a beginner can understand the overall architecture, the tech stack, and step-by-step instructions on how to recreate this project from scratch.

---

## 🏗️ 1. Project Overview & Architecture

### What is KrishiSetu?
KrishiSetu is an intelligent platform designed for:
1. **Farmers**: To view commodity prices, get weather-based farm advisories, and list their crops for sale. They can even use their **Voice** to add listings in regional languages.
2. **Buyers**: To browse available crop listings, view predicted price trends to make smart buying decisions, and trace the crop's origin.

### The Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, Framer Motion (for animations), Recharts (for price graphs).
- **Backend**: Python [FastAPI](https://fastapi.tiangolo.com/), Uvicorn.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL wrapper).
- **Machine Learning**: Scikit-Learn, XGBoost, Pandas (for price prediction models).
- **Generative AI API**: Google Gemini (`google-genai` SDK) for voice intent classification and fallback price predictions.
- **External APIs**: 
  - `data.gov.in` (Agrim API) to fetch daily Mandi prices.
  - OpenWeather API to fetch current weather for advisory generation.

---

## 📂 2. Understanding the File Structure

The workspace (`krishisetu/`) is divided mainly into two microservices and a machine learning folder:

```text
krishisetu/
├── backend/               # FastAPI Python Server
│   ├── app/
│   │   ├── db/            # Supabase connection
│   │   ├── ml_models/     # Pre-trained XGBoost joblib files (.joblib)
│   │   ├── routes/        # FastAPI API Endpoints (crops.py, voice.py, listings.py, etc.)
│   │   ├── services/      # Core business logic (crop_service.py, voice_service.py)
│   │   ├── dependencies.py# Reusable auth dependencies
│   │   └── main.py        # Application entry point
│   ├── requirements.txt   # Python Dependencies
│   └── .env               # Secrets (API Keys)
│
├── frontend/              # Next.js Application
│   ├── app/               # App Router pages (farmer-dashboard, buyer-dashboard, etc.)
│   ├── components/        # Reusable React components (Charts, UI, Navigation)
│   ├── services/          # Frontend API wrappers (voice.ts)
│   └── package.json       # Node.js Dependencies
│
└── ml/                    # Jupyter notebooks and dataset processing scripts
```

---

## 🚀 3. Step-by-Step Guide: Building the Backend

The backend is clearly the brains of the operation. It interfaces with databases, AI models, and APIs.

### Step 3.1: Initialize the Environment
To build the backend, you must have Python installed.
1. Navigate to the backend folder: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (On Windows)
4. Install requirements:
   `pip install fastapi uvicorn supabase python-dotenv google-genai requests pandas xgboost scikit-learn joblib`

### Step 3.2: Configure the Database (Supabase)
KrishiSetu uses Supabase. You need to create a free account on Supabase, create a project, and run the following SQL tables:
* `users` - ID, name, role (farmer/buyer).
* `crops` - ID, name.
* `mandis` - ID, name, state, district.
* `crop_prices` - ID, crop_id (FK), mandi_id (FK), price, arrival_date.
* `listings` - ID, user_id (FK), crop, quantity, price, location, status.
* `traceability` - ID, tracking information.

Connect your code to Supabase by creating `backend/app/db/supabase_client.py`:
```python
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
```

### Step 3.3: Implement the Core "Crop Service"
The `crop_service.py` is the heart of KrishiSetu. It handles daily price updates and predictions.
**Here is its workflow:**
1. **Fetch Daily Data**: Before responding to requests, it checks the database. If today's data is missing, it automatically calls the Indian Govt. `data.gov.in` (Agrim) API.
2. **Store Data**: The results are parsed and upserted into the `crops`, `mandis`, and `crop_prices` Supabase tables.
3. **Machine Learning Predictor**: When a user wants a price prediction for `Wheat`:
   - It fetches the history of Wheat from the database.
   - It builds an ML Input Vector (commodity, market, date, season, price lags).
   - It attempts to load pre-trained `.joblib` models (e.g., `wheat_model.joblib`). If one exists, it uses `XGBoost` to do a time-series regression and predict the price constraint.
4. **AI Fallback & Advisory (Gemini)**: If the ML fails, or if a user lacks data, it falls back to **Google's Gemini AI**. It sends the last 10 days of prices and asks the AI to project logic. Gemini is also explicitly used alongside `OpenWeather API` to tell the farmer: *"It will rain tomorrow. Wait to sell your crop."*

### Step 3.4: Implement Voice Intelligence
The `voice_service.py` utilizes **Gemini** to act as an intent classifier.
When a user says on the frontend: `"Mujhe 50 kilo pyaz bechna hai" (I want to sell 50kg onions)`
1. The audio is converted to text on the frontend and sent to the `/voice` backend endpoint.
2. Gemini evaluates the prompt against a crafted system instruction.
3. It maps the intent to an action (`add_listing`) and extracts entities (`crop: Onion, quantity: 50kg`).
4. The backend then immediately injects this listing into the Supabase database safely, providing a seamless "no-touch" User Experience!

### Step 3.5: Stitch it all using FastAPI Routes
Link the database, the ML functions, and the Voice AI via `app/routes/` and link them in `main.py`:
```python
from fastapi import FastAPI
from app.routes import crops, listings, voice, auth

app = FastAPI()
app.include_router(crops.router, prefix="/crops")
app.include_router(listings.router, prefix="/listings")
app.include_router(voice.router, prefix="/voice")
```

---

## 🎨 4. Step-by-Step Guide: Building the Frontend

The User Interface needs to feel dynamic, agricultural, and premium. Next.js 16 handles everything gracefully.

### Step 4.1: Scaffold Next.js
1. Run target creation: `npx -y create-next-app@latest frontend --typescript --tailwind --eslint --app`
2. Change directory: `cd frontend`
3. Install UI libraries: `npm install lucide-react framer-motion recharts`

### Step 4.2: Setup the App Architecture
Next.js using App Router dictates that folders inside `/app/` act as page routes. The structure looks like:
* `/app/page.tsx`: The landing page with grand "Waving Wheat" animations.
* `/app/farmer-dashboard/page.tsx`: Shows user's active listings, weather advisories.
* `/app/buyer-dashboard/page.tsx`: Shows listings available to buy.
* `/app/commodities/page.tsx`: The Machine Learning charts. Displays `Recharts` graph visualizing `Past Price` vs `Predicted Price` powered by `/crops/predict` endpoint.

### Step 4.3: Implement the Voice Component
The application offers Voice Input. 
1. Use the Web Speech API (`webkitSpeechRecognition` from `@types/dom-speech-recognition`).
2. Implement a microphone button in a global `<Layout>` component, hovering over all pages.
3. Once the user stops speaking, take the text transcription -> Post to `http://localhost:8000/voice` -> Get the JSON response.
4. If the response contains `action: "redirect"`, use Next.js `useRouter().push(response.route)` to navigate them.
5. Provide audible feedback via SpeechSynthesis API (`window.speechSynthesis.speak()`).

### Step 4.4: Style & Animate everything
Use **Tailwind CSS** to create dark mode and vibrant modes. Define primary brand colors (Greens, earthy tones) inside `globals.css` or Tailwind configs. To wow the users, utilize `framer-motion`:
```javascript
import { motion } from 'framer-motion'
// Simple pop-in animation wrapper!
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  <h1>Welcome to KrishiSetu</h1>
</motion.div>
```

---

## ⚙️ 5. Setting Up Environment Variables

To make everything run, you must populate configuration secrets in the `backend/.env` file:
```env
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# AI & Government APIs
GEMINI_API_KEY="AIza..."
AGRIM_API_KEY="gov-api-key"
RESOURCE_ID="gov-resource-id"
WEATHER_API_KEY="openweather-api-key"
```

## 🏁 6. Launching the Project
1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```
   (Server spins up on `http://127.0.0.1:8000`)

2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```
   (Platform viewable on `http://localhost:3000`)

Congratulations! You've completely analyzed and reverse-engineered how KrishiSetu works and behaves under the hood. Study this document to spin it all up from scratch!
