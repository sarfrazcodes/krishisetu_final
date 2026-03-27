from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import crops
from app.routes.auth import login, signup
from app.routes import listings, requests, traceability

app = FastAPI(title="KrishiSetu Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crops.router, prefix="/crops", tags=["Crops"])
app.include_router(login.router)
app.include_router(signup.router)
app.include_router(listings.router)
app.include_router(requests.router)
app.include_router(traceability.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}