import BarbershopItem from "../_components/barbershop_item";
import { Header } from "../_components/header";
import Search from "../_components/search";
import { db } from "../_lib/prisma";

interface BarbershopPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const BarbershopPage = async ({ searchParams }: BarbershopPageProps) => {
  const { search } = await searchParams;
  const findBarber = await db.barbershop.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  return (
    <div className="">
      <div className="flex flex-col gap-5">
        <Header />
        <Search />
      </div>

      <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
        resultado para &quot;{search || null}&quot;
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {findBarber.map((barbershop) => (
          <BarbershopItem key={barbershop.id} barberProps={barbershop} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopPage;
