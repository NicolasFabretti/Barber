import PhoneItem from "@/app/_components/phone-item";
import ServiceComponent from "@/app/_components/service-item";
import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BarbershopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BarbershopPage({ params }: BarbershopPageProps) {
  const { id } = await params;

  const barbershop = await db.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });
  if (!barbershop) {
    return notFound();
  }

  return (
    <>
      <div className="relative">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          width={1000}
          height={100}
          className="h-80 w-full"
        />
        <Link href="/" className="absolute top-4 left-4">
          <Button variant="secondary">
            <ChevronLeftIcon />
          </Button>
        </Link>

        <Button className="absolute top-4 right-4" variant="secondary">
          <MenuIcon />
        </Button>
      </div>

      {/* NAME AND REVIEWS */}
      <div className="mt-5 flex flex-col gap-1 pl-5">
        <h1 className="mb-2 text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-center gap-2">
          <MapPinIcon className="text-primary" />
          <p>{barbershop.address}</p>
        </div>
        <div className="mb-5 flex gap-2">
          <StarIcon className="fill-primary text-primary" />
          <p>5,0 (499 avaliações)</p>
        </div>
      </div>

      {/*DESCRIPTION */}
      <div className="border-t border-b border-solid p-5">
        <h3 className="mb-2 text-sm font-bold text-gray-400">SOBRE NÓS</h3>
        <p>{barbershop.description}</p>
      </div>

      {/*SERVICE-ITEM*/}
      <div className="mt-5 mb-5 px-5">
        <h3 className="mb-3 text-sm font-bold text-gray-400">SERVIÇOS</h3>
        {barbershop.services.map((item) => (
          <ServiceComponent key={item.id} service={item} />
        ))}
      </div>
      {/* PHONE */}
      <h1 className="border-t px-5 pt-5">Contato</h1>
      <div>
        {barbershop.phones.map((phones) => (
          <PhoneItem key={phones} phone={phones} />
        ))}
      </div>
    </>
  );
}
