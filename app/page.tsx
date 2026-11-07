import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import BarbershopItem from "./_components/barbershop_item";
import BookintItem from "./_components/booking-item";
import Search from "./_components/search";
import { quickSearchOptions } from "./_constants/search";
import { db } from "./_lib/prisma";
import { authOptions } from "./_lib/auth";
import getConfirmedBookings from "./_data/get-confirmed-bookings";

// Mobile e tablet: carrossel horizontal. Desktop: grade.
const rowBase =
  "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden";
const shopsRow = `${rowBase} lg:grid-cols-4`;
const bookingsRow = `${rowBase} lg:grid-cols-3`;

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b pb-3">
      <h2 className="text-base font-semibold tracking-tight sm:text-lg">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver todos
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  const recommended = await db.barbershop.findMany({ take: 8 });
  const popular = await db.barbershop.findMany({
    orderBy: { name: "desc" },
    take: 8,
  });
  const confirmedBookings = await getConfirmedBookings();

  return (
    <main className="min-h-screen w-full overflow-x-clip">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        {/* Saudação e busca */}
        <section className="grid gap-5 pt-6 pb-6 sm:pt-8 lg:grid-cols-2 lg:items-end lg:gap-12 lg:pb-8">
          <div>
            <p className="text-muted-foreground text-sm capitalize">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Olá, {session?.user?.name ?? "Bem-vindo"}
            </h1>
          </div>
          <Search />
        </section>

        <div className="space-y-10 lg:space-y-14">
          {/* Categorias */}
          <section>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
              {quickSearchOptions.map((option) => (
                <Button
                  key={option.title}
                  className="h-10 shrink-0 gap-2 rounded-md px-4"
                  variant="secondary"
                  asChild
                >
                  <Link
                    href={`/barbershops?title=${encodeURIComponent(option.title)}`}
                  >
                    <Image
                      src={option.imageUrl}
                      width={16}
                      height={16}
                      alt=""
                    />
                    <span>{option.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </section>

          {/* Banner */}
          <section>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg border sm:aspect-[16/5] lg:aspect-[16/4.5]">
              <Image
                src="/banner.png"
                alt="Conheça nossas barbearias"
                fill
                priority
                sizes="(min-width: 1280px) 1216px, (min-width: 640px) 90vw, 100vw"
                className="object-cover"
              />
            </div>
          </section>

          {/* Agendamentos */}
          {confirmedBookings.length > 0 && (
            <section className="min-w-0">
              <SectionHeader title="Seus agendamentos" />
              <div className={bookingsRow}>
                {confirmedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="w-[85%] shrink-0 snap-start sm:w-[55%] md:w-[45%] lg:w-auto"
                  >
                    <BookintItem
                      booking={JSON.parse(JSON.stringify(booking))}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recomendados */}
          <section className="min-w-0">
            <SectionHeader title="Recomendados" href="/barbershops" />
            <div className={shopsRow}>
              {recommended.map((barber) => (
                <div
                  key={barber.id}
                  className="w-[70%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto"
                >
                  <BarbershopItem barberProps={barber} />
                </div>
              ))}
            </div>
          </section>

          {/* Populares */}
          <section className="min-w-0">
            <SectionHeader title="Populares" href="/barbershops" />
            <div className={shopsRow}>
              {popular.map((barber) => (
                <div
                  key={barber.id}
                  className="w-[70%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto"
                >
                  <BarbershopItem barberProps={barber} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
