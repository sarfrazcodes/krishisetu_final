import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-pro')

try:
    response = model.generate_content("hello")
    print("SUCCESS:", response.text)
except Exception as e:
    print("EXCEPTION_TYPE:", type(e).__name__)
    print("EXCEPTION_MSG:", str(e))
