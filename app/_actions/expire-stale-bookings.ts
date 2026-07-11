// app/_actions/expire-stale-bookings.ts
"use server";
import { db } from "../_lib/prisma";

export const expireStaleBookings = async () => {
  await db.booking.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: new Date() }, // já passou do prazo
    },
    data: { status: "REJECTED" },
  });
};
