// ---------- Trip setup: dates + location ----------

// Prevent picking dates in the past, and keep end date after start date.
const startDateEl = document.getElementById('startDate');
const endDateEl = document.getElementById('endDate');

function todayISO() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

startDateEl.min = todayISO();
endDateEl.min = todayISO();

startDateEl.addEventListener('change', () => {
  endDateEl.min = startDateEl.value;
  if (endDateEl.value && endDateEl.value < startDateEl.value) {
    endDateEl.value = startDateEl.value;
  }
});

// ---------- Use my location (real geolocation + reverse geocoding, no API key) ----------
// Reverse geocoding via OpenStreetMap's public Nominatim API.
function useMyLocation() {
  const statusEl = document.getElementById('locationStatus');
  const destinationInput = document.getElementById('destinationInput');
  const btn = document.getElementById('useLocationBtn');

  if (!navigator.geolocation) {
    showStatus('Geolocation is not supported in this browser.', true);
    return;
  }

  btn.disabled = true;
  showStatus('Locating you…', false);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (!res.ok) throw new Error('Reverse geocoding failed');
        const data = await res.json();
        const place =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          data.display_name;

        if (place) {
          destinationInput.value = place;
          showStatus(`Location set to ${place}`, false);
        } else {
          showStatus('Could not determine a place name for your location.', true);
        }
      } catch (err) {
        showStatus('Found your coordinates, but could not resolve a place name.', true);
        destinationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      } finally {
        btn.disabled = false;
      }
    },
    (err) => {
      btn.disabled = false;
      if (err.code === err.PERMISSION_DENIED) {
        showStatus('Location permission denied. Enter your destination manually.', true);
      } else {
        showStatus('Could not get your location. Enter it manually.', true);
      }
    },
    { timeout: 8000 }
  );
}

function showStatus(message, isError) {
  const statusEl = document.getElementById('locationStatus');
  statusEl.textContent = message;
  statusEl.classList.remove('hidden');
  statusEl.classList.toggle('text-tertiary', isError);
  statusEl.classList.toggle('text-text-muted', !isError);
}
