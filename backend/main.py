from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import math
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types


# =================================================
# GEMINI CONFIGURATION
# =================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")


gemini_client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =================================================
# SOCKET.IO CONFIGURATION
# =================================================

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)


# =================================================
# FASTAPI APP
# =================================================

fastapi_app = FastAPI(
    title="Ferene API"
)


fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =================================================
# HIDDEN GEMS DATABASE
# =================================================

hidden_gems = [

    {
        "name": "Neemrana Fort Palace",
        "location": "Neemrana, Rajasthan",
        "latitude": 27.9897,
        "longitude": 76.3847,
        "description": "Historic fort with heritage architecture and scenic views.",
        "category": "History & Culture",
        "tourism_pressure": 28,
        "image": "https://images.unsplash.com/photo-1599661046827-dacde6976542"
    },

    {
        "name": "Sariska Hidden Trails",
        "location": "Alwar, Rajasthan",
        "latitude": 27.3288,
        "longitude": 76.4445,
        "description": "Peaceful forest trails and wildlife experiences.",
        "category": "Nature",
        "tourism_pressure": 22,
        "image": "https://images.unsplash.com/photo-1548013146-72479768bada"
    },

    {
        "name": "Bharatpur Bird Sanctuary",
        "location": "Bharatpur, Rajasthan",
        "latitude": 27.1591,
        "longitude": 77.5219,
        "description": "Beautiful destination for bird watching and nature lovers.",
        "category": "Wildlife",
        "tourism_pressure": 35,
        "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
    },

    {
        "name": "Tijara Fort",
        "location": "Tijara, Rajasthan",
        "latitude": 27.9340,
        "longitude": 76.8550,
        "description": "A peaceful heritage destination away from crowded tourist routes.",
        "category": "Heritage",
        "tourism_pressure": 18,
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
    },

    {
        "name": "Sultanpur National Park",
        "location": "Gurugram, Haryana",
        "latitude": 28.4640,
        "longitude": 76.8890,
        "description": "A calm bird sanctuary perfect for nature and photography lovers.",
        "category": "Nature",
        "tourism_pressure": 30,
        "image": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
    },

    {
        "name": "Damdama Lake",
        "location": "Gurugram, Haryana",
        "latitude": 28.3575,
        "longitude": 77.1176,
        "description": "Scenic lake surrounded by hills, ideal for day trips.",
        "category": "Adventure",
        "tourism_pressure": 25,
        "image": "https://images.unsplash.com/photo-1500534623283-312aade485b7"
    },

    {
        "name": "Morni Hills",
        "location": "Panchkula, Haryana",
        "latitude": 30.6942,
        "longitude": 77.0890,
        "description": "Quiet hill destination with lakes and hiking trails.",
        "category": "Hiking",
        "tourism_pressure": 20,
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    },

    {
        "name": "Chakrata",
        "location": "Uttarakhand",
        "latitude": 30.7030,
        "longitude": 77.8630,
        "description": "A peaceful hill station known for forests and mountain views.",
        "category": "Mountains",
        "tourism_pressure": 24,
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
    },

    {
        "name": "Lansdowne",
        "location": "Uttarakhand",
        "latitude": 29.8375,
        "longitude": 78.6870,
        "description": "Quiet cantonment town surrounded by pine forests.",
        "category": "Nature",
        "tourism_pressure": 26,
        "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba"
    },

    {
        "name": "Tirthan Valley",
        "location": "Himachal Pradesh",
        "latitude": 31.6580,
        "longitude": 77.3690,
        "description": "Beautiful valley with rivers, trekking and peaceful villages.",
        "category": "Adventure",
        "tourism_pressure": 32,
        "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    }

]


# =================================================
# DISTANCE CALCULATION
# =================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    radius = 6371

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)

    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return radius * c


# =================================================
# FERENE SYSTEM PROMPT
# =================================================

SYSTEM_PROMPT = """You are Ferene, a friendly and knowledgeable AI travel planning assistant for an Indian travel app. Your goal is to have a natural back-and-forth conversation that feels like talking to a well-traveled friend, not a search engine.

CONVERSATION FLOW:
1. When a user brings up a trip idea, ask 1-2 short clarifying questions to personalize your help - dates, budget, group type (solo/friends/family), travel pace, and interests (adventure, relaxation, culture, food). Never ask more than 2 questions in a single turn. Always try to pin down their travel dates or month early, since it affects almost everything else.

2. Once you have enough context, give helpful, specific, to-the-point answers about the destination(s) they're interested in - this can be any real place, not limited to any specific list.

3. For each place you discuss, include:
   - A short honest review - mention both the highlights and the downsides (crowds, cost, best/worst season, tourist traps) - don't just sell it
   - An approximate rating out of 5, based on general traveler consensus
   - Practical booking guidance: which platforms are typically used for tickets/trains (IRCTC, redBus, airline sites) and hotels (MakeMyTrip, Booking.com, Airbnb, direct homestay contact) - describe the booking process rather than inventing fake specific prices or fake links

4. SEASONAL & AVAILABILITY AWARENESS (critical):
   - Always check whether the user's planned month is a good time for the destination and specific activities they want.
   - If they mention a specific activity (e.g., river rafting, skiing, a particular trek, a wildlife safari), proactively tell them if that activity has a seasonal window and whether it's open/closed during their planned dates. Example: river rafting in Rishikesh typically runs October-June and pauses during monsoon (July-September) due to unsafe water levels - flag this clearly if their dates fall in the closed window.
   - If their chosen month isn't ideal (activity closed, bad weather, off-season closures, or conversely peak-crowd season), say so honestly and suggest either a better month OR an alternative activity/destination available during their actual dates.
   - When building their itinerary, only include activities and places that are realistically operational during their specific travel month - don't plan a rafting day in August or a snow trek in June.
   - If you're not fully certain about an activity's seasonal window, say so honestly rather than stating it with false confidence, and advise them to confirm locally or with the operator before booking.

5. Help them build a simple day-wise trip plan when asked - activities, rough costs, and logistics, grounded in realistic general knowledge and adjusted for what's actually available in their travel month.

6. Keep your tone conversational and concise - short paragraphs, not walls of text, since this is a chat interface.

7. At the END of the conversation, once you understand their preferences and dates well, suggest 1-3 places from the DESTINATIONS list given below - pick ones that also make sense for their travel month, not just their interests.

IMPORTANT HONESTY RULES:
- Never fabricate a specific URL, exact live price, or a business name you're not confident exists - describe the booking platform/category instead.
- Be honest in reviews - if a place is overcrowded, overpriced, or overrated, say so plainly.
- Be honest about seasonal uncertainty - if you're not sure an activity runs in a given month, say so rather than guessing confidently.
- Only use the DESTINATIONS list as your source for the final recommendation - general destination discussion earlier in the conversation can draw on your broader travel knowledge.

Formatting: use simple headings and numbered lists where useful. Do not mention that you are an API or backend. Do not invent bookings or reservations."""


def build_destinations_context():

    lines = []

    for gem in hidden_gems:
        lines.append(
            f"- {gem['name']} ({gem['location']}) - {gem['category']}. "
            f"{gem['description']} [crowd/tourism pressure: {gem['tourism_pressure']}/100, lower = quieter]"
        )

    return "DESTINATIONS:\n" + "\n".join(lines)


# =================================================
# GEMINI CHAT API
# =================================================

@fastapi_app.post("/chat")
async def chat_with_gemini(data: dict):

    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:

        return {
            "status": "error",
            "message": "Message is required"
        }

    try:

        contents = []

        for turn in history:
            role = "model" if turn.get("role") == "model" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": turn.get("text", "")}]
            })

        contents.append({
            "role": "user",
            "parts": [{"text": user_message}]
        })

        system_instruction = SYSTEM_PROMPT + "\n\n" + build_destinations_context()

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            ),
        )

        return {
            "status": "success",
            "response": response.text
        }

    except Exception as e:

        print(
            "Gemini Error:",
            e
        )

        return {
            "status": "error",
            "message": "Unable to get response from Gemini"
        }


# =================================================
# API HOME
# =================================================

@fastapi_app.get("/")
async def home():

    return {
        "message": "Ferene Backend API is running"
    }


# =================================================
# NEARBY HIDDEN GEMS
# =================================================

@fastapi_app.get("/recommendations/nearby")
async def get_nearby_recommendations(
    latitude: float,
    longitude: float,
    limit: int = 10
):

    recommendations = []

    for gem in hidden_gems:

        distance = calculate_distance(
            latitude,
            longitude,
            gem["latitude"],
            gem["longitude"]
        )

        gem_data = gem.copy()

        gem_data["distance"] = round(
            distance,
            2
        )

        recommendations.append(
            gem_data
        )

    recommendations.sort(
        key=lambda x: (
            x["tourism_pressure"],
            x["distance"]
        )
    )

    return {
        "status": "success",
        "count": min(
            limit,
            len(recommendations)
        ),
        "recommendations":
            recommendations[:limit]
    }


# =================================================
# GET ALL HIDDEN GEMS
# =================================================

@fastapi_app.get("/recommendations/all")
async def get_all_recommendations():

    return {
        "status": "success",
        "count": len(hidden_gems),
        "recommendations":
            hidden_gems
    }


# =================================================
# CHAT MESSAGE HISTORY (IN-MEMORY, PER SERVER RUN)
# =================================================
#
# Structure:
#
# chat_history = {
#     "travel-group": [
#         {"username": "...", "message": "...", "sender_id": "..."},
#         ...
#     ]
# }
#
# Capped at the last 100 messages per room.
# =================================================

chat_history = {}

MAX_HISTORY_PER_ROOM = 100


def add_message_to_history(room, entry):

    if room not in chat_history:
        chat_history[room] = []

    chat_history[room].append(entry)

    # Keep only the most recent MAX_HISTORY_PER_ROOM messages.
    if len(chat_history[room]) > MAX_HISTORY_PER_ROOM:
        chat_history[room] = chat_history[room][-MAX_HISTORY_PER_ROOM:]


# =================================================
# SOCKET.IO CHAT
# =================================================

@sio.event
async def connect(
    sid,
    environ
):

    print(
        f"User connected: {sid}"
    )


@sio.event
async def disconnect(
    sid
):

    print(
        f"User disconnected: {sid}"
    )


# =================================================
# JOIN CHAT ROOM
# =================================================

@sio.event
async def join_room(
    sid,
    data
):

    print("\n=================================")
    print("JOIN ROOM EVENT")
    print("Socket ID:", sid)

    room = data.get(
        "room",
        "travel-group"
    )

    username = data.get(
        "username",
        "Traveler"
    )

    await sio.enter_room(
        sid,
        room
    )

    print("Username:", username)
    print("Room:", room)
    print("=================================\n")

    # -------------------------------------------------
    # SEND EXISTING ROOM HISTORY ONLY TO THIS SOCKET
    # -------------------------------------------------
    #
    # This is a separate event ("chat_history") from
    # "receive_message" so the frontend never confuses
    # old messages with brand-new ones.
    # -------------------------------------------------

    room_history = chat_history.get(room, [])

    await sio.emit(
        "chat_history",
        {
            "room": room,
            "messages": room_history
        },
        room=sid
    )

    # -------------------------------------------------
    # INFORM EVERYONE THAT A USER JOINED
    # -------------------------------------------------

    await sio.emit(
        "system_message",
        {
            "message":
                f"{username} joined the group!"
        },
        room=room
    )


# =================================================
# SEND CHAT MESSAGE
# =================================================

@sio.event
async def send_message(
    sid,
    data
):

    room = data.get(
        "room",
        "travel-group"
    )

    username = data.get(
        "username",
        "Traveler"
    )

    message = data.get(
        "message",
        ""
    ).strip()

    print("MESSAGE FROM SOCKET:", sid)
    print("ROOM:", room)
    print("MESSAGE:", message)

    if not message:
        return

    # =================================================
    # BUILD THE MESSAGE PAYLOAD ONCE
    # =================================================
    #
    # The SAME payload is broadcast to every socket in
    # the room, including the sender. There is no
    # per-participant looping and no separately
    # computed "is_sender" flag from the backend.
    #
    # The frontend decides left/right by comparing
    # sender_id to its own socket.id.
    # =================================================

    payload = {
        "username": username,
        "message": message,
        "sender_id": sid
    }

    add_message_to_history(room, payload)

    await sio.emit(
        "receive_message",
        payload,
        room=room
    )


# =================================================
# COMBINE FASTAPI + SOCKET.IO
# =================================================

app = socketio.ASGIApp(
    sio,
    other_asgi_app=fastapi_app
)