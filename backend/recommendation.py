import pandas as pd
import os

from distance import calculate_distance


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


TOURISM_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_pressure.csv"
)


COORDINATES_FILE = os.path.join(
    BASE_DIR,
    "destination_coordinates.csv"
)


def get_less_crowded_places(
    crowd_preference=None,
    starting_location=None,
    max_distance=None
):


    # ==========================================
    # LOAD TOURISM DATA
    # ==========================================

    tourism_df = pd.read_csv(
        TOURISM_FILE
    )


    # ==========================================
    # LOAD COORDINATES
    # ==========================================

    coordinates_df = pd.read_csv(
        COORDINATES_FILE
    )


    # ==========================================
    # MERGE DATA
    # ==========================================

    df = tourism_df.merge(

        coordinates_df,

        on="destination",

        how="left"

    )


    # Remove Total row

    df = df[
        df["destination"].str.lower()
        != "total"
    ]


    # ==========================================
    # FILTER CROWD PREFERENCE
    # ==========================================

    if crowd_preference:

        df = df[

            df["pressure_level"]
            .astype(str)
            .str.strip()
            .str.lower()

            ==

            crowd_preference
            .strip()
            .lower()

        ]


    # ==========================================
    # FIND STARTING LOCATION
    # ==========================================

    if starting_location:


        start = coordinates_df[

            coordinates_df["destination"]
            .str.lower()

            ==

            starting_location.lower()

        ]


        if not start.empty:


            start_lat = start.iloc[0]["latitude"]

            start_lon = start.iloc[0]["longitude"]


            # ======================================
            # CALCULATE DISTANCE
            # ======================================

            df["distance_km"] = df.apply(

                lambda row:

                calculate_distance(

                    start_lat,

                    start_lon,

                    row["latitude"],


                    row["longitude"]

                ),

                axis=1

            )


            # ======================================
            # FILTER MAX DISTANCE
            # ======================================

            if max_distance:

                df = df[

                    df["distance_km"]
                    <=
                    max_distance

                ]


    # ==========================================
    # SORT RESULTS
    # PRIORITY:
    # LOW TOURISM PRESSURE
    # THEN SHORT DISTANCE
    # ==========================================

    if "distance_km" in df.columns:

        df = df.sort_values(

            by=[
                "tourism_pressure_score",
                "distance_km"
            ],

            ascending=True

        )

    else:

        df = df.sort_values(

            by="tourism_pressure_score",

            ascending=True

        )


    # ==========================================
    # CREATE RESPONSE
    # ==========================================

    recommendations = []


    for _, row in df.iterrows():

        recommendation = {

            "destination":

                str(row["destination"]),


            "average_tourists":

                int(row["average_tourists"]),


            "pressure_score":

                round(
                    float(
                        row[
                            "tourism_pressure_score"
                        ]
                    ),
                    2
                ),


            "pressure_level":

                str(
                    row["pressure_level"]
                ),


            "crowd_level":

                str(
                    row["crowd_level"]
                )

        }


        # Add distance only if calculated

        if "distance_km" in row:

            recommendation[
                "distance_km"
            ] = round(
                float(
                    row["distance_km"]
                ),
                2
            )


        recommendations.append(
            recommendation
        )


    return recommendations