"use server";
// Server Actions for tickets: book and cancel.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { updateDb } from "@/lib/db";
import {
  MAX_SEATS,
  getFare,
  getJourney,
  getPaymentMethod,
  getPrice,
  getRefund,
  getSeatIds,
  getTakenSeats,
  getTrain,
  getTripProblem,
  hasDeparted,
} from "@/lib/rail";

const PHONE_PATTERN = /^01[3-9]\d{8}$/;
const PNR_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I: easy to read out loud

// "RG" + 8 random letters: RG4K7M2QXP
function makePnr() {
  const random = crypto.getRandomValues(new Uint8Array(8)); // 8 random numbers, 0-255
  return "RG" + Array.from(random, (number) => PNR_LETTERS[number % PNR_LETTERS.length]).join("");
}

function readText(formData, name) {
  return String(formData.get(name) ?? "").trim();
}

// Used with useActionState in BookingFlow
export async function bookTickets(prevState, formData) {
  const trip = {
    trainId: readText(formData, "trainId"),
    from: readText(formData, "from"),
    to: readText(formData, "to"),
    date: readText(formData, "date"),
    classCode: readText(formData, "classCode"),
  };

  const user = await getCurrentUser();
  if (!user) {
    const backTo = `/trains/${trip.trainId}?from=${trip.from}&to=${trip.to}&date=${trip.date}&class=${trip.classCode}`;
    redirect(`/login?next=${encodeURIComponent(backTo)}`);
  }

  // One hidden "seat" input per chosen seat. new Set() drops duplicates.
  const seatIds = [...new Set(formData.getAll("seat").map(String))];

  // values = what was typed, sent back so the form can refill itself after an error
  const values = {
    passengers: Object.fromEntries(
      seatIds.map((seatId) => [
        seatId,
        {
          name: readText(formData, `name-${seatId}`).replace(/\s+/g, " "),
          age: readText(formData, `age-${seatId}`),
        },
      ]),
    ),
    phone: readText(formData, "phone").replace(/[\s-]/g, ""),
    payment: readText(formData, "payment"),
  };

  // 1. Can this trip still be booked? The train may have left while you were typing.
  const train = getTrain(trip.trainId);
  const problem = getTripProblem({ train, ...trip });
  if (problem) return { error: problem, values };

  // 2. Between 1 and 4 seats, and every one a real seat of this class
  const realSeats = getSeatIds(train, trip.classCode);
  if (seatIds.length < 1 || seatIds.length > MAX_SEATS || !seatIds.every((id) => realSeats.includes(id))) {
    return { error: `Choose between 1 and ${MAX_SEATS} seats.`, values };
  }

  // 3. Check every field. errors.passengers is keyed by seat: { "KA-12": { age: "..." } }
  const errors = { passengers: {} };
  for (const [seatId, passenger] of Object.entries(values.passengers)) {
    const age = Number(passenger.age);
    const passengerErrors = {};
    if (passenger.name.length < 2) passengerErrors.name = "Enter the passenger's name.";
    if (!Number.isInteger(age) || age < 1 || age > 120) passengerErrors.age = "Enter an age from 1 to 120.";
    if (Object.keys(passengerErrors).length > 0) errors.passengers[seatId] = passengerErrors;
  }
  if (!PHONE_PATTERN.test(values.phone)) errors.phone = "Use an 11-digit mobile number, like 01712345678.";
  if (!getPaymentMethod(values.payment)) errors.payment = "Choose how you'll pay.";

  if (Object.keys(errors.passengers).length > 0 || errors.phone || errors.payment) {
    return { errors, values };
  }

  // 4. The price is worked out HERE. Never trust a price sent by the browser.
  const journey = getJourney(train, trip.from, trip.to);
  const fare = getFare(trip.classCode, journey.km);

  // 5. Check the seats and save the booking in ONE updateDb call, so nobody can grab
  //    the same seat between our check and our save
  const result = await updateDb((db) => {
    const taken = getTakenSeats({ train, classCode: trip.classCode, date: trip.date, journey, bookings: db.bookings });
    const lostSeats = seatIds.filter((seatId) => taken.has(seatId));
    if (lostSeats.length > 0) return { lostSeats };

    let pnr = makePnr();
    while (db.bookings.some((booking) => booking.pnr === pnr)) pnr = makePnr(); // unique, always

    const booking = {
      pnr,
      userId: user.id,
      ...trip, // trainId, from, to, date, classCode
      seats: seatIds.map((seatId) => ({
        seatId,
        name: values.passengers[seatId].name,
        age: Number(values.passengers[seatId].age),
      })),
      phone: values.phone,
      payment: values.payment,
      fare,
      ...getPrice(fare, seatIds.length), // fareTotal, serviceTotal, total
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    db.bookings.push(booking);
    return { booking };
  });

  if (result.lostSeats) {
    // Render the seat page again, so the seat map shows those seats as taken
    revalidatePath(`/trains/${trip.trainId}`);
    const list = result.lostSeats.join(", ");
    const isOne = result.lostSeats.length === 1;
    return {
      error: `Sorry, ${list} ${isOne ? "was" : "were"} just booked by someone else, so we took ${isOne ? "it" : "them"} out. Pick another seat, or pay for the rest.`,
      values,
    };
  }

  revalidatePath("/", "layout");
  redirect(`/tickets/${result.booking.pnr}?new=1`);
}

// The ticket page binds this to one ticket: cancelBooking.bind(null, pnr)
export async function cancelBooking(pnr) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/tickets/${pnr}`)}`);

  await updateDb((db) => {
    // Only the owner, only a confirmed ticket, only before the train leaves
    const booking = db.bookings.find((item) => item.pnr === pnr && item.userId === user.id);
    if (!booking || booking.status !== "confirmed") return;

    const journey = getJourney(getTrain(booking.trainId), booking.from, booking.to);
    if (hasDeparted(journey, booking.date)) return;

    booking.status = "cancelled";
    booking.refund = getRefund(booking.fareTotal);
    booking.cancelledAt = new Date().toISOString();
  });

  revalidatePath("/", "layout");
}
