// ==========================================
// EXTRACT TRAVEL PREFERENCES
// ==========================================

function extractTravelPreferences(text) {

    const message = text.toLowerCase();


    const preferences = {

        crowdPreference: "Low",

        budget: null,

        duration: null,

        interest: null

    };


    // ==========================================
    // CROWD PREFERENCE
    // ==========================================

    if (

        message.includes("crowded") &&
        !message.includes("less crowded")

    ) {

        preferences.crowdPreference = "High";

    }


    if (

        message.includes("medium crowd") ||
        message.includes("moderate crowd")

    ) {

        preferences.crowdPreference = "Medium";

    }


    if (

        message.includes("less crowded") ||
        message.includes("low crowd") ||
        message.includes("peaceful") ||
        message.includes("quiet") ||
        message.includes("hidden") ||
        message.includes("hidden places") ||
        message.includes("offbeat")

    ) {

        preferences.crowdPreference = "Low";

    }


    // ==========================================
    // BUDGET
    // ==========================================

    if (

        message.includes("budget") ||
        message.includes("cheap") ||
        message.includes("affordable")

    ) {

        preferences.budget = "Budget";

    }


    // ==========================================
    // DURATION
    // ==========================================

    const daysMatch =
        message.match(/(\d+)[-\s]?day/);


    if (daysMatch) {

        preferences.duration =
            parseInt(daysMatch[1]);

    }


    // ==========================================
    // INTEREST
    // ==========================================

    if (

        message.includes("nature") ||
        message.includes("mountain")

    ) {

        preferences.interest = "Nature";

    }


    if (

        message.includes("adventure") ||
        message.includes("trek")

    ) {

        preferences.interest = "Adventure";

    }


    if (

        message.includes("spiritual") ||
        message.includes("temple")

    ) {

        preferences.interest = "Spiritual";

    }


    return preferences;

}


// ==========================================
// SEND PROMPT
// ==========================================

function sendPrompt(preset) {


    const input =
        document.getElementById("chatInput");


    const text =
        preset || input.value.trim();


    if (!text) return;


    const preferences =
        extractTravelPreferences(text);


    // ==========================================
    // SAVE TO LOCAL STORAGE
    // ==========================================

    localStorage.setItem(

        "fereneTravelPreferences",

        JSON.stringify(preferences)

    );


    // DEBUG

    console.log(
        "FERENE SAVED PREFERENCES:",
        preferences
    );


    // ==========================================
    // USER MESSAGE
    // ==========================================

    const log =
        document.getElementById("chatLog");


    log.insertAdjacentHTML(

        "beforeend",

        `

        <div class="flex items-start gap-3 max-w-[85%] self-end flex-row-reverse ml-auto fade-in">

            <div class="bg-tertiary-container/10 text-on-surface border border-tertiary-container/30 rounded-2xl rounded-tr-sm p-4 text-sm">

                ${text}

            </div>

        </div>

        `

    );


    input.value = "";


    log.scrollTop =
        log.scrollHeight;


    // ==========================================
    // AI RESPONSE
    // ==========================================

    setTimeout(() => {


        log.insertAdjacentHTML(

            "beforeend",

            `

            <div class="flex items-start gap-3 max-w-[95%] fade-in">

                <div class="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">

                    <span class="material-symbols-outlined text-primary text-sm">

                        auto_awesome

                    </span>

                </div>


                <div class="w-full">

                    <div class="bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed">


                        <p class="mb-3">

                            Based on your preferences, I've curated destinations with ${preferences.crowdPreference.toLowerCase()} tourism pressure.

                        </p>


                        <button
                        onclick="location.href='gems.html'"
                        class="w-full bg-surface-card rounded-lg p-3 border border-outline-variant/30 flex items-center justify-between"
                        >


                            <div class="text-left">

                                <p class="font-label-md text-on-surface">

                                    View Personalized Hidden Gems

                                </p>


                                <p class="text-text-muted text-xs">

                                    Based on your travel preferences

                                </p>

                            </div>


                            <span class="material-symbols-outlined text-primary">

                                chevron_right

                            </span>


                        </button>


                    </div>

                </div>

            </div>

            `

        );


        log.scrollTop =
            log.scrollHeight;


    }, 500);


}


// ==========================================
// ENTER KEY
// ==========================================

document
    .getElementById("chatInput")
    .addEventListener(

        "keydown",

        function(event) {

            if (event.key === "Enter") {

                sendPrompt();

            }

        }

    );