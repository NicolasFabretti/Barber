"use server";

import { endOfDay, startOfDay } from "date-fns";
import { db } from "../_lib/prisma";
import { expireStaleBookings } from "./expire-stale-bookings";

interface getBookingProps {
  serviceId: string;
  date: Date;
}

export const getBooking = async ({ date }: getBookingProps) => {
  await expireStaleBookings();

  const bookings = await db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
      status: {
        not: "REJECTED",
      },
    },
  });
  return bookings;
};
