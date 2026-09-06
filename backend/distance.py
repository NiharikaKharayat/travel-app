import math


def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    # Earth's radius in kilometers

    R = 6371


    # Convert latitude and longitude to radians

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)

    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)


    # Difference between coordinates

    dlat = lat2 - lat1
    dlon = lon2 - lon1


    # Haversine formula

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


    return round(
        distance,
        2
    )