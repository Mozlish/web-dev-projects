// Starting data for RailGo: one demo user and three sample tickets.
// lib/db.js copies this into data/db.json the first time the app runs. Delete db.json to start over.
import {
  addDays,
  getDhakaNow,
  getFare,
  getJourney,
  getPrice,
  getRefund,
  getSeatIds,
  getTakenSeats,
  getTrain,
} from "@/lib/rail";

const demoUser = {
  id: "u1",
  name: "Rafi Ahmed",
  email: "demo@railgo.test",
  phone: "01712345678",
  // The password "railgo123", hashed with hashPassword() from lib/auth.js.
  // A hash can't be turned back into the password, so it's safe to keep here.
  passwordHash:
    "f6c7696e17c58c8361a1f59a78528a55:af8707f4d560d513541c445ebd085aeba15193abbd2646767b26861989362ec392b82b884282460c14dfef42cf6097958c163d45d485831009ba2225e7243f39",
  createdAt: "2026-01-15T09:30:00.000Z",
};

// Turns "30 hours ago" into a date string, so the seed always looks recent
function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

// Builds a booking with the same rules as a real one.
// daysFromToday: 2 = the day after tomorrow, -5 = five days ago
function makeBooking({ pnr, trainId, from, to, daysFromToday, classCode, passengers, payment, hours, cancelled }) {
  const train = getTrain(trainId);
  const journey = getJourney(train, from, to);
  const date = addDays(getDhakaNow().date, daysFromToday);

  // Take the first seats that weren't sold at the counter
  const taken = getTakenSeats({ train, classCode, date, journey, bookings: [] });
  const freeSeats = getSeatIds(train, classCode).filter((seatId) => !taken.has(seatId));

  const fare = getFare(classCode, journey.km);
  const booking = {
    pnr,
    userId: demoUser.id,
    trainId,
    from,
    to,
    date,
    classCode,
    seats: passengers.map((passenger, index) => ({ seatId: freeSeats[index], ...passenger })),
    phone: demoUser.phone,
    payment,
    fare,
    ...getPrice(fare, passengers.length), // fareTotal, serviceTotal, total
    status: "confirmed",
    createdAt: hoursAgo(hours),
  };

  if (cancelled) {
    booking.status = "cancelled";
    booking.refund = getRefund(booking.fareTotal);
    booking.cancelledAt = hoursAgo(hours - 2);
  }

  return booking;
}

export function createSeedData() {
  return {
    users: [demoUser],
    bookings: [
      makeBooking({
        pnr: "RG4K7M2QXP",
        trainId: "704",
        from: "DHK",
        to: "CTG",
        daysFromToday: 2,
        classCode: "S_CHAIR",
        passengers: [
          { name: "Rafi Ahmed", age: 29 },
          { name: "Nusrat Jahan", age: 27 },
        ],
        payment: "bkash",
        hours: 20,
      }),
      makeBooking({
        pnr: "RG9T3H6WBN",
        trainId: "703",
        from: "CTG",
        to: "DHK",
        daysFromToday: -5,
        classCode: "SNIGDHA",
        passengers: [{ name: "Rafi Ahmed", age: 29 }],
        payment: "card",
        hours: 200,
      }),
      makeBooking({
        pnr: "RG2C8V5JLE",
        trainId: "739",
        from: "DHK",
        to: "SYL",
        daysFromToday: 6,
        classCode: "AC_S",
        passengers: [{ name: "Rafi Ahmed", age: 29 }],
        payment: "nagad",
        hours: 30,
        cancelled: true,
      }),
    ],
  };
}
