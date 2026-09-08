import pandas as pd
import requests
import time
import os


# ==========================================
# FILE PATHS
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


INPUT_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_pressure.csv"
)


OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_coordinates.csv"
)


# ==========================================
# SPECIAL LOCATION NAME MAPPING
# ==========================================
#
# Some names in our tourism CSV are long,
# grouped, or spelled differently from the
# names available in OpenStreetMap.
#
# This mapping converts them into better
# search queries.
#


LOCATION_MAPPING = {

    "Kotdwar (Swaragasram, Chilla)":
        "Kotdwar, Uttarakhand, India",

    "Rudraprayag (without Kedarnath)":
        "Rudraprayag, Uttarakhand, India",

    "Gopeshwar (Nandprayag,Mundoli, Tharali etc.)":
        "Gopeshwar, Uttarakhand, India",

    "Joshimath (Govindghat, Ghanghariya)":
        "Joshimath, Uttarakhand, India",

    "Uttarkashi (Harshil, Gangnani etc.)":
        "Uttarkashi, Uttarakhand, India",

    "Kausani & Bageshwar":
        "Kausani, Uttarakhand, India",

    "Hemkund Sahib":
        "Hemkund Sahib, Chamoli, Uttarakhand, India",

    "Ranikheth":
        "Ranikhet, Uttarakhand, India"

}


# ==========================================
# FALLBACK COORDINATES
# ==========================================
#
# If OpenStreetMap cannot find a destination,
# these manually saved coordinates will be used.
#
# This ensures important destinations do not
# remain empty.
#


FALLBACK_COORDINATES = {

    "Hemkund Sahib": (
        30.6987543,
        79.618467
    ),

    "Ranikheth": (
        29.6323007,
        79.4154142
    )

}


# ==========================================
# GET COORDINATES FROM OPENSTREETMAP
# ==========================================

def get_coordinates(destination):


    # Get corrected search name if available.
    # Otherwise search normally.

    query = LOCATION_MAPPING.get(

        destination,

        f"{destination}, Uttarakhand, India"

    )


    # OpenStreetMap Nominatim API

    url = (
        "https://nominatim.openstreetmap.org/search"
    )


    params = {

        "q": query,

        "format": "json",

        "limit": 1

    }


    headers = {

        "User-Agent":
        "Ferene-SIH-Project/1.0"

    }


    try:


        response = requests.get(

            url,

            params=params,

            headers=headers,

            timeout=15

        )


        # Raise error if request fails

        response.raise_for_status()


        data = response.json()


        # If location is found

        if data:


            latitude = float(
                data[0]["lat"]
            )


            longitude = float(
                data[0]["lon"]
            )


            return latitude, longitude


        # Location not found

        return None, None


    except Exception as error:


        print(

            f"API error: {error}"

        )


        return None, None


# ==========================================
# LOAD TOURISM DATA
# ==========================================

print("\n================================")

print("Loading tourism data...")

print("================================\n")


print("Input file:")

print(INPUT_FILE)


try:


    df = pd.read_csv(INPUT_FILE)


except FileNotFoundError:


    print("\nERROR!")

    print(
        "Input CSV file not found."
    )

    print(
        f"Expected file: {INPUT_FILE}"
    )

    exit()


# ==========================================
# REMOVE TOTAL ROW
# ==========================================

df = df[

    df["destination"]
    .astype(str)
    .str.strip()
    .str.lower()

    !=

    "total"

]


# ==========================================
# CREATE COORDINATE COLUMNS
# ==========================================

df["latitude"] = None

df["longitude"] = None


# ==========================================
# GET COORDINATES FOR EACH DESTINATION
# ==========================================

print("\nGetting coordinates...\n")


for index, row in df.iterrows():


    destination = str(

        row["destination"]

    ).strip()


    print(

        f"Searching: {destination}"

    )


    # --------------------------------------
    # STEP 1
    # TRY OPENSTREETMAP API
    # --------------------------------------

    latitude, longitude = get_coordinates(

        destination

    )


    # --------------------------------------
    # STEP 2
    # USE FALLBACK IF API FAILS
    # --------------------------------------

    if latitude is None or longitude is None:


        if destination in FALLBACK_COORDINATES:


            latitude, longitude = (

                FALLBACK_COORDINATES[
                    destination
                ]

            )


            print(

                "✓ Using fallback coordinates: "

                f"{latitude}, {longitude}"

            )


    # --------------------------------------
    # STEP 3
    # SAVE COORDINATES
    # --------------------------------------

    if latitude is not None and longitude is not None:


        df.at[index, "latitude"] = latitude

        df.at[index, "longitude"] = longitude


        print(

            f"✓ Found: {latitude}, {longitude}"

        )


    else:


        print(

            f"✗ Not found: {destination}"

        )


    # --------------------------------------
    # WAIT BEFORE NEXT API REQUEST
    # --------------------------------------
    #
    # OpenStreetMap recommends not sending
    # too many requests quickly.
    #


    time.sleep(1)


# ==========================================
# CHECK FOR MISSING COORDINATES
# ==========================================

missing = df[

    df["latitude"].isna()

    |

    df["longitude"].isna()

]


print("\n================================")

print("COORDINATE CHECK")

print("================================")


if len(missing) > 0:


    print(

        "\nLocations still not found:\n"

    )


    for destination in missing["destination"]:


        print(

            f"✗ {destination}"

        )


else:


    print(

        "\n✓ All destination coordinates found!"

    )


# ==========================================
# SAVE FINAL CSV
# ==========================================

df.to_csv(

    OUTPUT_FILE,

    index=False

)


# ==========================================
# SUCCESS MESSAGE
# ==========================================

print("\n================================")

print("SUCCESS!")

print("New CSV created:")

print(OUTPUT_FILE)

print("================================")


print("\nTotal destinations:")

print(

    len(df)

)


print("\nCSV columns:")

print(

    list(df.columns)

)