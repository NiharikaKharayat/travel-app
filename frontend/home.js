// ============================================================
// FERENE HOME PAGE
// ============================================================


// ============================================================
// DATE HELPERS
// ============================================================

function todayISO() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

}


// ============================================================
// TRIP SETUP: DATES
// ============================================================

const startDateEl =
    document.getElementById('startDate');

const endDateEl =
    document.getElementById('endDate');


if (startDateEl && endDateEl) {

    const today = todayISO();

    startDateEl.min = today;

    endDateEl.min = today;


    startDateEl.addEventListener('change', () => {

        if (!startDateEl.value) {
            return;
        }

        endDateEl.min = startDateEl.value;


        if (
            endDateEl.value &&
            endDateEl.value < startDateEl.value
        ) {

            endDateEl.value =
                startDateEl.value;

        }

    });

}


// ============================================================
// FIND TRAVEL BUDDIES
// ============================================================

function findTravelBuddies() {

    // --------------------------------------------------------
    // GET FORM ELEMENTS SAFELY
    // --------------------------------------------------------

    const fromLocationEl =
        document.getElementById("fromLocation");

    const destinationEl =
        document.getElementById("destinationInput");

    const startDateEl =
        document.getElementById("startDate");

    const endDateEl =
        document.getElementById("endDate");

    // IMPORTANT:
    // Your HTML uses budgetSelect, NOT budgetInput.
    const budgetEl =
        document.getElementById("budgetSelect");

    const interestsEl =
        document.getElementById("interestsInput");


    // --------------------------------------------------------
    // READ VALUES
    // --------------------------------------------------------

    const from =
        fromLocationEl
            ? fromLocationEl.value.trim()
            : "";


    const destination =
        destinationEl
            ? destinationEl.value.trim()
            : "";


    const startDate =
        startDateEl
            ? startDateEl.value
            : "";


    const endDate =
        endDateEl
            ? endDateEl.value
            : "";


    const budget =
        budgetEl
            ? budgetEl.value
            : "";


    const interests =
        interestsEl
            ? interestsEl.value.trim()
            : "";


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!destination) {

        alert(
            "Please enter your destination."
        );

        return;

    }


    if (!startDate || !endDate) {

        alert(
            "Please select your travel dates."
        );

        return;

    }


    if (!budget) {

        alert(
            "Please select your budget style."
        );

        return;

    }


    if (!interests) {

        alert(
            "Please enter at least one travel interest."
        );

        return;

    }


    // --------------------------------------------------------
    // CREATE USER TRIP PREFERENCES
    // --------------------------------------------------------

    const preferences = {

        from: from,

        destination: destination,

        startDate: startDate,

        endDate: endDate,

        budget: budget,

        interests: interests

    };


    // --------------------------------------------------------
    // SAVE PREFERENCES
    // --------------------------------------------------------

    localStorage.setItem(
        "ferenePreferences",
        JSON.stringify(preferences)
    );


    // Also save a cleaner version for other Ferene pages.
    localStorage.setItem(
        "fereneUserTrip",
        JSON.stringify({

            from: from,

            destination: destination,

            startDate: startDate,

            endDate: endDate,

            budget: budget,

            interests: interests
                .split(",")
                .map(item => item.trim())
                .filter(Boolean)
                .map(item => item.toLowerCase())

        })
    );


    // --------------------------------------------------------
    // GO TO MATCHING PAGE
    // --------------------------------------------------------

    window.location.href =
        "swipe.html";

}


// ============================================================
// USE MY LOCATION
// ============================================================

function useMyLocation() {

    const statusEl =
        document.getElementById('locationStatus');

    const destinationInput =
        document.getElementById('destinationInput');

    const btn =
        document.getElementById('useLocationBtn');


    if (!destinationInput) {

        return;

    }


    if (!navigator.geolocation) {

        showStatus(
            'Geolocation is not supported in this browser.',
            true
        );

        return;

    }


    if (btn) {

        btn.disabled = true;

        btn.classList.add('opacity-60');

    }


    showStatus(
        'Detecting your location...',
        false
    );


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const {
                latitude,
                longitude
            } = position.coords;


            try {

                const res =
                    await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
                        {
                            headers: {
                                'Accept-Language': 'en'
                            }
                        }
                    );


                if (!res.ok) {

                    throw new Error(
                        'Reverse geocoding failed'
                    );

                }


                const data =
                    await res.json();


                const place =
                    data.address?.city ||
                    data.address?.town ||
                    data.address?.village ||
                    data.address?.municipality ||
                    data.address?.state ||
                    data.display_name;


                if (place) {

                    destinationInput.value =
                        place;


                    showStatus(
                        `Location set to ${place}`,
                        false
                    );

                } else {

                    showStatus(
                        'Could not determine a place name for your location.',
                        true
                    );

                }


            } catch (err) {

                showStatus(
                    'Found your coordinates, but could not resolve a place name.',
                    true
                );


                destinationInput.value =
                    `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

            } finally {

                if (btn) {

                    btn.disabled = false;

                    btn.classList.remove(
                        'opacity-60'
                    );

                }

            }

        },


        (err) => {

            if (btn) {

                btn.disabled = false;

                btn.classList.remove(
                    'opacity-60'
                );

            }


            if (
                err &&
                err.code ===
                err.PERMISSION_DENIED
            ) {

                showStatus(
                    'Location permission denied. Enter your destination manually.',
                    true
                );

            } else {

                showStatus(
                    'Could not get your location. Enter it manually.',
                    true
                );

            }

        },


        {

            enableHighAccuracy: true,

            timeout: 8000,

            maximumAge: 0

        }

    );

}


// ============================================================
// LOCATION STATUS
// ============================================================

function showStatus(
    message,
    isError
) {

    const statusEl =
        document.getElementById(
            'locationStatus'
        );


    if (!statusEl) {
        return;
    }


    statusEl.textContent =
        message;


    statusEl.classList.remove(
        'hidden',
        'text-tertiary',
        'text-text-muted'
    );


    statusEl.classList.add(

        isError
            ? 'text-tertiary'
            : 'text-text-muted'

    );

}


// ============================================================
// EMERGENCY SOS SYSTEM
// ============================================================

const sosButton =
    document.getElementById('sosButton');

const sosModal =
    document.getElementById('sosModal');

const activateSOS =
    document.getElementById('activateSOS');

const deactivateSOS =
    document.getElementById('deactivateSOS');

const cancelSOS =
    document.getElementById('cancelSOS');

const closeSOS =
    document.getElementById('closeSOS');

const shareSOS =
    document.getElementById('shareSOS');

const sosConfirmView =
    document.getElementById('sosConfirmView');

const sosLoadingView =
    document.getElementById('sosLoadingView');

const sosSuccessView =
    document.getElementById('sosSuccessView');

const sosCoordinates =
    document.getElementById('sosCoordinates');

const sosMapLink =
    document.getElementById('sosMapLink');

const sosTime =
    document.getElementById('sosTime');

const sosMessage =
    document.getElementById('sosMessage');

const shareStatus =
    document.getElementById('shareStatus');

const gpsStatusIcon =
    document.getElementById('gpsStatusIcon');


// ============================================================
// SOS STATE
// ============================================================

let emergencyLocation = null;

let sosIsActive = false;


// ============================================================
// OPEN SOS PANEL
// ============================================================

if (sosButton) {

    sosButton.addEventListener(
        'click',
        () => {

            if (sosIsActive) {

                showSOSView('success');

            } else {

                showSOSView('confirm');

            }


            if (sosModal) {

                sosModal.classList.remove(
                    'hidden'
                );

                document.body.style.overflow =
                    'hidden';

            }

        }
    );

}


// ============================================================
// CLOSE SOS PANEL
// ============================================================

function closeSOSPanel() {

    if (!sosModal) {
        return;
    }


    sosModal.classList.add(
        'hidden'
    );

    document.body.style.overflow =
        '';

}


if (cancelSOS) {

    cancelSOS.addEventListener(
        'click',
        closeSOSPanel
    );

}


if (closeSOS) {

    closeSOS.addEventListener(
        'click',
        closeSOSPanel
    );

}


// ============================================================
// CLICK OUTSIDE MODAL
// ============================================================

if (sosModal) {

    sosModal.addEventListener(
        'click',
        (event) => {

            if (
                event.target ===
                sosModal
            ) {

                closeSOSPanel();

            }

        }
    );

}


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener(
    'keydown',
    (event) => {

        if (
            event.key === 'Escape' &&
            sosModal &&
            !sosModal.classList.contains(
                'hidden'
            )
        ) {

            closeSOSPanel();

        }

    }
);


// ============================================================
// CHANGE SOS VIEW
// ============================================================

function showSOSView(view) {

    if (
        !sosConfirmView ||
        !sosLoadingView ||
        !sosSuccessView
    ) {

        return;

    }


    sosConfirmView.classList.add(
        'hidden'
    );

    sosLoadingView.classList.add(
        'hidden'
    );

    sosSuccessView.classList.add(
        'hidden'
    );


    if (view === 'confirm') {

        sosConfirmView.classList.remove(
            'hidden'
        );

    }


    if (view === 'loading') {

        sosLoadingView.classList.remove(
            'hidden'
        );

    }


    if (view === 'success') {

        sosSuccessView.classList.remove(
            'hidden'
        );

    }

}


// ============================================================
// ACTIVATE SOS
// ============================================================

if (activateSOS) {

    activateSOS.addEventListener(
        'click',
        activateEmergencySOS
    );

}


function activateEmergencySOS() {

    showSOSView(
        'loading'
    );

    sosIsActive = false;


    if (sosButton) {

        sosButton.disabled = true;

        sosButton.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">
                location_searching
            </span>
            SOS
        `;

    }


    if (!navigator.geolocation) {

        showLocationError(
            'Location services are not supported by your browser.'
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const {
                latitude,
                longitude
            } = position.coords;


            emergencyLocation = {

                latitude,

                longitude,

                timestamp: new Date()

            };


            sosIsActive = true;


            // ------------------------------------------------
            // GPS STATUS
            // ------------------------------------------------

            if (gpsStatusIcon) {

                gpsStatusIcon.textContent =
                    'check_circle';

                gpsStatusIcon.classList.remove(
                    'text-text-muted'
                );

                gpsStatusIcon.classList.add(
                    'text-green-600'
                );

            }


            // ------------------------------------------------
            // GOOGLE MAPS LINK
            // ------------------------------------------------

            const mapLink =
                `https://www.google.com/maps?q=${latitude},${longitude}`;


            // ------------------------------------------------
            // COORDINATES
            // ------------------------------------------------

            if (sosCoordinates) {

                sosCoordinates.textContent =
                    `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

            }


            // ------------------------------------------------
            // MAP
            // ------------------------------------------------

            if (sosMapLink) {

                sosMapLink.href =
                    mapLink;

            }


            // ------------------------------------------------
            // ACTIVATION TIME
            // ------------------------------------------------

            if (sosTime) {

                sosTime.textContent =
                    formatTime(
                        emergencyLocation.timestamp
                    );

            }


            // ------------------------------------------------
            // SHARE STATUS
            // ------------------------------------------------

            if (shareStatus) {

                shareStatus.textContent =
                    'Ready';

                shareStatus.classList.remove(
                    'text-green-600',
                    'text-text-muted'
                );

                shareStatus.classList.add(
                    'text-primary'
                );

            }


            // ------------------------------------------------
            // MESSAGE
            // ------------------------------------------------

            if (sosMessage) {

                sosMessage.textContent =
                    'Your emergency information is ready to share.';

            }


            // ------------------------------------------------
            // REASSURANCE DELAY
            // ------------------------------------------------

            setTimeout(
                () => {

                    showSOSView(
                        'success'
                    );

                    updateSOSButton(
                        true
                    );

                },
                700
            );

        },


        () => {

            showLocationError(
                'We could not get your location. Please enable location permission and try again.'
            );

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


// ============================================================
// LOCATION ERROR
// ============================================================

function showLocationError(message) {

    showSOSView(
        'confirm'
    );

    alert(message);

    updateSOSButton(
        false
    );

    sosIsActive = false;

}


// ============================================================
// UPDATE HEADER SOS BUTTON
// ============================================================

function updateSOSButton(active) {

    if (!sosButton) {
        return;
    }


    sosButton.disabled = false;


    if (active) {

        sosButton.innerHTML = `
            <span class="material-symbols-outlined text-[17px]">
                emergency
            </span>
            SOS Active
        `;


        sosButton.classList.remove(
            'bg-red-500',
            'hover:bg-red-600'
        );


        sosButton.classList.add(
            'bg-red-700'
        );

    } else {

        sosButton.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">
                sos
            </span>
            SOS
        `;


        sosButton.classList.remove(
            'bg-red-700'
        );


        sosButton.classList.add(
            'bg-red-500',
            'hover:bg-red-600'
        );

    }

}


// ============================================================
// SHARE EMERGENCY INFORMATION
// ============================================================

if (shareSOS) {

    shareSOS.addEventListener(
        'click',
        shareEmergencyInformation
    );

}


async function shareEmergencyInformation() {

    if (!emergencyLocation) {

        alert(
            'Your emergency location has not been acquired yet.'
        );

        return;

    }


    const {
        latitude,
        longitude,
        timestamp
    } = emergencyLocation;


    const mapLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    const message =
`FERENE EMERGENCY SOS

I may need help.

Current location:
${mapLink}

Coordinates:
${latitude.toFixed(5)}, ${longitude.toFixed(5)}

SOS activated:
${formatDateTime(timestamp)}`;


    shareSOS.disabled = true;

    shareSOS.textContent =
        'Preparing...';


    try {

        // ----------------------------------------------------
        // MOBILE / SUPPORTED BROWSERS
        // ----------------------------------------------------

        if (navigator.share) {

            await navigator.share({

                title:
                    'Ferene Emergency SOS',

                text:
                    message

            });


            markInformationShared();

        }


        // ----------------------------------------------------
        // DESKTOP FALLBACK
        // ----------------------------------------------------

        else {

            await navigator.clipboard.writeText(
                message
            );

            markInformationCopied();

        }


    } catch (error) {

        // User closed the share menu
        if (
            error &&
            error.name === 'AbortError'
        ) {

            shareSOS.disabled = false;

            shareSOS.textContent =
                'Share location';

            return;

        }


        // ----------------------------------------------------
        // CLIPBOARD FALLBACK
        // ----------------------------------------------------

        try {

            await navigator.clipboard.writeText(
                message
            );

            markInformationCopied();

        } catch {

            alert(
                `Emergency information:\n\n${message}`
            );


            shareSOS.disabled = false;

            shareSOS.textContent =
                'Share location';

        }

    }

}


// ============================================================
// SHARE SUCCESS
// ============================================================

function markInformationShared() {

    if (shareStatus) {

        shareStatus.textContent =
            'Shared from your device';


        shareStatus.classList.remove(
            'text-primary',
            'text-text-muted'
        );


        shareStatus.classList.add(
            'text-green-600'
        );

    }


    if (sosMessage) {

        sosMessage.textContent =
            'Emergency information was shared from your device.';

    }


    if (shareSOS) {

        shareSOS.disabled = false;


        shareSOS.innerHTML = `
            <span class="material-symbols-outlined text-[18px] align-middle">
                check_circle
            </span>
            Shared
        `;

    }

}


// ============================================================
// COPY FALLBACK
// ============================================================

function markInformationCopied() {

    if (shareStatus) {

        shareStatus.textContent =
            'Copied — ready to send';


        shareStatus.classList.remove(
            'text-primary',
            'text-text-muted'
        );


        shareStatus.classList.add(
            'text-green-600'
        );

    }


    if (sosMessage) {

        sosMessage.textContent =
            'Emergency information was copied. Send it to someone you trust.';

    }


    if (shareSOS) {

        shareSOS.disabled = false;


        shareSOS.innerHTML = `
            <span class="material-symbols-outlined text-[18px] align-middle">
                check_circle
            </span>
            Copied
        `;

    }

}


// ============================================================
// DEACTIVATE SOS
// ============================================================

if (deactivateSOS) {

    deactivateSOS.addEventListener(
        'click',
        () => {

            const confirmed =
                confirm(
                    'Deactivate Emergency SOS?\n\n' +
                    'This will end the active SOS state in Ferene.'
                );


            if (!confirmed) {
                return;
            }


            deactivateEmergencySOS();

        }
    );

}


function deactivateEmergencySOS() {

    sosIsActive = false;

    emergencyLocation = null;


    // --------------------------------------------------------
    // RESET GPS INDICATOR
    // --------------------------------------------------------

    if (gpsStatusIcon) {

        gpsStatusIcon.textContent =
            'radio_button_unchecked';


        gpsStatusIcon.classList.remove(
            'text-green-600'
        );


        gpsStatusIcon.classList.add(
            'text-text-muted'
        );

    }


    // --------------------------------------------------------
    // RESET SHARE STATUS
    // --------------------------------------------------------

    if (shareStatus) {

        shareStatus.textContent =
            'Inactive';


        shareStatus.classList.remove(
            'text-green-600',
            'text-primary'
        );


        shareStatus.classList.add(
            'text-text-muted'
        );

    }


    // --------------------------------------------------------
    // RESET MESSAGE
    // --------------------------------------------------------

    if (sosMessage) {

        sosMessage.textContent =
            'Emergency mode has been deactivated.';

    }


    // --------------------------------------------------------
    // RESET HEADER
    // --------------------------------------------------------

    updateSOSButton(
        false
    );


    // --------------------------------------------------------
    // CLOSE AFTER SHORT DELAY
    // --------------------------------------------------------

    setTimeout(
        () => {

            closeSOSPanel();

            showSOSView(
                'confirm'
            );

        },
        800
    );

}


// ============================================================
// TIME HELPERS
// ============================================================

function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    );

}


function formatDateTime(date) {

    return date.toLocaleString(
        [],
        {
            dateStyle: 'medium',
            timeStyle: 'short'
        }
    );

}