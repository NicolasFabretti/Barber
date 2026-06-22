import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import Image from "next/image";
import { db } from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop_item";
import { quickSearchOptions } from "./_constants/search";
import BookintItem from "./_components/booking-item";
import Search from "./_components/search";

export default async function Home() {
  const recommended = await db.barbershop.findMany({});
  const popularBarber = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });
  return (
    <div>
      {/*Header*/}
      <Header />
      <div className="py-5">
        <h2 className="text-xl font-bold">Olá, Nicolas!</h2>
        <p>Terça-feira, 09 de Junho</p>
      </div>

      {/*BUSCA*/}
      <div className="mb-8">
        <Search />
      </div>

      {/*BUSCA RAPIDA*/}
      <div className="flex gap-3 overflow-auto pb-2">
        {quickSearchOptions.map((option) => (
          <Button
            className="h-12 w-35 gap-2"
            variant="secondary"
            key={option.title}
          >
            <Image
              src={option.imageUrl}
              width={16}
              height={16}
              alt={option.title}
            />
            {option.title}
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

      {/* AGENDAMENTO */}
      <BookintItem />

      {/* RECOMENDADOS */}
      <h2 className="py-2">Recomendados</h2>
      <div className="flex gap-4 overflow-auto px-1 pb-2">
        {recommended.map((barber) => (
          <BarbershopItem key={barber.id} barberProps={barber} />
        ))}
      </div>

      {/* POPULARES */}
      <h2 className="py-2">Populares</h2>
      <div className="flex gap-4 overflow-auto px-1 pb-2">
        {popularBarber.map((barber) => (
          <BarbershopItem key={barber.id} barberProps={barber} />
        ))}
      </div>
    </div>
  );
}
