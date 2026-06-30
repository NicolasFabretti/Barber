import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true;
        };
      };
    };
  }>;
}

// TODO receber agendamento como prop
const BookingItem = ({ booking }: BookingItemProps) => {
  const isConfirmed = isFuture(booking.date);
  return (
    <>
      <Card className="min-w-[90%] rounded-sm">
        <CardContent className="flex justify-between px-8">
          {/* ESQUERDA*/}
          <div className="flex flex-col justify-center gap-2">
            <div>
              <Badge
                className="mb-2 w-fit"
                variant={isConfirmed ? "default" : "secondary"}
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h3>{booking.service.name}</h3>
            </div>

            <div>
              <Avatar className="flex h-6 w-6 items-center">
                <AvatarImage src={booking.service.barbershop.imageUrl} />
                <p className="ml-2 text-sm whitespace-nowrap">
                  {booking.service.barbershop.name}
                </p>
              </Avatar>
            </div>
          </div>
          {/* DIREITA*/}
          <div className="flex flex-col items-center justify-center border-l border-solid pl-5">
            <p className="text-sm capitalize">
              {format(booking.date, "MMMM", { locale: ptBR })}
            </p>
            <p>{format(booking.date, "dd", { locale: ptBR })}</p>
            <p>{format(booking.date, "HH:mm", { locale: ptBR })}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookingItem;
