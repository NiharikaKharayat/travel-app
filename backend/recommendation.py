import pandas as pd
import os
import math


# ============================================
# FILE PATH
# ============================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_coordinates.csv"
)


# ============================================
# HAVERSINE DISTANCE FUNCTION
# ============================================

def calculate_distance(lat1, lon1, lat2, lon2):

    R = 6371  # Earth radius in kilometers

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
        *
        math.cos(lat2)
        *
        math.sin(dlon / 2) ** 2
    )


    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )


    distance = R * c


    return round(distance, 2)


# ============================================
# GET ALL LESS CROWDED PLACES
# ============================================

def get_less_crowded_places():

    try:

        df = pd.read_csv(DATA_FILE)


    except FileNotFoundError:

        return {

            "error":
            "Tourism data not found."

        }


    # Sort by lowest tourism pressure

    df = df.sort_values(
        by="tourism_pressure_score",
        ascending=True
    )


    recommendations = []


    for _, row in df.iterrows():

        recommendations.append({

            "destination":
            row["destination"],


            "average_tourists":
            int(row["average_tourists"]),


            "pressure_score":
            float(row["tourism_pressure_score"]),


            "pressure_level":
            str(row["pressure_level"]),


            "crowd_level":
            str(row["crowd_level"]),


            "latitude":
            float(row["latitude"]),


            "longitude":
            float(row["longitude"])

        })


    return recommendations


# ============================================
# GET NEARBY HIDDEN GEMS
# ============================================

def get_nearby_recommendations(
    user_latitude,
    user_longitude,
    limit=10
):


    try:

        df = pd.read_csv(DATA_FILE)


    except FileNotFoundError:

        return {

            "error":
            "Tourism data not found."

        }


    # ========================================
    # CALCULATE DISTANCE
    # ========================================

    distances = []


    for _, row in df.iterrows():


        distance = calculate_distance(

            user_latitude,
            user_longitude,

            row["latitude"],
            row["longitude"]

        )


        distances.append(distance)


    df["distance_km"] = distances


    # ========================================
    # RECOMMENDATION SCORE
    # ========================================
    #
    # Lower pressure = better
    # Shorter distance = better
    #
    # 60% tourism pressure
    # 40% distance
    #
    # ========================================


    max_distance = df["distance_km"].max()


    if max_distance > 0:

        df["distance_score"] = (

            df["distance_km"]
            /
            max_distance

        ) * 100


    else:

        df["distance_score"] = 0


    # Combined score

    df["recommendation_score"] = (

        df["tourism_pressure_score"] * 0.60

        +

        df["distance_score"] * 0.40

    )


    # Lower score = better recommendation

    df = df.sort_values(

        by="recommendation_score",

        ascending=True

    )


    # ========================================
    # CREATE RESPONSE
    # ========================================

    recommendations = []


    for _, row in df.head(limit).iterrows():


        recommendations.append({

            "destination":
            row["destination"],


            "average_tourists":
            int(row["average_tourists"]),


            "pressure_score":
            float(row["tourism_pressure_score"]),


            "pressure_level":
            str(row["pressure_level"]),


            "crowd_level":
            str(row["crowd_level"]),


            "distance_km":
            float(round(row["distance_km"], 2)),


            "recommendation_score":
            float(
                round(
                    row["recommendation_score"],
                    2
                )
            ),


            "latitude":
            float(row["latitude"]),


            "longitude":
            float(row["longitude"])

        })


    return recommendations