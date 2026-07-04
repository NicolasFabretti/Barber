import { getServerSession } from "next-auth";
import { Header } from "../_components/header";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import BookingItem from "../_components/booking-item";

const Bookings = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return notFound();
  }

  const confirmedBookings = await db.booking.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session.user as any).id,
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const concluedBookings = await db.booking.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session.user as any).id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  });
  return (
    <>
      <Header />
      <h1 className="my-3 text-xl font-bold">Agendamentos</h1>
      {confirmedBookings.length === 0 && concluedBookings.length === 0 && (
        <h1>Você ainda não possui agendamentos.</h1>
      )}
      {confirmedBookings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h1 className="mb-2 text-sm text-gray-400">CONFIRMADOS</h1>
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      )}
      {concluedBookings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h1 className="mt-5 mb-2 text-sm text-gray-400">FINALIZADOS</h1>
          {concluedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={JSON.parse(JSON.stringify(booking))}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Bookings;
