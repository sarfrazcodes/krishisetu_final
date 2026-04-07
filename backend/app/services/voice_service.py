import os
import json
import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash')

def process_voice_intent(text: str, role: str = "guest", pathname: str = "/", page_content: str = "") -> Dict[str, Any]:
    """
    Unified 1-Shot Gemini call: Extracts intent and generates the final natural response simultaneously to eliminate latency.
    """
    if not GEMINI_API_KEY:
        print("[VOICE AI] Missing Gemini API Key")
        return {"action": "error", "message": "API key missing.", "language": "English", "route": None}

    prompt = f"""
    You are 'KrishiSetu Voice', an AI assistant for an Indian agriculture platform.
    Analyze the user's spoken text, figure out what they want based on their role, and write a natural, friendly response in the exact language the user spoke.
    - If the user speaks Punjabi, respond in Punjabi using Gurmukhi script only. Do NOT use Latin/Roman script for Punjabi.
    - If the user speaks Hindi, respond in Hindi using Devanagari.
    - If the user speaks English, respond in natural English.
    - You have a female persona. When responding in Hindi or Punjabi, use gentle, helpful female phrasing.

    **RESPONSE LENGTH INSTRUCTIONS:**
    - For general actions/navigation: Keep it extremely short (max 1 sentence, under 15 words).
    - For "explain this page" or similar requests: Provide a complete, detailed, and comprehensive explanation of the page content as requested. Do NOT restrict the length.
    DO NOT explain your thought process. ONLY output a strict JSON payload.

    User Context:
    Role: {role} (farmer, buyer, or guest)
    Current Path: {pathname}
    Page Text Snippet: {page_content[:1500] if page_content else 'No context provided.'}
    
    User Spoke: "{text}"
    
    Language Rules:
    - If the input is Punjabi or contains Punjabi words, set language="pa-IN" and write the message in Punjabi Gurmukhi.
    - If the input is Hindi, set language="hi-IN" and write the message in Hindi Devanagari.
    - If the input is English, set language="en-IN" or "en-US" and write the message in English.
    - Avoid Romanized Punjabi or Romanized Hindi. Always use native script for those languages.

    Routing & Logic Rules:
    1. If intent is to add a listing (e.g. "mere paas 100 kg gehun hai"):
       - IF role != farmer: set action="unauthorized", message="Sorry, only farmers can add listings.", route=null.
       - IF role == farmer: set action="add_listing", message="Listing prepared for you.", route=null, crop="Crop Name (e.g. Wheat)", quantity="amount with unit".
    2. If intent is navigation to crops/marketplace (e.g "mujhe crops dekhne hai"):
       - set action="navigate", route="/commodities", message="Taking you to the market right away."
    3. If intent is asking for mandis but NO crop is mentioned (e.g "mandis dikhao"):
       - set action="ask_clarification", route=null, message="For which crop would you like to see the mandis?"
    4. If intent mentions crop AND mandi (e.g "gehu ki pune mandi"):
       - set action="navigate", route="/commodities/Wheat/pune-apmc", message="Routing you to Wheat prices."
       - **CRITICAL**: The crop name in the route MUST have its first letter Capitalized exactly (e.g. `/commodities/Wheat`, `/commodities/Potato`). Do NOT use lowercase crop names in routes!
    5. If intent is "explain this page" (e.g. "samjha do is page me kya hai"):
       - read the 'Page Text Snippet', summarize the numbers/data dynamically, and set action="explain", message="<your natural summary of the page in their language>".
       
    Output STRICT JSON matching this exact structure:
    {{
        "action": "add_listing | get_prediction | get_listings | navigate | ask_clarification | explain | unauthorized | error",
        "route": "NextJS path if navigating else null",
        "language": "Detected language like Hindi, pa-IN, etc",
        "message": "The friendly spoken response translated perfectly into the user's spoken language.",
        "crop": "Extracted crop name if add_listing else null",
        "quantity": "Extracted quantity if add_listing else null"
    }}
    """
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "max_output_tokens": 300,  # Limit output to keep responses short
                "temperature": 0.7,  # Balanced creativity
            }
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3]
            
        # Clean any markdown formatting like **text**
        import re
        raw_text = re.sub(r'\*\*(.*?)\*\*', r'\1', raw_text)
        
        data = json.loads(raw_text)
        # Normalize common voice navigation routes
        route = data.get("route")
        if isinstance(route, str):
            cleaned = route.strip().lower().replace(" ", "-")
            if cleaned in ["about-us", "/about-us", "aboutus", "/aboutus", "about us", "/about us"]:
                data["route"] = "/about"
            elif not cleaned.startswith("/"):
                data["route"] = f"/{cleaned}"
        return data
    except Exception as e:
        print(f"[VOICE AI] Failed to parse unified JSON: {e}")
        return {"action": "error", "route": None, "language": "Hindi", "message": "Kshama karein, abhi AI server vyast hai."}
