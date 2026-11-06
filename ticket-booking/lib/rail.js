// The rules of the railway in plain JavaScript: times, dates, fares and seats.
// No React and no secrets here, so both the server and the browser may import it.
import { seatClasses, stations, trains } from "@/data/timetable";

export const BOOKING_WINDOW_DAYS = 10; // today plus the next 9 days
export const MAX_SEATS = 4; // per booking
export const SERVICE_CHARGE = 20; // taka, per seat
export const CANCEL_CHARGE_PERCENT = 10; // kept from the fare when you cancel

export const paymentMethods = [
  { id: "bkash", name: "bKash" },
  { id: "nagad", name: "Nagad" },
  { id: "card", name: "Card" },
];

// ----- 1. Lookups by id -----
export function getStation(code) {
  return stations.find((station) => station.code === code);
}

export function getSeatClass(code) {
  return seatClasses.find((seatClass) => seatClass.code === code);
}

export function getTrain(id) {
  return trains.find((train) => train.id === id);
}

export function getPaymentMethod(id) {
  return paymentMethods.find((method) => method.id === id);
}

// ----- 2. Clock times, as minutes after midnight -----

// { time: "16:30" } -> 990.  { time: "05:20", nextDay: true } -> 1760 (24 hours later)
export function toMinutes(stop) {
  const [hours, minutes] = stop.time.split(":").map(Number);
  return hours * 60 + minutes + (stop.nextDay ? 24 * 60 : 0);
}

// 990 -> "4:30 PM", 1760 -> "5:20 AM"
export function formatClock(totalMinutes) {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  const hours12 = hours24 % 12 || 12; // 0 -> 12, 13 -> 1
  return `${hours12}:${minutes} ${hours24 < 12 ? "AM" : "PM"}`;
}

// 310 -> "5h 10m"
export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

// ----- 3. Dates, as "YYYY-MM-DD" text in Bangladesh time -----

// Bangladesh is always UTC+6 (no daylight saving), so we shift the clock by 6 hours
// and read the UTC parts. Works the same on your laptop and on a server anywhere.
export function getDhakaNow() {
  const dhaka = new Date(Date.now() + 6 * 60 * 60 * 1000);
  return {
    date: dhaka.toISOString().slice(0, 10), // "2026-10-05"
    minutes: dhaka.getUTCHours() * 60 + dhaka.getUTCMinutes(), // 17:52 -> 1072
  };
}

// "2026-10-05" + 1 -> "2026-10-06" (also across months and years)
export function addDays(date, days) {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}

// 0 = Sunday ... 6 = Saturday
export function getWeekday(date) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getWeekdayName(weekday) {
  return weekdayNames[weekday];
}

// "2026-10-06" -> "Tue 6 Oct" (short) or "Tuesday, 6 October 2026" (long)
export function formatDate(date, style = "short") {
  const options =
    style === "long"
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" };
  // timeZone "UTC" matches how we built the Date, so the day never shifts
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

// "2026-10-05T11:52:00.000Z" -> "5 Oct 2026, 17:52", shown in Bangladesh time
export function formatTimestamp(isoText) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(isoText));
}

// Every date you can book: today and the next 9 days
export function getBookingDates(now = getDhakaNow()) {
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => addDays(now.date, index));
}

// ----- 4. Journeys: one passenger's part of a train's route -----

// Subarna 702, DHK -> CTG: { fromIndex: 0, toIndex: 2, departs: 990, arrives: 1300, ... }
// null when the train doesn't go from -> to, in that order.
export function getJourney(train, from, to) {
  const fromIndex = train.stops.findIndex((stop) => stop.station === from);
  const toIndex = train.stops.findIndex((stop) => stop.station === to);
  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;

  const fromStop = train.stops[fromIndex];
  const toStop = train.stops[toIndex];
  // Boarding after midnight would change the travel date, so we don't sell it
  if (fromStop.nextDay) return null;

  const departs = toMinutes(fromStop);
  const arrives = toMinutes(toStop);

  return {
    fromIndex,
    toIndex,
    departs,
    arrives,
    duration: arrives - departs,
    km: toStop.km - fromStop.km,
    arrivesNextDay: Boolean(toStop.nextDay),
  };
}

export function runsOn(train, date) {
  return train.offDay !== getWeekday(date);
}

// Has the train already left the passenger's boarding station?
export function hasDeparted(journey, date, now = getDhakaNow()) {
  return date < now.date || (date === now.date && journey.departs <= now.minutes);
}

// Two journeys on the same train share track when one starts before the other ends.
// DHK(0) -> APT(1) and APT(1) -> CTG(2) don't overlap: the seat is free again at APT.
export function journeysOverlap(a, b) {
  return a.fromIndex < b.toIndex && b.fromIndex < a.toIndex;
}

// Why can't this trip be booked? Returns a message, or null when it can.
export function getTripProblem({ train, from, to, date, classCode }, now = getDhakaNow()) {
  if (!train) return "We couldn't find that train.";
  if (!from || !to || !date || !classCode) return "This booking link is missing some details.";

  const journey = getJourney(train, from, to);
  if (!journey) {
    return `${train.name} doesn't run from ${getStation(from)?.name ?? from} to ${getStation(to)?.name ?? to}.`;
  }
  if (!getBookingDates(now).includes(date)) {
    return `You can book from today up to ${BOOKING_WINDOW_DAYS - 1} days ahead.`;
  }
  if (!runsOn(train, date)) return `${train.name} doesn't run on ${getWeekdayName(train.offDay)}s.`;
  if (hasDeparted(journey, date, now)) return `${train.name} has already left ${getStation(from).name}.`;
  if (!getSeatClass(classCode) || !train.coaches[classCode]) return `${train.name} doesn't have that seat class.`;

  return null;
}

// ----- 5. Money -----

// The fare for one seat: distance x the class rate, rounded UP to the next 5 taka
export function getFare(classCode, km) {
  const { rate } = getSeatClass(classCode);
  return Math.ceil((km * rate) / 5) * 5;
}

// The total for a booking: fare and service charge, per seat
export function getPrice(fare, seatCount) {
  return {
    fareTotal: fare * seatCount,
    serviceTotal: SERVICE_CHARGE * seatCount,
    total: (fare + SERVICE_CHARGE) * seatCount,
  };
}

// What you get back when you cancel: the fares minus the cancellation charge.
// The service charge is not refunded.
export function getRefund(fareTotal) {
  return Math.round(fareTotal * (1 - CANCEL_CHARGE_PERCENT / 100));
}

// 1250 -> "৳1,250". "en-IN" groups like Bangladesh does: 1,00,000
export function formatTaka(amount) {
  return `৳${amount.toLocaleString("en-IN")}`;
}

// ----- 6. Coaches and seats -----

// Bangladesh Railway names coaches with Bangla letters: KA, KHA, GA ...
const coachLetters = ["KA", "KHA", "GA", "GHA", "UMO", "CHA", "CHHA", "JA", "JHA", "NEO"];

// Shovan Chair coaches come first, then Snigdha, then AC: { S_CHAIR: 3, SNIGDHA: 2, AC_S: 1 }
// -> S_CHAIR: KA KHA GA, SNIGDHA: GHA UMO, AC_S: CHA
export function getCoaches(train, classCode) {
  let start = 0;
  for (const seatClass of seatClasses) {
    const count = train.coaches[seatClass.code] ?? 0;
    if (seatClass.code === classCode) return coachLetters.slice(start, start + count);
    start += count;
  }
  return [];
}

// Every seat id of one class on one train: ["KA-1", "KA-2", ... "GA-48"]
export function getSeatIds(train, classCode) {
  const { seatsPerCoach } = getSeatClass(classCode);
  return getCoaches(train, classCode).flatMap((coach) =>
    Array.from({ length: seatsPerCoach }, (_, index) => `${coach}-${index + 1}`),
  );
}

// Turns text into a number that is always the same for the same text
function hashText(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 1_000_003;
  return hash;
}

// We pretend some tickets were sold at station counters, so trains aren't empty.
// Between 20% and 65% of seats, different for every train and day, but stable on refresh.
function isSoldAtCounter(trainId, date, seatId) {
  const soldPercent = 20 + (hashText(`${trainId}|${date}`) % 46);
  return hashText(`${trainId}|${date}|${seatId}`) % 100 < soldPercent;
}

// Which seats can't be sold for this journey? Returns a Set of seat ids.
export function getTakenSeats({ train, classCode, date, journey, bookings }) {
  const taken = new Set();

  for (const seatId of getSeatIds(train, classCode)) {
    if (isSoldAtCounter(train.id, date, seatId)) taken.add(seatId);
  }

  for (const booking of bookings) {
    const sameTrip =
      booking.status === "confirmed" &&
      booking.trainId === train.id &&
      booking.date === date &&
      booking.classCode === classCode;
    if (!sameTrip) continue;

    const theirJourney = getJourney(train, booking.from, booking.to);
    if (journeysOverlap(journey, theirJourney)) {
      for (const seat of booking.seats) taken.add(seat.seatId);
    }
  }

  return taken;
}
