import { SearchIcon } from "lucide-react";
import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import Image from "next/image";
import { Card, CardContent } from "./_components/ui/card";
import { db } from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop_item";
import { quickSearchOptions } from "./_constants/search";
import BookintItem from "./_components/booking-item";

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
      <div className="p-8">
        <h2 className="text-xl font-bold">Olá, Nicolas!</h2>
        <p>Terça-feira, 09 de Junho</p>
      </div>

      {/*BUSCA*/}
      <div className="mx-auto flex h-20 justify-between gap-2 px-8 pb-7">
        <Input placeholder="busque aqui" className="h-full" />
        <Button className="h-full w-15">
          <SearchIcon />
        </Button>
      </div>

      {/*BUSCA RAPIDA*/}
      <div className="mx-8 flex gap-3 overflow-auto pb-2">
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
          className="mx-auto w-full rounded-xl px-8"
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

      {/* FOOTER */}
      <footer className="mt-5">
        <Card className="px-3 py-5">
          <CardContent>
            <p className="text-gray-400">@2023 Copyright FSW Barber</p>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
