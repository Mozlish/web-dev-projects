// Read helpers for pages. Each one returns exactly what its page needs.
import "server-only";
import { connection } from "next/server";
import { seatClasses, trains } from "@/data/timetable";
import { readDb } from "./db";
import {
  formatDate,
  getCoaches,
  getDhakaNow,
  getFare,
  getJourney,
  getPaymentMethod,
  getRefund,
  getSeatClass,
  getSeatIds,
  getStation,
  getTakenSeats,
  getTrain,
  getTripProblem,
  getWeekdayName,
  hasDeparted,
  runsOn,
} from "./rail";

// connection() = "render on every request": seats and the clock change all the time
async function getDb() {
  await connection();
  return readDb();
}

// ----- Page 2: search results -----

// Every train that runs from -> to, with fares and free seats for each class
export async function searchTrains({ from, to, date }) {
  const db = await getDb();
  const now = getDhakaNow();
  const results = [];

  for (const train of trains) {
    const journey = getJourney(train, from, to);
    if (!journey) continue; // this train doesn't serve the route

    let status = "available";
    if (!runsOn(train, date)) status = "off-day";
    else if (hasDeparted(journey, date, now)) status = "departed";

    const classes = seatClasses
      .filter((seatClass) => train.coaches[seatClass.code])
      .map((seatClass) => {
        const totalSeats = getSeatIds(train, seatClass.code).length;
        const taken = getTakenSeats({ train, classCode: seatClass.code, date, journey, bookings: db.bookings });
        return {
          code: seatClass.code,
          name: seatClass.name,
          fare: getFare(seatClass.code, journey.km),
          seatsLeft: totalSeats - taken.size,
        };
      });

    results.push({
      id: train.id,
      name: train.name,
      offDayName: train.offDay === null ? null : getWeekdayName(train.offDay),
      status,
      ...journey, // departs, arrives, duration, km, arrivesNextDay ...
      classes,
    });
  }

  return results.toSorted((a, b) => a.departs - b.departs);
}

// ----- Page 3: the seat plan -----

// Everything the booking screen needs, or { problem } when this trip can't be booked
export async function getSeatPlan({ trainId, from, to, date, classCode }) {
  const db = await getDb();
  const train = getTrain(trainId);

  const problem = getTripProblem({ train, from, to, date, classCode });
  if (problem) return { problem };

  const journey = getJourney(train, from, to);
  const seatClass = getSeatClass(classCode);
  const taken = getTakenSeats({ train, classCode, date, journey, bookings: db.bookings });

  return {
    trip: {
      trainId: train.id,
      trainName: train.name,
      from: getStation(from),
      to: getStation(to),
      date,
      // Formatted HERE: a Client Component formatting dates itself could print it slightly
      // differently in the browser than on the server, and React would warn about the mismatch
      dateLabel: formatDate(date, "long"),
      classCode,
      className: seatClass.name,
      departs: journey.departs,
      arrives: journey.arrives,
      duration: journey.duration,
      arrivesNextDay: journey.arrivesNextDay,
      fare: getFare(classCode, journey.km),
    },
    coaches: getCoaches(train, classCode).map((coach) => ({
      name: coach,
      seats: Array.from({ length: seatClass.seatsPerCoach }, (_, index) => {
        const id = `${coach}-${index + 1}`;
        return { id, number: index + 1, isTaken: taken.has(id) };
      }),
    })),
  };
}

// ----- Pages 4 and 5: tickets -----

// Adds what a ticket shows: train name, stations, times, and whether it can still be cancelled
function describeBooking(booking, now) {
  const train = getTrain(booking.trainId);
  const journey = getJourney(train, booking.from, booking.to);
  const departed = hasDeparted(journey, booking.date, now);

  return {
    ...booking,
    trainName: train.name,
    fromStation: getStation(booking.from),
    toStation: getStation(booking.to),
    className: getSeatClass(booking.classCode).name,
    paymentName: getPaymentMethod(booking.payment).name,
    departs: journey.departs,
    arrives: journey.arrives,
    duration: journey.duration,
    arrivesNextDay: journey.arrivesNextDay,
    hasDeparted: departed,
    canCancel: booking.status === "confirmed" && !departed,
    refundIfCancelled: getRefund(booking.fareTotal),
  };
}

// Earliest trip first
function byTravelTime(a, b) {
  return a.date.localeCompare(b.date) || a.departs - b.departs;
}

// My tickets, split into the three tabs
export async function getMyBookings(userId) {
  const db = await getDb();
  const now = getDhakaNow();

  const mine = db.bookings
    .filter((booking) => booking.userId === userId)
    .map((booking) => describeBooking(booking, now));

  return {
    upcoming: mine.filter((b) => b.status === "confirmed" && !b.hasDeparted).toSorted(byTravelTime),
    past: mine.filter((b) => b.status === "confirmed" && b.hasDeparted).toSorted((a, b) => byTravelTime(b, a)),
    cancelled: mine.filter((b) => b.status === "cancelled").toSorted((a, b) => byTravelTime(b, a)),
  };
}

// One ticket, ONLY for its owner. Anyone else gets null, as if it didn't exist.
export async function getBooking(pnr, userId) {
  const db = await getDb();
  const booking = db.bookings.find((item) => item.pnr === pnr && item.userId === userId);
  return booking ? describeBooking(booking, getDhakaNow()) : null;
}
