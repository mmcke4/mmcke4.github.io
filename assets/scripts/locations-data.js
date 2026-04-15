/**
 * Tom Wahl's — Centralized Location Data
 * ========================================
 * Static location info (address, phone, coordinates, URLs, rating fallbacks).
 * Hours and live ratings are loaded from /assets/hours-cache.json,
 * which is updated daily by GitHub Actions via fetch-hours.js.
 *
 * USAGE: <script src="/assets/scripts/locations-data.js"></script>
 *        Add before page-specific <script> blocks.
 */

const TW_LOCATIONS = [
    {
        id: "avon",
        name: "Tom Wahl's Avon",
        shortName: "Avon",
        address: "283 E Main St",
        city: "Avon",
        state: "NY",
        zip: "14414",
        phone: "585-226-2420",
        lat: 42.9097,
        lng: -77.7323,
        rating: 4.6,
        reviews: 3553,
        placeId: "ChIJfeUhN6VE0YkRwbghSiNMf-U",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsavon#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJfeUhN6VE0YkRwbghSiNMf-U",
        hours: {}
    },
    {
        id: "brighton",
        name: "Tom Wahl's Brighton",
        shortName: "Brighton",
        address: "2545 Monroe Ave",
        city: "Rochester",
        state: "NY",
        zip: "14618",
        phone: "585-441-9620",
        lat: 43.1174,
        lng: -77.5553,
        rating: 4.4,
        reviews: 1266,
        placeId: "ChIJZSAYxa7K1okR6SFysaZu4lY",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsbrighton#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJZSAYxa7K1okR6SFysaZu4lY",
        hours: {}
    },
    {
        id: "basin",
        name: "Tom Wahl's Bushnell's Basin",
        shortName: "Bushnell's Basin",
        address: "643 Pittsford-Victor Rd",
        city: "Pittsford",
        state: "NY",
        zip: "14534",
        phone: "585-586-4920",
        lat: 43.0613,
        lng: -77.4780,
        rating: 4.4,
        reviews: 929,
        placeId: "ChIJ40rcrX000YkRjidZhLYdxtg",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsbushnellsbasin#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ40rcrX000YkRjidZhLYdxtg",
        hours: {}
    },
    {
        id: "canandaigua",
        name: "Tom Wahl's Canandaigua",
        shortName: "Canandaigua",
        address: "2510 Rochester Rd",
        city: "Canandaigua",
        state: "NY",
        zip: "14424",
        phone: "585-393-9170",
        lat: 42.9093,
        lng: -77.2987,
        rating: 4.4,
        reviews: 1732,
        placeId: "ChIJEUVku8Il0YkRqqsrKuX-CaQ",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlscanandaigua#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJEUVku8Il0YkRqqsrKuX-CaQ",
        hours: {}
    },
    {
        id: "fairport",
        name: "Tom Wahl's Fairport",
        shortName: "Fairport",
        address: "1333 Fairport Rd",
        city: "Fairport",
        state: "NY",
        zip: "14450",
        phone: "585-377-8420",
        lat: 43.1007,
        lng: -77.4609,
        rating: 4.4,
        reviews: 1078,
        placeId: "ChIJ_8sNLa3M1okR8yNd933sq9k",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsfairport#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ_8sNLa3M1okR8yNd933sq9k",
        hours: {}
    },
    {
        id: "greece",
        name: "Tom Wahl's Greece",
        shortName: "Greece",
        address: "671 Maiden Ln",
        city: "Rochester",
        state: "NY",
        zip: "14616",
        phone: "585-504-7470",
        lat: 43.2234,
        lng: -77.6602,
        rating: 3.9,
        reviews: 379,
        placeId: "ChIJ-WBYjVWx1okRhOUwLPdv614",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsgreece#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ-WBYjVWx1okRhOUwLPdv614",
        hours: {}
    },
    {
        id: "newark",
        name: "Tom Wahl's Newark",
        shortName: "Newark",
        address: "585 W Union St",
        city: "Newark",
        state: "NY",
        zip: "14513",
        phone: "315-331-9112",
        lat: 43.0471,
        lng: -77.1115,
        rating: 4.3,
        reviews: 1126,
        placeId: "ChIJ1UsPa6TU0IkR6sTeoPWJ8pI",
        orderUrl: "https://order.myguestaccount.com/menu/tomwahlsnewark#value-meals",
        mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ1UsPa6TU0IkR6sTeoPWJ8pI",
        hours: {}
    }
];

// ── LIVE HOURS CACHE ─────────────────────────────────────────────────────────
// Fetched once on page load. Resolves TW_CACHE and populates loc.hours /
// live ratings on every TW_LOCATIONS entry. Pages that shallow-copy
// TW_LOCATIONS (order-online.html) share the same hours object by reference,
// so they receive live data automatically once this promise resolves.
let TW_CACHE = null;
const TW_CACHE_READY = fetch('/assets/hours-cache.json')
    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function(data) {
        TW_CACHE = data;

        // Populate loc.hours from regularHours
        var rh = data.regularHours;
        if (rh) {
            TW_LOCATIONS.forEach(function(loc) {
                ['sun','mon','tue','wed','thu','fri','sat'].forEach(function(day) {
                    if (rh[day]) loc.hours[day] = rh[day];
                });
            });
        }

        // Update ratings / reviews / businessStatus from live cache
        (data.locations || []).forEach(function(cached) {
            var loc = TW_LOCATIONS.find(function(l) { return l.id === cached.id; });
            if (!loc) return;
            if (cached.rating   != null) loc.rating         = cached.rating;
            if (cached.reviews  != null) loc.reviews        = cached.reviews;
            if (cached.businessStatus)   loc.businessStatus = cached.businessStatus;
        });
    })
    .catch(function() {});

// ── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Get today's open/closed status for a location.
 * Depends on loc.hours being populated (call after TW_CACHE_READY resolves).
 * @param {Object} loc - Entry from TW_LOCATIONS
 * @returns {{ isOpen: boolean, todayHours: string, statusText: string }}
 */
function twGetStatus(loc) {
    var days = ['sun','mon','tue','wed','thu','fri','sat'];
    var today = loc.hours[days[new Date().getDay()]];
    if (!today || !today.open) {
        return { isOpen: false, todayHours: 'Closed', statusText: 'Closed today' };
    }
    var toMin = function(str) {
        var parts = str.trim().split(' ');
        var time  = parts[0], per = parts[1];
        var hm = time.split(':').map(Number);
        var h  = hm[0], m = hm[1] || 0;
        if (per === 'pm' && h !== 12) h += 12;
        if (per === 'am' && h === 12) h  = 0;
        return h * 60 + m;
    };
    var now     = new Date();
    var nowMin  = now.getHours() * 60 + now.getMinutes();
    var isOpen  = nowMin >= toMin(today.open) && nowMin < toMin(today.close);
    var fmt     = function(s) { return s.replace(':00', '').replace(' ', ''); };
    var range   = fmt(today.open) + '\u2013' + fmt(today.close);
    return {
        isOpen: isOpen,
        todayHours: range,
        statusText: isOpen ? 'Open \u00b7 ' + range : 'Closed \u00b7 Opens ' + fmt(today.open.trim())
    };
}

/**
 * Render today's hours into a footer element.
 * Async-safe: waits for the cache before touching the DOM.
 * Call: twRenderFooterHours('footerHours')
 */
function twRenderFooterHours(elementId) {
    TW_CACHE_READY.then(function() {
        var el = document.getElementById(elementId);
        if (!el) return;
        var rh = TW_CACHE && TW_CACHE.regularHours;
        if (!rh) return; // element keeps its static default text
        var days  = ['sun','mon','tue','wed','thu','fri','sat'];
        var today = rh[days[new Date().getDay()]];
        if (!today || !today.open) { el.textContent = 'Closed Today'; return; }
        var fmt = function(s) { return s.replace(':00', '').replace(' ', ''); };
        el.textContent = fmt(today.open) + '\u2013' + fmt(today.close) + ' Today';
    });
}