import { Barbershop, BarbershopService } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingSumaryProps {
  service: Pick<BarbershopService, "name" | "price">;
  barbershop: Pick<Barbershop, "name">;
  selectedDate: Date;
}

const BookingSumary = ({
  service,
  barbershop,
  selectedDate,
}: BookingSumaryProps) => {
  return (
    <Card className="mt-5">
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h2>{service.name}</h2>
          <h2>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </h2>
        </div>
        <div className="flex justify-between">
          <h2>Data</h2>
          <h2>{format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</h2>
        </div>
        <div className="flex justify-between">
          <h2>Horário</h2>
          <h2>{format(selectedDate, "HH:mm")}</h2>
        </div>
        <div className="flex justify-between">
          <h2>Barbearia</h2>
          <h2>{barbershop.name}</h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSumary;
