import pandas as pd
import os


# ==========================================
# FILE PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_crowd.csv"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "uttarakhand_tourism_with_pressure.csv"
)


print("\n===== TOURISM PRESSURE CALCULATION =====\n")

print("Reading:", INPUT_FILE)


# ==========================================
# LOAD DATA
# ==========================================

df = pd.read_csv(INPUT_FILE)


# Remove unnecessary Total row
df = df[df["destination"] != "Total"].copy()


# ==========================================
# 1. CALCULATE AVERAGE TOURISTS
# ==========================================

df["average_tourists"] = (
    df["total_2021"]
    + df["total_2022"]
    + df["total_2023"]
) / 3


# ==========================================
# 2. CALCULATE CROWD SCORE
# Normalize tourist footfall from 0 to 100
# ==========================================

min_tourists = df["average_tourists"].min()
max_tourists = df["average_tourists"].max()


if max_tourists != min_tourists:

    df["crowd_score"] = (
        (
            df["average_tourists"] - min_tourists
        )
        /
        (
            max_tourists - min_tourists
        )
    ) * 100

else:

    df["crowd_score"] = 50


# ==========================================
# 3. CROWD LEVEL
# ==========================================

df["crowd_level"] = pd.cut(

    df["crowd_score"],

    bins=[-1, 33, 66, 100],

    labels=[
        "Low",
        "Medium",
        "High"
    ]
)


# ==========================================
# 4. CALCULATE TOURISM GROWTH RATE
# ==========================================

df["growth_rate"] = (
    (
        df["total_2023"]
        - df["total_2021"]
    )
    /
    df["total_2021"].replace(0, 1)
) * 100


# ==========================================
# 5. CALCULATE GROWTH SCORE
# Normalize growth from 0 to 100
# ==========================================

min_growth = df["growth_rate"].min()
max_growth = df["growth_rate"].max()


if max_growth != min_growth:

    df["growth_score"] = (
        (
            df["growth_rate"] - min_growth
        )
        /
        (
            max_growth - min_growth
        )
    ) * 100

else:

    df["growth_score"] = 50


# ==========================================
# 6. TOURISM PRESSURE SCORE
# ==========================================
#
# Formula for SIH Prototype:
#
# 70% Tourist Footfall / Crowd
# 30% Tourism Growth
#
# Score range: 0 to 100
# ==========================================

df["tourism_pressure_score"] = (

    df["crowd_score"] * 0.70

    +

    df["growth_score"] * 0.30

).round(2)


# ==========================================
# 7. PRESSURE LEVEL
# ==========================================

df["pressure_level"] = pd.cut(

    df["tourism_pressure_score"],

    bins=[-1, 33, 66, 100],

    labels=[
        "Low",
        "Medium",
        "High"
    ]
)


# ==========================================
# SAVE RESULT
# ==========================================

df.to_csv(
    OUTPUT_FILE,
    index=False
)


# ==========================================
# SUCCESS MESSAGE
# ==========================================

print("\n========================================")
print("SUCCESS!")
print("Tourism Pressure Score generated.")
print("========================================\n")

print("New file created:")

print(OUTPUT_FILE)


print("\nPreview:\n")

print(
    df[[
        "destination",
        "average_tourists",
        "crowd_score",
        "growth_rate",
        "growth_score",
        "tourism_pressure_score",
        "pressure_level"
    ]].head(10)
)

print("\n")