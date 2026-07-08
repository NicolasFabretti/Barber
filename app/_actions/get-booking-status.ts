// app/_actions/get-booking-status.ts
"use server";
import { db } from "../_lib/prisma";

interface GetBookingStatusProps {
  bookingId: string;
}

const getBookingStatus = async ({ bookingId }: GetBookingStatusProps) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });

  return booking?.status ?? null;
};

export default getBookingStatus;
