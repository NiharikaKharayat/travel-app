/* ============================================================
   FERENE - TRAVEL BUDDY MATCHING
   Deterministic matching based only on trip/profile data
   ============================================================ */


/* ------------------------------------------------------------
   SAMPLE TRAVELER PROFILES

   IMPORTANT:
   These profiles contain the actual trip information used
   by the matching algorithm.

   In the future, these can come from your backend/database.
------------------------------------------------------------ */

const profiles = [

    {
        name: "Aarav",
        age: 25,
        loc: "Delhi, India",
        destination: "Manali",

        startDate: "2026-09-15",
        endDate: "2026-09-22",

        budget: "Budget",

        interests: [
            "Trekking",
            "Adventure",
            "Photography"
        ],

        bio: "Mountain lover and weekend trekker. Always carrying a camera and searching for hidden trails.",

        tags: [
            "Trekking",
            "Adventure",
            "Photography"
        ],

        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80"
    },


    {
        name: "Priya",
        age: 24,
        loc: "Mumbai, India",
        destination: "Goa",

        startDate: "2026-09-17",
        endDate: "2026-09-26",

        budget: "Comfort",

        interests: [
            "Beaches",
            "Food",
            "Culture"
        ],

        bio: "Love discovering local cafes, beaches and hidden places. Looking for fun travel companions.",

        tags: [
            "Food",
            "Beaches",
            "Culture"
        ],

        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
    },


    {
        name: "Rohan",
        age: 27,
        loc: "Bangalore, India",
        destination: "Rishikesh",

        startDate: "2026-09-18",
        endDate: "2026-09-24",

        budget: "Budget",

        interests: [
            "Adventure",
            "Camping",
            "Trekking"
        ],

        bio: "Adventure seeker who loves river rafting, camping and mountain road trips.",

        tags: [
            "Camping",
            "Adventure",
            "Trekking"
        ],

        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },


    {
        name: "Ananya",
        age: 23,
        loc: "Pune, India",
        destination: "Uttarakhand",

        startDate: "2026-09-20",
        endDate: "2026-09-28",

        budget: "Comfort",

        interests: [
            "Photography",
            "Trekking",
            "Nature"
        ],

        bio: "Nature photographer and mountain lover. I enjoy peaceful trips and scenic locations.",

        tags: [
            "Nature",
            "Photography",
            "Trekking"
        ],

        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },


    {
        name: "Kabir",
        age: 26,
        loc: "Jaipur, India",
        destination: "Kasol",

        startDate: "2026-09-16",
        endDate: "2026-09-23",

        budget: "Budget",

        interests: [
            "Hiking",
            "Music",
            "Adventure"
        ],

        bio: "Backpacker, music lover and chai enthusiast. Always ready for a spontaneous mountain trip.",

        tags: [
            "Hiking",
            "Music",
            "Adventure"
        ],

        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    }

];


let profileIndex = 0;

let userPreferences = {};


/* ============================================================
   NORMALIZATION HELPERS
   ============================================================ */

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


function normalizeInterest(value) {

    return normalizeText(value)
        .replace(/[^a-z0-9\s]/g, "");

}


function getUserInterests() {

    const interests = userPreferences.interests;

    if (Array.isArray(interests)) {

        return interests
            .map(normalizeInterest)
            .filter(Boolean);

    }

    if (typeof interests === "string") {

        return interests
            .split(",")
            .map(normalizeInterest)
            .filter(Boolean);

    }

    return [];

}


/* ============================================================
   DESTINATION MATCH - 30%
   ============================================================ */

function calculateDestinationScore(userDestination, profileDestination) {

    const user = normalizeText(userDestination);
    const profile = normalizeText(profileDestination);

    if (!user || !profile) {
        return 0;
    }


    /* Exact match */

    if (user === profile) {
        return 1;
    }


    /* One destination name contains the other.
       Example:
       "New Delhi" vs "Delhi"
       "North Goa" vs "Goa"
    */

    if (
        user.includes(profile) ||
        profile.includes(user)
    ) {

        return 0.75;

    }


    /* Compare individual words */

    const userWords = new Set(
        user.split(/[\s,]+/).filter(Boolean)
    );

    const profileWords = new Set(
        profile.split(/[\s,]+/).filter(Boolean)
    );


    const commonWords =
        [...userWords].filter(word =>
            profileWords.has(word)
        );


    if (commonWords.length > 0) {

        return Math.min(
            commonWords.length /
            Math.max(userWords.size, profileWords.size),
            0.5
        );

    }


    return 0;

}


/* ============================================================
   DATE MATCH - 20%
   ============================================================ */

function calculateDateScore(
    userStart,
    userEnd,
    profileStart,
    profileEnd
) {

    if (
        !userStart ||
        !userEnd ||
        !profileStart ||
        !profileEnd
    ) {

        return 0;

    }


    const userStartDate =
        new Date(userStart);

    const userEndDate =
        new Date(userEnd);

    const profileStartDate =
        new Date(profileStart);

    const profileEndDate =
        new Date(profileEnd);


    if (
        Number.isNaN(userStartDate.getTime()) ||
        Number.isNaN(userEndDate.getTime()) ||
        Number.isNaN(profileStartDate.getTime()) ||
        Number.isNaN(profileEndDate.getTime())
    ) {

        return 0;

    }


    /* No overlap */

    if (
        userEndDate < profileStartDate ||
        profileEndDate < userStartDate
    ) {

        return 0;

    }


    /* Calculate overlapping period */

    const overlapStart =
        Math.max(
            userStartDate.getTime(),
            profileStartDate.getTime()
        );

    const overlapEnd =
        Math.min(
            userEndDate.getTime(),
            profileEndDate.getTime()
        );


    const overlapDays =
        Math.floor(
            (overlapEnd - overlapStart) /
            (1000 * 60 * 60 * 24)
        ) + 1;


    const userDays =
        Math.floor(
            (userEndDate.getTime() -
                userStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;


    const profileDays =
        Math.floor(
            (profileEndDate.getTime() -
                profileStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;


    const shorterTrip =
        Math.min(userDays, profileDays);


    if (shorterTrip <= 0) {
        return 0;
    }


    /* Completely overlapping dates = 100%

       Otherwise score according to the percentage
       of the shorter trip that overlaps.
    */

    return Math.min(
        overlapDays / shorterTrip,
        1
    );

}


/* ============================================================
   BUDGET MATCH - 15%
   ============================================================ */

function getBudgetRank(budget) {

    const value =
        normalizeText(budget);


    /*
       Lower → higher budget.

       This is only used to determine whether two
       entered budget levels are adjacent.
    */

    const ranks = {

        "budget": 1,
        "comfort": 2,
        "premium": 3

    };


    return ranks[value] || null;

}


function calculateBudgetScore(
    userBudget,
    profileBudget
) {

    const userRank =
        getBudgetRank(userBudget);

    const profileRank =
        getBudgetRank(profileBudget);


    if (
        userRank === null ||
        profileRank === null
    ) {

        return 0;

    }


    /* Same budget */

    if (userRank === profileRank) {

        return 1;

    }


    /* Adjacent budget */

    if (
        Math.abs(userRank - profileRank) === 1
    ) {

        return 0.5;

    }


    /* Very different */

    return 0;

}


/* ============================================================
   INTEREST MATCH - 25%
   ============================================================ */

function calculateInterestScore(
    userInterests,
    profileInterests
) {

    if (
        !Array.isArray(userInterests) ||
        !Array.isArray(profileInterests) ||
        userInterests.length === 0 ||
        profileInterests.length === 0
    ) {

        return 0;

    }


    const userSet =
        new Set(
            userInterests.map(normalizeInterest)
        );


    const profileSet =
        new Set(
            profileInterests.map(normalizeInterest)
        );


    const commonInterests =
        [...userSet].filter(
            interest =>
                profileSet.has(interest)
        );


    /*
       Percentage of the user's entered interests
       that are shared with the traveler.
    */

    return Math.min(
        commonInterests.length /
        userSet.size,
        1
    );

}


/* ============================================================
   STARTING LOCATION MATCH - 10%
   ============================================================ */

function calculateLocationScore(
    userLocation,
    profileLocation
) {

    const user =
        normalizeText(userLocation);

    const profile =
        normalizeText(profileLocation);


    if (!user || !profile) {
        return 0;
    }


    /* Exact location */

    if (user === profile) {

        return 1;

    }


    /*
       Compare location words.

       Example:
       "Delhi"
       "Delhi, India"

       or

       "New Delhi"
       "Delhi, India"
    */

    const userWords =
        new Set(
            user
                .split(/[\s,]+/)
                .filter(Boolean)
        );


    const profileWords =
        new Set(
            profile
                .split(/[\s,]+/)
                .filter(Boolean)
        );


    const commonWords =
        [...userWords].filter(
            word => profileWords.has(word)
        );


    if (commonWords.length > 0) {

        return 0.5;

    }


    return 0;

}


/* ============================================================
   FINAL MATCH CALCULATION
   ============================================================ */

function calculateMatch(profile) {

    const destinationScore =
        calculateDestinationScore(
            userPreferences.destination,
            profile.destination
        );


    const dateScore =
        calculateDateScore(
            userPreferences.startDate,
            userPreferences.endDate,
            profile.startDate,
            profile.endDate
        );


    const budgetScore =
        calculateBudgetScore(
            userPreferences.budget,
            profile.budget
        );


    const interestScore =
        calculateInterestScore(
            getUserInterests(),
            profile.interests
        );


    const locationScore =
        calculateLocationScore(
            userPreferences.origin,
            profile.loc
        );


    /*
       Required weights:

       Destination = 30%
       Dates       = 20%
       Budget      = 15%
       Interests   = 25%
       Origin      = 10%
    */

    const finalScore =

        (destinationScore * 30) +

        (dateScore * 20) +

        (budgetScore * 15) +

        (interestScore * 25) +

        (locationScore * 10);


    return Math.round(finalScore);

}


/* ============================================================
   LOAD USER TRAVEL PREFERENCES
   ============================================================ */

function loadUserPreferences() {

    const savedPreferences =
        localStorage.getItem(
            "fereneUserTrip"
        );


    /*
       Backward compatibility with the old key.
    */

    const oldPreferences =
        localStorage.getItem(
            "ferenePreferences"
        );


    if (savedPreferences) {

        try {

            userPreferences =
                JSON.parse(savedPreferences);

        } catch (error) {

            console.error(
                "Could not read saved trip data:",
                error
            );

            userPreferences = {};

        }

    } else if (oldPreferences) {

        try {

            userPreferences =
                JSON.parse(oldPreferences);

        } catch (error) {

            console.error(
                "Could not read old trip data:",
                error
            );

            userPreferences = {};

        }

    }


    const info =
        document.getElementById(
            "userTripInfo"
        );


    if (info) {

        if (
            userPreferences.destination
        ) {

            info.textContent =
                `Matching travelers going to ${userPreferences.destination}`;

        } else {

            info.textContent =
                "Matching based on your travel preferences";

        }

    }


    console.log(
        "USER TRIP DATA:",
        userPreferences
    );

}


/* ============================================================
   RENDER PROFILE CARD
   ============================================================ */

function renderCard() {

    const stack =
        document.getElementById(
            "cardStack"
        );


    const emptyState =
        document.getElementById(
            "matchEmpty"
        );


    if (!stack || !emptyState) {
        return;
    }


    if (
        profileIndex >= profiles.length
    ) {

        stack.innerHTML = "";

        emptyState.classList.remove(
            "hidden"
        );

        emptyState.classList.add(
            "flex"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );

    emptyState.classList.remove(
        "flex"
    );


    const profile =
        profiles[profileIndex];


    const match =
        calculateMatch(profile);


    stack.innerHTML = `

        <div
            id="activeCard"
            class="absolute inset-0 rounded-[28px] overflow-hidden shadow-xl transition-all duration-300"
            style="
                background-image:
                url('${profile.img}');
                background-size: cover;
                background-position: center;
            "
        >

            <div
                class="absolute inset-0
                bg-gradient-to-t
                from-black/90
                via-black/20
                to-transparent">
            </div>


            <!-- MATCH -->

            <div
                class="absolute top-5 left-5
                bg-white/95
                text-primary
                font-semibold
                px-4 py-2
                rounded-full
                flex items-center gap-2"
            >

                <span
                    class="material-symbols-outlined text-[18px]"
                    style="font-variation-settings:'FILL' 1;"
                >
                    favorite
                </span>

                ${match}% Match

            </div>


            <!-- CONTENT -->

            <div
                class="absolute bottom-0 left-0 right-0
                p-6 text-white"
            >

                <h2 class="text-3xl font-bold">

                    ${profile.name},
                    ${profile.age}

                </h2>


                <p
                    class="flex items-center gap-1
                    text-white/80 mt-2"
                >

                    <span
                        class="material-symbols-outlined text-[18px]"
                    >
                        location_on
                    </span>

                    ${profile.loc}

                </p>


                <div
                    class="flex items-center gap-2
                    mt-2 text-white/80 text-sm"
                >

                    <span
                        class="material-symbols-outlined text-[18px]"
                    >
                        flight_takeoff
                    </span>

                    Going to ${profile.destination}

                </div>


                <div
                    class="flex items-center gap-2
                    mt-2 text-white/80 text-sm"
                >

                    <span
                        class="material-symbols-outlined text-[18px]"
                    >
                        calendar_month
                    </span>

                    ${formatDate(profile.startDate)}
                    -
                    ${formatDate(profile.endDate)}

                </div>


                <p
                    class="text-white/90
                    text-sm mt-4"
                >

                    ${profile.bio}

                </p>


                <div
                    class="flex flex-wrap
                    gap-2 mt-4"
                >

                    ${profile.tags.map(tag => `

                        <span
                            class="
                            bg-white/20
                            backdrop-blur-sm
                            border border-white/30
                            text-white
                            text-xs
                            px-3 py-1.5
                            rounded-full"
                        >

                            ${tag}

                        </span>

                    `).join("")}

                </div>

            </div>

        </div>

    `;

}


/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ============================================================
   SWIPE FUNCTION
   ============================================================ */

function swipeCard(direction) {

    const card =
        document.getElementById(
            "activeCard"
        );


    if (!card) {
        return;
    }


    const profile =
        profiles[profileIndex];


    if (direction === "right") {

        card.style.transform =
            "translateX(120%) rotate(20deg)";

        card.style.opacity = "0";


        setTimeout(() => {

            openMatch(profile);

        }, 250);

    } else {

        card.style.transform =
            "translateX(-120%) rotate(-20deg)";

        card.style.opacity = "0";

    }


    setTimeout(() => {

        profileIndex++;

        renderCard();

    }, 350);

}


/* ============================================================
   OPEN MATCH POPUP
   ============================================================ */

function openMatch(profile) {

    const matchName =
        document.getElementById(
            "matchName"
        );


    if (matchName) {

        matchName.textContent =
            profile.name;

    }


    localStorage.setItem(
        "matchedTraveler",
        profile.name
    );


    const popup =
        document.getElementById(
            "matchPopup"
        );


    if (popup) {

        popup.classList.remove(
            "hidden"
        );

        popup.classList.add(
            "flex"
        );

    }

}


/* ============================================================
   CLOSE MATCH POPUP
   ============================================================ */

function closeMatch() {

    const popup =
        document.getElementById(
            "matchPopup"
        );


    if (!popup) {
        return;
    }


    popup.classList.add(
        "hidden"
    );

    popup.classList.remove(
        "flex"
    );

}


/* ============================================================
   JOIN CHATROOM
   ============================================================ */

function joinChatroom() {

    const roomId =
        "uttarakhand-trip-group";


    window.location.href =
        `chatroom.html?room=${roomId}`;

}


/* ============================================================
   RESET MATCHES
   ============================================================ */

function resetSwipe() {

    profileIndex = 0;

    renderCard();

}


/* ============================================================
   START
   ============================================================ */

loadUserPreferences();

renderCard();