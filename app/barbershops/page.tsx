import BarbershopItem from "../_components/barbershop_item";
import { Header } from "../_components/header";
import Search from "../_components/search";
import { db } from "../_lib/prisma";

interface BarbershopPageProps {
  searchParams: Promise<{
    title?: string;
    service?: string;
  }>;
}

const BarbershopPage = async ({ searchParams }: BarbershopPageProps) => {
  const { title } = await searchParams;
  const { service } = await searchParams;
  const dbBarber = await db.barbershop.findMany({
    where: {
      OR: [
        title
          ? {
              name: {
                contains: title,
                mode: "insensitive",
              },
            }
          : {},
        service
          ? {
              services: {
                some: {
                  name: {
                    contains: service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  });
  return (
    <div className="">
      <div className="flex flex-col gap-5">
        <Header />
        <Search />
      </div>

      <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
        resultado para &quot;{title || service || null}&quot;
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {dbBarber.map((barbershop) => (
          <BarbershopItem key={barbershop.id} barberProps={barbershop} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopPage;
