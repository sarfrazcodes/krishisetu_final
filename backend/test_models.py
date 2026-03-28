import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

models_to_test = ['gemini-2.0-flash-lite', 'gemini-flash-latest', 'gemini-2.0-flash']

for m in models_to_test:
    model = genai.GenerativeModel(m)
    try:
        response = model.generate_content("hello")
        print(f"SUCCESS {m}:", response.text.replace("\n", " "))
    except Exception as e:
        print(f"FAILED {m}:", type(e).__name__)
