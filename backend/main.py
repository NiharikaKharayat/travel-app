from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from recommendation import get_less_crowded_places


app = FastAPI(
    title="Ferene API"
)


# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================
# CHAT MODEL
# ============================================

class ChatRequest(BaseModel):
    message: str


# ============================================
# HOME
# ============================================

@app.get("/")
def home():

    return {
        "message": "Welcome to Ferene API"
    }


# ============================================
# RECOMMENDATIONS
# ============================================

@app.get("/recommendations")
def recommendations(crowd_level: str = None):

    print("\n==============================")
    print("RECOMMENDATION REQUEST")
    print("Crowd preference received:", crowd_level)
    print("==============================\n")

    return get_less_crowded_places(crowd_level)


# ============================================
# CHAT
# ============================================

@app.post("/chat")
def chat(data: ChatRequest):

    return {
        "reply": f"You said: {data.message}"
    }