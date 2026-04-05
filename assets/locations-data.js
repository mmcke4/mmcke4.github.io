/**
 * Tom Wahl's — Centralized Location Data
 * ========================================
 * This single file powers hours, ratings, addresses, and status
 * across ALL pages (footer, order-online, locations, index, etc.)
 *
 * HOW TO UPDATE:
 * - Change hours below when a location adjusts seasonal/holiday hours
 * - Update ratings/reviews periodically from Google Business profiles
 * - All pages that include this script will reflect changes immediately
 *
 * USAGE: Add <script src="https://mmcke4.github.io/assets/locations-data.js"></script>
 *        before your page-specific <script> tags.
 *
 * Last updated from Google Business Profiles: April 2026
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
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
        hours: {
            mon: { open: "11:00 AM", close: "9:00 PM" },
            tue: { open: "11:00 AM", close: "9:00 PM" },
            wed: { open: "11:00 AM", close: "9:00 PM" },
            thu: { open: "11:00 AM", close: "9:00 PM" },
            fri: { open: "11:00 AM", close: "9:00 PM" },
            sat: { open: "11:00 AM", close: "9:00 PM" },
            sun: { open: "11:00 AM", close: "9:00 PM" }
        }
    }
];

/**
 * Utility: Get today's hours for a location
 * @param {Object} loc - A location object from TW_LOCATIONS
 * @returns {{ isOpen: boolean, todayHours: string, statusText: string }}
 */
function twGetStatus(loc) {
    const days = ['sun','mon','tue','wed','thu','fri','sat'];
    const now = new Date();
    const dayKey = days[now.getDay()];
    const today = loc.hours[dayKey];

    if (!today || !today.open) {
        return { isOpen: false, todayHours: 'Closed', statusText: 'Closed today' };
    }

    const toMin = (str) => {
        const [time, period] = str.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + (m || 0);
    };

    const openMin = toMin(today.open);
    const closeMin = toMin(today.close);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const isOpen = nowMin >= openMin && nowMin < closeMin;
    const shortOpen = today.open.replace(':00 ', '').replace(' ', '');
    const shortClose = today.close.replace(':00 ', '').replace(' ', '');
    const todayHours = `${shortOpen}–${shortClose}`;

    return {
        isOpen,
        todayHours,
        statusText: isOpen ? `Open · ${todayHours}` : `Closed · Opens ${shortOpen}`
    };
}

/**
 * Utility: Haversine distance in miles
 */
function twHaversine(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/**
 * Utility: Render footer hours from the Avon location (flagship)
 * Call this on any page: twRenderFooterHours('footerHoursId')
 */
function twRenderFooterHours(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const avon = TW_LOCATIONS.find(l => l.id === 'avon');
    if (!avon) return;
    const status = twGetStatus(avon);
    el.textContent = status.todayHours + ' Today';
}