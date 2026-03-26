from fastapi import FastAPI
from app.routes import crops

app = FastAPI(title="KrishiSetu Backend")

app.include_router(crops.router, prefix="/crops", tags=["Crops"])

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}