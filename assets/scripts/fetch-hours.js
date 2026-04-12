/**
 * Tom Wahl's — Google Places API Hours Fetcher
 * ===============================================
 * Run by GitHub Actions daily to refresh assets/hours-cache.json.
 *
 * Usage (local test):
 *   GOOGLE_PLACES_API_KEY=your_key node scripts/fetch-hours.js
 *
 * Required env var: GOOGLE_PLACES_API_KEY
 * No npm dependencies — uses Node built-in https module.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY environment variable is not set.');
  process.exit(1);
}

// All 7 locations with their Google Place IDs
const LOCATIONS = [
  { id: 'avon',        placeId: 'ChIJfeUhN6VE0YkRwbghSiNMf-U' },
  { id: 'brighton',    placeId: 'ChIJZSAYxa7K1okR6SFysaZu4lY' },
  { id: 'basin',       placeId: 'ChIJ40rcrX000YkRjidZhLYdxtg' },
  { id: 'canandaigua', placeId: 'ChIJEUVku8Il0YkRqqsrKuX-CaQ' },
  { id: 'fairport',    placeId: 'ChIJ_8sNLa3M1okR8yNd933sq9k' },
  { id: 'greece',      placeId: 'ChIJ-WBYjVWx1okRhOUwLPdv614' },
  { id: 'newark',      placeId: 'ChIJ1UsPa6TU0IkR6sTeoPWJ8pI' },
];

const FIELDS = 'opening_hours,current_opening_hours,business_status,rating,user_ratings_total';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'hours-cache.json');

// Days of week mapping from Google (0=Sunday) to our keys
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function fetchPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(FIELDS)}&key=${API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.status !== 'OK') {
            reject(new Error(`Places API returned status ${parsed.status} for ${placeId}`));
          } else {
            resolve(parsed.result);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Convert Google's period format to our {open, close} format.
 * Google period: { open: { day: 1, time: "1100" }, close: { day: 1, time: "2100" } }
 * Our format:    { open: "11:00 am", close: "9:00 pm" }
 */
function formatTime(googleTime) {
  const raw = googleTime; // e.g. "1100" or "2100"
  let h = parseInt(raw.slice(0, 2), 10);
  const m = raw.slice(2);
  const period = h >= 12 ? 'pm' : 'am';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

function extractRegularHours(openingHours) {
  if (!openingHours || !openingHours.periods) return null;
  const result = {};
  for (const period of openingHours.periods) {
    if (!period.open || !period.close) continue;
    const dayKey = DAY_KEYS[period.open.day];
    result[dayKey] = {
      open:  formatTime(period.open.time),
      close: formatTime(period.close.time),
    };
  }
  return result;
}

/**
 * Extract upcoming special/holiday days from current_opening_hours.special_days.
 * Returns array of { date, displayDate, closed, open, close, label }
 * Filters to today and future only.
 */
function extractSpecialDays(currentOpeningHours) {
  if (!currentOpeningHours || !currentOpeningHours.special_days) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return currentOpeningHours.special_days
    .map(day => {
      // day.date is "YYYY-MM-DD"
      const date = new Date(day.date + 'T00:00:00');
      if (date < today) return null;

      const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      });

      // Determine hours: if the period for this day is missing or marked closed
      const isClosed = !day.open;
      return {
        date: day.date,
        displayDate,
        closed: isClosed,
        open:  isClosed ? null : (day.open  ? formatTime(day.open.time)  : null),
        close: isClosed ? null : (day.close ? formatTime(day.close.time) : null),
        label: null, // Google doesn't provide a holiday name; left null for manual override if needed
      };
    })
    .filter(Boolean);
}

/**
 * Merge special days arrays, deduplicating by date.
 * If the same date appears across multiple locations with different hours,
 * keep the first occurrence (chain-wide exceptions should be uniform via Moz Local).
 */
function mergeSpecialDays(allSpecialDays) {
  const seen = new Map();
  for (const day of allSpecialDays) {
    if (!seen.has(day.date)) {
      seen.set(day.date, day);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.date.localeCompare(b.date));
}

async function main() {
  console.log(`Fetching Places API data for ${LOCATIONS.length} locations...`);

  const results = [];
  for (const loc of LOCATIONS) {
    try {
      console.log(`  Fetching ${loc.id} (${loc.placeId})...`);
      const detail = await fetchPlaceDetails(loc.placeId);
      results.push({ loc, detail });
    } catch (err) {
      console.error(`  ERROR fetching ${loc.id}: ${err.message}`);
      // Continue — partial failures are handled by keeping existing data for that location
      results.push({ loc, detail: null });
    }
  }

  // Build regularHours from the first successful result (all locations share the same hours)
  let regularHours = null;
  for (const { detail } of results) {
    if (detail && detail.opening_hours) {
      regularHours = extractRegularHours(detail.opening_hours);
      if (regularHours && Object.keys(regularHours).length > 0) break;
    }
  }

  if (!regularHours) {
    console.warn('Warning: Could not extract regular hours from any location. Keeping existing cache hours.');
    // Read existing cache to preserve regularHours
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
      regularHours = existing.regularHours;
    } catch {
      regularHours = {};
    }
  }

  // Collect all special days across all locations
  const allSpecialDays = [];
  for (const { detail } of results) {
    if (detail && detail.current_opening_hours) {
      const days = extractSpecialDays(detail.current_opening_hours);
      allSpecialDays.push(...days);
    }
  }
  const specialDays = mergeSpecialDays(allSpecialDays);

  // Build per-location data
  const locationData = results.map(({ loc, detail }) => {
    if (!detail) {
      // Preserve existing data on fetch failure
      return { id: loc.id, businessStatus: 'UNKNOWN', rating: null, reviews: null };
    }
    return {
      id: loc.id,
      businessStatus: detail.business_status || 'OPERATIONAL',
      rating: detail.rating ?? null,
      reviews: detail.user_ratings_total ?? null,
    };
  });

  const cache = {
    lastUpdated: new Date().toISOString(),
    regularHours,
    specialDays,
    locations: locationData,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cache, null, 2));
  console.log(`\nDone. Written to ${OUTPUT_PATH}`);
  console.log(`  Regular hours: ${Object.keys(regularHours).length} days`);
  console.log(`  Special days:  ${specialDays.length}`);
  console.log(`  Locations:     ${locationData.length}`);
  if (specialDays.length > 0) {
    console.log('  Upcoming special days:');
    specialDays.forEach(d => {
      const hrs = d.closed ? 'CLOSED' : `${d.open} – ${d.close}`;
      console.log(`    ${d.date} (${d.displayDate}): ${hrs}`);
    });
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});