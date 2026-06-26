"use server";

import { endOfDay, startOfDay } from "date-fns";
import { db } from "../_lib/prisma";

interface getBookingProps {
  serviceId: string;
  date: Date;
}

export const getBooking = async ({ date }: getBookingProps) => {
  const bookings = await db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });
  return bookings;
};
