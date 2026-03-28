import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

import traceback

from app.services.voice_service import process_voice_intent

if __name__ == "__main__":
    try:
        res = process_voice_intent("mere paas 100 kg gehun hai", role="farmer", pathname="/", page_content="")
        print("Result:", res)
    except Exception as e:
        traceback.print_exc()
