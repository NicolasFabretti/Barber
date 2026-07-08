"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface CreateBookingParams {
  serviceId: string;
  date: Date;
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const booking = await db.booking.create({
    data: {
      ...params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session.user as any).id,
    },
  });

  revalidatePath("/barbershops/[id]");
  revalidatePath("/booking");

  return booking;
};
