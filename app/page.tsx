import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import Image from "next/image";
import { db } from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop_item";
import { quickSearchOptions } from "./_constants/search";
import BookintItem from "./_components/booking-item";
import Search from "./_components/search";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import getConfirmedBookings from "./_data/get-confirmed-bookings";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const recommended = await db.barbershop.findMany({});
  const popularBarber = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });

  const confimedBookings = await getConfirmedBookings();

  return (
    <div>
      {/*Header*/}
      <Header />
      <div className="py-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "Bem vindo"}
        </h2>
        <p>{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
      </div>

      {/*BUSCA*/}
      <div className="mb-8">
        <Search />
      </div>

      {/*BUSCA RAPIDA*/}
      <div className="overflow-x-none flex gap-3 overflow-hidden pb-2">
        {quickSearchOptions.map((option) => (
          <Button
            className="h-12 w-35 gap-2"
            variant="secondary"
            key={option.title}
            asChild
          >
            <Link href={`barbershops?title=${option.title}`}>
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.title}
              />
              {option.title}
            </Link>
          </Button>
        ))}
      </div>

      {/*BANNER*/}
      <div className="mt-5">
        <Image
          src="/banner.png"
          alt="Banner"
          width={600}
          height={10}
          className="mx-auto w-full rounded-xl"
        />
      </div>
      <h1 className="text-gray-400">
        {confimedBookings.length > 0 && <div>Agendamentos</div>}
      </h1>
      <div
        className="flex gap-5 overflow-x-auto scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* AGENDAMENTO */}
        {confimedBookings.map((booking) => (
          <BookintItem
            key={booking.id}
            booking={JSON.parse(JSON.stringify(booking))}
          />
        ))}
      </div>

      {/* RECOMENDADOS */}
      <h2 className="py-2">Recomendados</h2>
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {recommended.map((barber) => (
          <BarbershopItem key={barber.id} barberProps={barber} />
        ))}
      </div>

      {/* POPULARES */}
      <h2 className="py-2">Populares</h2>
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {popularBarber.map((barber) => (
          <BarbershopItem key={barber.id} barberProps={barber} />
        ))}
      </div>
    </div>
  );
}
