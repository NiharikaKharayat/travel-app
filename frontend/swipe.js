const profiles = [

    {
        name: "Aarav",
        age: 25,
        loc: "Delhi, India",
        destination: "Manali",
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



/* ----------------------------------
   LOAD USER TRAVEL PREFERENCES
----------------------------------- */

function loadUserPreferences() {

    const savedPreferences =
        localStorage.getItem("ferenePreferences");


    if (savedPreferences) {

        userPreferences =
            JSON.parse(savedPreferences);

    }


    const info =
        document.getElementById("userTripInfo");


    if (info && userPreferences.destination) {

        info.textContent =
            `Looking for travelers going to ${userPreferences.destination}`;

    }

}



/* ----------------------------------
   CALCULATE MATCH PERCENTAGE
----------------------------------- */

function calculateMatch(profile) {

    let score = 40;


    if (!userPreferences.destination) {

        return 75;

    }


    const userDestination =
        userPreferences.destination
            .toLowerCase();


    const profileDestination =
        profile.destination
            .toLowerCase();


    if (
        userDestination.includes(profileDestination) ||
        profileDestination.includes(userDestination)
    ) {

        score += 25;

    }


    if (userPreferences.interests) {

        const userInterests =
            userPreferences.interests
                .toLowerCase()
                .split(",")
                .map(item => item.trim());


        profile.interests.forEach(interest => {

            if (
                userInterests.some(userInterest =>
                    userInterest.includes(
                        interest.toLowerCase()
                    ) ||
                    interest.toLowerCase().includes(
                        userInterest
                    )
                )
            ) {

                score += 10;

            }

        });

    }


    if (
        userPreferences.budget &&
        profile.budget
            .toLowerCase()
            .includes(
                userPreferences.budget
                    .toLowerCase()
            )
    ) {

        score += 10;

    }


    if (score > 98) {

        score = 98;

    }


    return score;

}



/* ----------------------------------
   RENDER PROFILE CARD
----------------------------------- */

function renderCard() {

    const stack =
        document.getElementById("cardStack");


    const emptyState =
        document.getElementById("matchEmpty");


    if (profileIndex >= profiles.length) {

        stack.innerHTML = "";

        emptyState.classList.remove("hidden");

        emptyState.classList.add("flex");

        return;

    }


    emptyState.classList.add("hidden");

    emptyState.classList.remove("flex");


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
                background-size:cover;
                background-position:center;
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



/* ----------------------------------
   SWIPE FUNCTION
----------------------------------- */

function swipeCard(direction) {

    const card =
        document.getElementById("activeCard");


    if (!card) return;


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



/* ----------------------------------
   OPEN MATCH POPUP
----------------------------------- */

function openMatch(profile) {

    const matchName =
        document.getElementById("matchName");


    matchName.textContent =
        profile.name;


    localStorage.setItem(
        "matchedTraveler",
        profile.name
    );


    const popup =
        document.getElementById("matchPopup");


    popup.classList.remove("hidden");

    popup.classList.add("flex");

}



/* ----------------------------------
   CLOSE MATCH POPUP
----------------------------------- */

function closeMatch() {

    const popup =
        document.getElementById("matchPopup");


    popup.classList.add("hidden");

    popup.classList.remove("flex");

}



/* ----------------------------------
   JOIN CHATROOM
----------------------------------- */

function joinChatroom() {

    const roomId =
        "uttarakhand-trip-group";


    window.location.href =
        `chatroom.html?room=${roomId}`;

}



/* ----------------------------------
   RESET MATCHES
----------------------------------- */

function resetSwipe() {

    profileIndex = 0;

    renderCard();

}



/* ----------------------------------
   START APPLICATION
----------------------------------- */

loadUserPreferences();

renderCard();