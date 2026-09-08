from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import math


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

def calculate_distance(lat1, lon1, lat2, lon2):

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
# SOCKET.IO CHAT
# =================================================

@sio.event
async def connect(sid, environ):

    print(f"User connected: {sid}")


@sio.event
async def disconnect(sid):

    print(f"User disconnected: {sid}")


# =================================================
# JOIN CHAT ROOM
# =================================================

@sio.event
async def join_room(sid, data):

    print("JOIN ROOM EVENT RECEIVED")

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

    print(f"{username} joined room: {room}")

    await sio.emit(

        "system_message",

        {
            "message": f"{username} joined the group!"
        },

        room=room

    )


# =================================================
# SEND CHAT MESSAGE
# =================================================

@sio.event
async def send_message(sid, data):

    print("SEND MESSAGE EVENT RECEIVED")

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

    if message:

        print(f"[{room}] {username}: {message}")

        await sio.emit(

            "receive_message",

            {
                "username": username,
                "message": message
            },

            room=room

        )


# =================================================
# COMBINE FASTAPI + SOCKET.IO
# =================================================

app = socketio.ASGIApp(

    sio,

    other_asgi_app=fastapi_app

)