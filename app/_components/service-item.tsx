import { Barbershop } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";

interface ServiceProps {
  service: Barbershop;
}

const ServiceComponent = ({ service }: ServiceProps) => {
  return (
    <div className="flex h-38 w-full rounded-2xl border bg-[#2020203f] p-3">
      {/*IMAGE */}
      <Image
        src={service.imageUrl}
        alt={service.name}
        width={120}
        height={10}
        className="rounded-2xl"
      />
      <div className="flex w-full min-w-0 flex-col justify-between pl-3">
        {/*NAME AND DESCRIPTION */}
        <div>
          <h1 className="font-bold">{service.name}</h1>
          <p className="text-gray-500">{service.description}</p>
        </div>

        {/*PRICE AND BOOK BUTTON */}
        <div className="flex justify-between">
          <h1>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </h1>
          <Button>Reservar</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceComponent;
