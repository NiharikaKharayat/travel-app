// ============================================================
// FERENE HOME PAGE
// ============================================================


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


// Current emergency location
let emergencyLocation = null;

// Whether SOS is currently active
let sosIsActive = false;


// ------------------------------------------------------------
// OPEN SOS PANEL
// ------------------------------------------------------------

if (sosButton) {

  sosButton.addEventListener('click', () => {

    if (sosIsActive) {
      showSOSView('success');
    } else {
      showSOSView('confirm');
    }

    sosModal.classList.remove('hidden');

    document.body.style.overflow = 'hidden';

  });

}


// ------------------------------------------------------------
// CLOSE SOS PANEL
// ------------------------------------------------------------

function closeSOSPanel() {

  sosModal.classList.add('hidden');

  document.body.style.overflow = '';

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


// Click outside modal
if (sosModal) {

  sosModal.addEventListener('click', (event) => {

    if (event.target === sosModal) {
      closeSOSPanel();
    }

  });

}


// ------------------------------------------------------------
// ESC KEY
// ------------------------------------------------------------

document.addEventListener('keydown', (event) => {

  if (
    event.key === 'Escape' &&
    sosModal &&
    !sosModal.classList.contains('hidden')
  ) {
    closeSOSPanel();
  }

});


// ------------------------------------------------------------
// CHANGE SOS VIEW
// ------------------------------------------------------------

function showSOSView(view) {

  if (
    !sosConfirmView ||
    !sosLoadingView ||
    !sosSuccessView
  ) {
    return;
  }

  sosConfirmView.classList.add('hidden');
  sosLoadingView.classList.add('hidden');
  sosSuccessView.classList.add('hidden');

  if (view === 'confirm') {
    sosConfirmView.classList.remove('hidden');
  }

  if (view === 'loading') {
    sosLoadingView.classList.remove('hidden');
  }

  if (view === 'success') {
    sosSuccessView.classList.remove('hidden');
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

  showSOSView('loading');

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


      // Store emergency location
      emergencyLocation = {
        latitude,
        longitude,
        timestamp: new Date()
      };


      // SOS is now locally active
      sosIsActive = true;


      // GPS status
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


      // Google Maps link
      const mapLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


      // Coordinates
      if (sosCoordinates) {

        sosCoordinates.textContent =
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

      }


      // Map
      if (sosMapLink) {
        sosMapLink.href = mapLink;
      }


      // Activation time
      if (sosTime) {

        sosTime.textContent =
          formatTime(
            emergencyLocation.timestamp
          );

      }


      // Share status
      if (shareStatus) {

        shareStatus.textContent = 'Ready';

        shareStatus.classList.remove(
          'text-green-600',
          'text-text-muted'
        );

        shareStatus.classList.add(
          'text-primary'
        );

      }


      // Message
      if (sosMessage) {

        sosMessage.textContent =
          'Your emergency information is ready to share.';

      }


      // Small delay for reassurance UX
      setTimeout(() => {

        showSOSView('success');

        updateSOSButton(true);

      }, 700);

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

  showSOSView('confirm');

  alert(message);

  updateSOSButton(false);

  sosIsActive = false;

}


// ============================================================
// UPDATE HEADER SOS BUTTON
// ============================================================

function updateSOSButton(active) {

  if (!sosButton) return;

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
  shareSOS.textContent = 'Preparing...';


  try {

    // Mobile / supported browsers
    if (navigator.share) {

      await navigator.share({
        title: 'Ferene Emergency SOS',
        text: message
      });

      markInformationShared();

    }

    // Desktop fallback
    else {

      await navigator.clipboard.writeText(message);

      markInformationCopied();

    }

  } catch (error) {

    // User closed the share menu
    if (error.name === 'AbortError') {

      shareSOS.disabled = false;
      shareSOS.textContent = 'Share location';

      return;
    }


    // Try clipboard
    try {

      await navigator.clipboard.writeText(message);

      markInformationCopied();

    } catch {

      alert(
        `Emergency information:\n\n${message}`
      );

      shareSOS.disabled = false;
      shareSOS.textContent = 'Share location';

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


  shareSOS.disabled = false;

  shareSOS.innerHTML = `
    <span class="material-symbols-outlined text-[18px] align-middle">
      check_circle
    </span>
    Shared
  `;

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


  shareSOS.disabled = false;

  shareSOS.innerHTML = `
    <span class="material-symbols-outlined text-[18px] align-middle">
      check_circle
    </span>
    Copied
  `;

}


// ============================================================
// DEACTIVATE SOS
// ============================================================

if (deactivateSOS) {

  deactivateSOS.addEventListener(
    'click',
    () => {

      const confirmed = confirm(
        'Deactivate Emergency SOS?\n\n' +
        'This will end the active SOS state in Ferene.'
      );

      if (!confirmed) return;

      deactivateEmergencySOS();

    }
  );

}


function deactivateEmergencySOS() {

  sosIsActive = false;

  emergencyLocation = null;


  // Reset GPS indicator
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


  // Reset share status
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


  // Reset message
  if (sosMessage) {

    sosMessage.textContent =
      'Emergency mode has been deactivated.';

  }


  // Reset header
  updateSOSButton(false);


  // Give the user a moment to see the state change
  setTimeout(() => {

    closeSOSPanel();

    showSOSView('confirm');

  }, 800);

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