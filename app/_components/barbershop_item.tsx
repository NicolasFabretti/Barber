import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { StarIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface BarberShopItemProps {
  barberProps: Barbershop;
}

const BarbershopItem = ({ barberProps }: BarberShopItemProps) => {
  return (
    <>
      <Card className="h-full min-w-39.75 pt-0">
        <CardContent className="p-0">
          {/* IMAGEM */}
          <div className="relative h-39.75 w-full">
            <Image
              fill
              sizes="1000"
              className="rounded-2xl object-cover p-1"
              src={barberProps.imageUrl}
              alt={barberProps.name}
            />
            <Badge className="absolute top-2 left-2" variant="secondary">
              <StarIcon
                size={12}
                className="fill-primary text-primary"
              ></StarIcon>
              <p>5,0</p>
            </Badge>
          </div>
          {/* TEXTO */}
          <div className="px-2">
            <h3 className="truncate text-base font-semibold">
              {barberProps.name}
            </h3>
            <p className="truncate text-sm text-gray-400">
              {barberProps.address}
            </p>
            <Button variant="secondary" className="mt-3 w-full">
              reservar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BarbershopItem;
