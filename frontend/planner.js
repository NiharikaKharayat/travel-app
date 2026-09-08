const CHAT_API_URL = "http://127.0.0.1:8000/chat";


function extractDestination(message) {

    const destinations = [

        "Dehradun",
        "Rishikesh",
        "Mussoorie",
        "Pauri",
        "Srinagar",
        "Kotdwar",
        "Rudraprayag",
        "Kedarnath",
        "Gopeshwar",
        "Joshimath",
        "Badrinath",
        "Auli",
        "Hemkund Sahib",
        "Valley of Flowers",
        "Tehri",
        "Uttarkashi",
        "Gangotri",
        "Yamunotri",
        "Haridwar",
        "Almora",
        "Ranikhet",
        "Kausani",
        "Bageshwar",
        "Pithoragarh",
        "Champawat",
        "Nainital",
        "Kathgodam",
        "Corbett",
        "Udham Singh Nagar"

    ];


    const lowerMessage = message.toLowerCase();


    for (const destination of destinations) {

        if (
            lowerMessage.includes(
                destination.toLowerCase()
            )
        ) {

            return destination;

        }

    }


    return null;

}


function sendPrompt(preset) {


    const input =
        document.getElementById("chatInput");


    const text =
        preset || input.value.trim();


    if (!text) return;


    const log =
        document.getElementById("chatLog");


    // ==========================================
    // SHOW USER MESSAGE
    // ==========================================

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
    // EXTRACT DESTINATION
    // ==========================================

    const destination =
        extractDestination(text);


    // ==========================================
    // SAVE TRIP DESTINATION
    // ==========================================

    if (destination) {

        localStorage.setItem(

            "selectedDestination",

            destination

        );


        console.log(

            "Trip destination saved:",

            destination

        );

    }


    // ==========================================
    // SHOW AI THINKING
    // ==========================================

    const loadingId =
        "loading-" + Date.now();


    log.insertAdjacentHTML(

        "beforeend",

        `

        <div id="${loadingId}" class="flex items-start gap-3 max-w-[95%]">

            <div class="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">

                <span class="material-symbols-outlined text-primary text-sm">

                    auto_awesome

                </span>

            </div>


            <div class="bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm p-4 text-sm">

                Planning your trip...

            </div>

        </div>

        `

    );


    log.scrollTop =
        log.scrollHeight;


    // ==========================================
    // AI RESPONSE
    // ==========================================

    setTimeout(() => {


        const loadingElement =
            document.getElementById(loadingId);


        if (loadingElement) {

            loadingElement.remove();

        }


        let responseMessage;


        if (destination) {

            responseMessage = `

            Great choice! I've started planning your trip to <b>${destination}</b>.

            I'll also help you discover nearby destinations with lower tourism pressure.

            `;

        }

        else {

            responseMessage = `

            I can help plan your Uttarakhand trip.

            Try mentioning a destination such as Rishikesh, Nainital, Mussoorie, Auli or Kedarnath.

            `;

        }


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


                        <p class="mb-4">

                            ${responseMessage}

                        </p>


                        ${destination ? `

                        <button

                            onclick="goToHiddenGems()"

                            class="w-full bg-surface-card rounded-lg p-3 border border-outline-variant/30 flex items-center justify-between hover:border-primary/50 transition-colors"

                        >


                            <div class="text-left">


                                <p class="font-label-md text-on-surface">

                                    Discover Hidden Gems

                                </p>


                                <p class="text-text-muted text-xs">

                                    Low crowd + nearby destinations

                                </p>


                            </div>


                            <span class="material-symbols-outlined text-primary">

                                chevron_right

                            </span>


                        </button>

                        ` : ""}


                    </div>


                </div>


            </div>

            `

        );


        log.scrollTop =
            log.scrollHeight;


    }, 700);


}


function goToHiddenGems() {

    window.location.href =
        "gems.html";

}


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