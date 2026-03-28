import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

try:
    m = genai.GenerativeModel('gemini-2.0-flash')
    print("TESTING 2.0-flash:", m.generate_content("hello").text.strip())
except Exception as e:
    print("FAILED 2.0-flash:", str(e))
