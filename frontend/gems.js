const API_BASE_URL = "http://127.0.0.1:8000";


// ==========================================
// LOAD HIDDEN GEMS
// ==========================================

function loadRecommendations() {

    const gemsList =
        document.getElementById("gemsList");


    gemsList.innerHTML = `

        <div class="text-center text-text-muted py-8">

            Finding hidden gems near you...

        </div>

    `;


    // Check browser geolocation

    if (!navigator.geolocation) {

        // Default location if geolocation unavailable

        fetchRecommendations(
            28.6139,
            77.2090
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            console.log(
                "User Location:",
                latitude,
                longitude
            );


            fetchRecommendations(
                latitude,
                longitude
            );

        },


        function(error) {

            console.warn(
                "Location unavailable. Using Delhi as default location."
            );


            // Default Delhi location

            fetchRecommendations(
                28.6139,
                77.2090
            );

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 60000

        }

    );

}


// ==========================================
// FETCH RECOMMENDATIONS
// ==========================================

async function fetchRecommendations(
    latitude,
    longitude
) {

    const gemsList =
        document.getElementById("gemsList");


    try {

        const url =

            `${API_BASE_URL}/recommendations/nearby?latitude=${latitude}&longitude=${longitude}&limit=10`;


        console.log(
            "Fetching:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "API Response:",
            data
        );


        // IMPORTANT:
        // Backend returns:
        // {
        //   status,
        //   count,
        //   recommendations: []
        // }

        const places =
            data.recommendations || [];


        // Clear loading

        gemsList.innerHTML = "";


        // No results

        if (places.length === 0) {

            gemsList.innerHTML = `

                <div class="text-center text-text-muted py-8">

                    No hidden gems found.

                </div>

            `;

            return;

        }


        // ======================================
        // DISPLAY RECOMMENDATIONS
        // ======================================

        places.forEach(place => {


            // Tourism pressure

            const pressure =
                place.tourism_pressure ?? 0;


            // Pressure level

            let pressureLevel =
                "Low";


            let badgeColor =
                "bg-green-100 text-green-700";


            if (pressure > 60) {

                pressureLevel = "High";

                badgeColor =
                    "bg-red-100 text-red-700";

            }

            else if (pressure > 35) {

                pressureLevel = "Medium";

                badgeColor =
                    "bg-yellow-100 text-yellow-700";

            }


            // Create card

            const card =
                document.createElement("div");


            card.className =

                "bg-surface-container-low rounded-2xl overflow-hidden border border-white/20 shadow-sm";


            card.innerHTML = `


                <!-- IMAGE -->

                <img
                    src="${place.image}"
                    alt="${place.name}"
                    class="w-full h-48 object-cover"
                    onerror="this.style.display='none'"
                >


                <div class="p-5">


                    <!-- HEADER -->

                    <div class="flex justify-between items-start gap-3">


                        <div>


                            <h3 class="text-lg font-bold text-on-surface">

                                ${place.name}

                            </h3>


                            <p class="text-sm text-text-muted mt-1">

                                📍 ${place.location}

                            </p>


                        </div>


                        <span
                            class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeColor}"
                        >

                            ${pressureLevel} Pressure

                        </span>


                    </div>



                    <!-- DESCRIPTION -->

                    <p class="text-sm text-text-muted mt-4">

                        ${place.description}

                    </p>



                    <!-- CATEGORY + DISTANCE -->

                    <div class="grid grid-cols-2 gap-4 mt-5">


                        <div>


                            <p class="text-xs text-text-muted">

                                Category

                            </p>


                            <p class="font-semibold mt-1">

                                ${place.category}

                            </p>


                        </div>



                        <div class="text-right">


                            <p class="text-xs text-text-muted">

                                Distance

                            </p>


                            <p class="font-semibold text-primary mt-1">

                                ${place.distance} km

                            </p>


                        </div>


                    </div>



                    <!-- TOURISM PRESSURE -->

                    <div class="mt-5">


                        <div class="flex justify-between text-sm mb-2">


                            <span class="text-text-muted">

                                Tourism Pressure

                            </span>


                            <span class="font-semibold">

                                ${pressure}/100

                            </span>


                        </div>



                        <div class="w-full bg-gray-200 rounded-full h-2">


                            <div
                                class="bg-gradient-to-r from-gradient-start to-gradient-end h-2 rounded-full"
                                style="width: ${pressure}%"
                            >

                            </div>


                        </div>


                    </div>



                    <!-- RECOMMENDATION -->

                    <div
                        class="mt-5 text-sm text-text-muted bg-white/40 rounded-xl p-3"
                    >

                        ✓ Recommended based on lower tourism pressure and distance from your location.

                    </div>


                </div>


            `;


            gemsList.appendChild(card);


        });


    }


    catch (error) {


        console.error(
            "API Error:",
            error
        );


        gemsList.innerHTML = `

            <div class="p-5 rounded-2xl bg-red-50 text-red-600 text-center">


                <h3 class="font-bold text-lg">

                    Unable to load hidden gems

                </h3>


                <p class="text-sm mt-2">

                    ${error.message}

                </p>


                <button
                    onclick="loadRecommendations()"
                    class="mt-4 px-5 py-2 rounded-full bg-red-500 text-white"
                >

                    Try Again

                </button>


            </div>

        `;

    }

}


// ==========================================
// REFRESH BUTTON
// ==========================================

function refreshRecommendations() {

    loadRecommendations();

}


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    loadRecommendations

);