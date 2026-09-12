// ==========================================
// FERENE AI PLANNER
// GEMINI API CONFIGURATION
// ==========================================


// ==========================================
// CONVERSATION HISTORY
// (sent to backend so Gemini remembers context)
// ==========================================

let conversationHistory = [];


// ==========================================
// MARKDOWN TO HTML FORMATTER
// ==========================================

function formatGeminiResponse(text) {

    if (!text) {
        return "";
    }

    let html = text;


    // ==========================================
    // REMOVE MARKDOWN HEADINGS
    // ### Heading -> Heading
    // ==========================================

    html = html.replace(
        /^###\s*(.*)$/gm,
        "<div class='font-bold text-base mt-4 mb-2'>$1</div>"
    );

    html = html.replace(
        /^##\s*(.*)$/gm,
        "<div class='font-bold text-lg mt-4 mb-2'>$1</div>"
    );

    html = html.replace(
        /^#\s*(.*)$/gm,
        "<div class='font-bold text-xl mt-4 mb-2'>$1</div>"
    );


    // ==========================================
    // BOLD
    // **Travel** -> Travel
    // ==========================================

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // ==========================================
    // BULLET POINTS
    // * Travel -> bullet Travel
    // ==========================================

    html = html.replace(
        /^\s*\*\s+/gm,
        "&bull; "
    );

    html = html.replace(
        /^\s*-\s+/gm,
        "&bull; "
    );


    // ==========================================
    // REMOVE HORIZONTAL LINES
    // --- -> nothing
    // ==========================================

    html = html.replace(
        /^\s*---+\s*$/gm,
        ""
    );


    // ==========================================
    // NUMBERED LIST
    // Keep 1. 2. 3.
    // ==========================================

    html = html.replace(
        /^\s*(\d+)\.\s+/gm,
        "$1. "
    );


    // ==========================================
    // CLEAN EXTRA SPACES
    // ==========================================

    html = html.replace(
        /\n{3,}/g,
        "\n\n"
    );


    // ==========================================
    // LINE BREAKS
    // ==========================================

    html = html.replace(
        /\n\n/g,
        "<br><br>"
    );

    html = html.replace(
        /\n/g,
        "<br>"
    );


    return html;
}


// ==========================================
// HIDDEN GEMS INTENT DETECTION
// ==========================================

function mentionsHiddenGems(message) {

    const keywords = [
        "hidden gem",
        "hidden place",
        "hidden spot",
        "offbeat",
        "off-beat",
        "less crowded",
        "underrated",
        "secret spot",
        "unexplored",
        "not touristy",
        "avoid crowds"
    ];

    const lowerMessage =
        message.toLowerCase();

    return keywords.some(
        keyword => lowerMessage.includes(keyword)
    );

}


// ==========================================
// DESTINATION EXTRACTION
// ==========================================

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


    const lowerMessage =
        message.toLowerCase();


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


// ==========================================
// SEND PROMPT
// ==========================================

async function sendPrompt(preset) {

    const input =
        document.getElementById("chatInput");


    const text =
        preset || input.value.trim();


    if (!text) {
        return;
    }


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
    // SAVE DESTINATION
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
    // GEMINI AI RESPONSE
    // THROUGH FASTAPI BACKEND
    // ==========================================

    try {

        console.log(
            "Sending request to Gemini..."
        );


        // ==========================================
        // SEND REQUEST TO BACKEND
        // (includes conversation history so Gemini
        // remembers earlier turns)
        // ==========================================

        const response = await fetch(

            "http://127.0.0.1:8000/chat",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    message: text,

                    history: conversationHistory

                })

            }

        );


        // ==========================================
        // READ BACKEND RESPONSE
        // ==========================================

        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        // ==========================================
        // CHECK BACKEND ERROR
        // ==========================================

        if (
            !response.ok ||
            data.status !== "success"
        ) {

            throw new Error(

                data.message ||
                "Backend chat request failed"

            );

        }


        // ==========================================
        // GET GEMINI TEXT
        // ==========================================

        const responseMessage =
            data.response ||
            "Sorry, I couldn't generate a response.";


        console.log(
            "Gemini message:",
            responseMessage
        );


        // ==========================================
        // UPDATE CONVERSATION HISTORY
        // ==========================================

        conversationHistory.push({
            role: "user",
            text: text
        });

        conversationHistory.push({
            role: "model",
            text: responseMessage
        });


        // ==========================================
        // REMOVE LOADING
        // ==========================================

        const loadingElement =
            document.getElementById(
                loadingId
            );


        if (loadingElement) {

            loadingElement.remove();

        }


        // ==========================================
        // FORMAT GEMINI RESPONSE
        // ==========================================

        const formattedResponse =
            formatGeminiResponse(
                responseMessage
            );


        // ==========================================
        // SHOW GEMINI RESPONSE
        // ==========================================

        const showHiddenGemsCta =
            mentionsHiddenGems(text) ||
            mentionsHiddenGems(responseMessage);


        const hiddenGemsCtaHtml = showHiddenGemsCta
            ? `
                <button
                    type="button"
                    onclick="goToHiddenGems()"
                    class="mt-3 flex items-center gap-1.5 bg-tertiary-container/15 border border-tertiary-container/40 text-on-tertiary-container text-xs font-label-md px-3 py-2 rounded-full hover:bg-tertiary-container/25 transition-colors"
                >
                    <span class="material-symbols-outlined text-[14px]">diamond</span>
                    View Hidden Gems
                </button>
            `
            : "";


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

                        ${formattedResponse}

                    </div>

                    ${hiddenGemsCtaHtml}

                </div>

            </div>
            `

        );


        log.scrollTop =
            log.scrollHeight;


    }


    // ==========================================
    // ERROR HANDLING
    // ==========================================

    catch (error) {

        console.error(
            "Gemini API Error:",
            error
        );


        // ==========================================
        // REMOVE LOADING
        // ==========================================

        const loadingElement =
            document.getElementById(
                loadingId
            );


        if (loadingElement) {

            loadingElement.remove();

        }


        // ==========================================
        // SHOW ERROR
        // ==========================================

        log.insertAdjacentHTML(

            "beforeend",

            `
            <div class="flex items-start gap-3 max-w-[95%] fade-in">

                <div class="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">

                    <span class="material-symbols-outlined text-primary text-sm">
                        error
                    </span>

                </div>


                <div class="bg-surface-container-low text-on-surface rounded-2xl p-4 text-sm">

                    Sorry, I couldn't connect to Gemini right now.

                </div>

            </div>
            `

        );


        log.scrollTop =
            log.scrollHeight;

    }

}


// ==========================================
// GO TO HIDDEN GEMS
// ==========================================

function goToHiddenGems() {

    window.location.href =
        "gems.html";

}


// ==========================================
// ENTER KEY
// ==========================================

const chatInput =
    document.getElementById("chatInput");


if (chatInput) {

    chatInput.addEventListener(

        "keydown",

        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendPrompt();

            }

        }

    );

}