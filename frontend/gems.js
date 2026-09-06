const API_URL =
    "http://127.0.0.1:8000/recommendations";


// ==========================================
// LOAD RECOMMENDATIONS
// ==========================================

async function loadRecommendations() {


    const gemsList =
        document.getElementById("gemsList");


    gemsList.innerHTML = `

        <div class="text-center text-text-muted">

            Loading personalized recommendations...

        </div>

    `;


    try {


        // ==========================================
        // READ LOCAL STORAGE
        // ==========================================

        const savedPreferences =
            localStorage.getItem(
                "fereneTravelPreferences"
            );


        console.log(
            "RAW LOCAL STORAGE:",
            savedPreferences
        );


        let crowdLevel = "Low";


        // ==========================================
        // GET CROWD LEVEL
        // ==========================================

        if (savedPreferences) {


            const preferences =
                JSON.parse(savedPreferences);


            console.log(
                "PARSED PREFERENCES:",
                preferences
            );


            if (preferences.crowdPreference) {

                crowdLevel =
                    preferences.crowdPreference;

            }

        }


        console.log(
            "FINAL CROWD LEVEL:",
            crowdLevel
        );


        // ==========================================
        // CREATE API URL
        // ==========================================

        const requestURL =
            `${API_URL}?crowd_level=${encodeURIComponent(crowdLevel)}`;


        console.log(
            "REQUEST URL:",
            requestURL
        );


        // ==========================================
        // FETCH BACKEND
        // ==========================================

        const response =
            await fetch(requestURL);


        if (!response.ok) {

            throw new Error(
                `Backend error: ${response.status}`
            );

        }


        const places =
            await response.json();


        console.log(
            "FILTERED BACKEND DATA:",
            places
        );


        // ==========================================
        // CLEAR LOADING
        // ==========================================

        gemsList.innerHTML = "";


        // ==========================================
        // BACKEND ERROR
        // ==========================================

        if (places.error) {

            gemsList.innerHTML = `

                <div class="p-4 rounded-xl bg-red-50 text-red-600">

                    ${places.error}

                </div>

            `;

            return;

        }


        // ==========================================
        // NO RESULTS
        // ==========================================

        if (places.length === 0) {

            gemsList.innerHTML = `

                <div class="p-5 rounded-xl bg-surface-container-low text-center">

                    No destinations found matching your preferences.

                </div>

            `;

            return;

        }


        // ==========================================
        // DISPLAY DESTINATIONS
        // ==========================================

        places.forEach(place => {


            let badgeColor;


            if (place.pressure_level === "Low") {

                badgeColor =
                    "bg-green-100 text-green-700";

            }

            else if (place.pressure_level === "Medium") {

                badgeColor =
                    "bg-yellow-100 text-yellow-700";

            }

            else {

                badgeColor =
                    "bg-red-100 text-red-700";

            }


            const card =
                document.createElement("div");


            card.className = `
                bg-surface-container-low
                rounded-2xl
                p-5
                border
                border-white/20
                shadow-sm
            `;


            card.innerHTML = `

                <div class="flex justify-between items-start">


                    <div>

                        <h3 class="text-lg font-bold text-on-surface">

                            ${place.destination}

                        </h3>


                        <p class="text-sm text-text-muted mt-1">

                            Uttarakhand, India

                        </p>


                    </div>


                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}">

                        ${place.pressure_level} Pressure

                    </span>


                </div>


                <!-- PRESSURE SCORE -->

                <div class="mt-5">


                    <div class="flex justify-between text-sm mb-2">

                        <span class="text-text-muted">

                            Tourism Pressure

                        </span>


                        <span class="font-semibold">

                            ${place.pressure_score}/100

                        </span>


                    </div>


                    <div class="w-full bg-gray-200 rounded-full h-2">

                        <div
                        class="bg-gradient-to-r from-gradient-start to-gradient-end h-2 rounded-full"
                        style="width: ${place.pressure_score}%"
                        >

                        </div>

                    </div>


                </div>


                <!-- STATS -->

                <div class="grid grid-cols-2 gap-4 mt-5">


                    <div class="bg-white/40 rounded-xl p-3">

                        <p class="text-xs text-text-muted">

                            Avg. Tourists

                        </p>


                        <p class="font-semibold mt-1">

                            ${Number(
                                place.average_tourists
                            ).toLocaleString()}

                        </p>

                    </div>


                    <div class="bg-white/40 rounded-xl p-3">

                        <p class="text-xs text-text-muted">

                            Crowd Level

                        </p>


                        <p class="font-semibold mt-1">

                            ${place.crowd_level || "N/A"}

                        </p>

                    </div>


                </div>


                <div class="mt-4 text-sm text-text-muted">

                    ${getRecommendationMessage(
                        place.pressure_level
                    )}

                </div>

            `;


            gemsList.appendChild(card);


        });


    }


    catch (error) {


        console.error(
            "FERENE ERROR:",
            error
        );


        gemsList.innerHTML = `

            <div class="p-5 rounded-xl bg-red-50 text-red-600 text-center">

                Unable to load tourism recommendations.

                <br><br>

                ${error.message}

            </div>

        `;

    }

}


// ==========================================
// RECOMMENDATION MESSAGE
// ==========================================

function getRecommendationMessage(level) {


    if (level === "Low") {

        return "✓ Recommended for a peaceful and less crowded travel experience.";

    }


    if (level === "Medium") {

        return "• Moderate tourism activity expected.";

    }


    return "⚠ High tourism pressure. Consider visiting during off-peak periods.";

}


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadRecommendations
);