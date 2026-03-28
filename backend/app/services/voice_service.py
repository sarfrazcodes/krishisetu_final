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
    Analyze the user's spoken text, figure out what they want based on their role, and write a natural, friendly response natively in the exact language the user spoke in.
    **CRITICAL FOR SPEED:** Keep your message extremely short (maximum 1 sentence, under 15 words) to ensure ultra-fast voice response latency!
    DO NOT explain your thought process. ONLY output a strict JSON payload.

    User Context:
    Role: {role} (farmer, buyer, or guest)
    Current Path: {pathname}
    Page Text Snippet: {page_content[:1500] if page_content else 'No context provided.'}
    
    User Spoke: "{text}"
    
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
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3]
            
        data = json.loads(raw_text)
        return data
    except Exception as e:
        print(f"[VOICE AI] Failed to parse unified JSON: {e}")
        return {"action": "error", "route": None, "language": "Hindi", "message": "Kshama karein, abhi AI server vyast hai."}
