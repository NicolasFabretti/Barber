"use client";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import PhoneItem from "./phone-item";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteBooking } from "../_actions/delete-booking";
import { toast } from "sonner";
import { useState } from "react";

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
  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id);
      setIsSheetOpen(false);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cencelar reserva. Tente novamente.");
    }
  };

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleSheetClose = (isOpen: boolean) => {
    setIsSheetOpen(isOpen);
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetTrigger>
          <Card className="min-w-[90%] cursor-pointer rounded-sm">
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
        </SheetTrigger>
        <SheetContent className="bg-[#080808] px-5">
          <SheetTitle className="border-b py-10">
            Informações da reserva
          </SheetTitle>
          <div className="relative flex items-end justify-center">
            <Image
              src="/map1.png"
              width={2000}
              height={20}
              alt="Map image"
              className="object-cover"
            />

            <Card className="absolute z-50 mb-5 w-[90%]">
              <CardContent className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={booking.service.barbershop.imageUrl}
                  ></AvatarImage>
                </Avatar>
                <div>
                  <h1 className="text-xl">{booking.service.barbershop.name}</h1>
                  <p className="text-xs">
                    {booking.service.barbershop.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          {isConfirmed ? (
            <Badge>Confirmado</Badge>
          ) : (
            <Badge variant="secondary">Finalizado</Badge>
          )}
          <Card>
            <CardContent className="flex h-30 flex-col justify-between">
              <div className="flex justify-between font-bold">
                <h1>{booking.service.name}</h1>
                <h1>
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h1>
              </div>
              <div className="flex justify-between text-gray-400">
                <h1>Data</h1>
                <h1>
                  {format(booking.date, "dd 'de' MMMM", { locale: ptBR })}
                </h1>
              </div>
              <div className="flex justify-between text-gray-400">
                <h1>Horário</h1>
                <h1>{format(booking.date, "HH:mm")}</h1>
              </div>
              <div className="flex justify-between text-gray-400">
                <h1>Barbearia</h1>
                <h1>{booking.service.barbershop.name}</h1>
              </div>
            </CardContent>
          </Card>
          {booking.service.barbershop.phones.map((phone) => (
            <PhoneItem key={phone} phone={phone} />
          ))}
          <SheetFooter>
            <div className="flex items-center justify-center gap-3">
              <SheetClose asChild>
                <Button variant="outline" className="w-[40%] cursor-pointer">
                  Voltar
                </Button>
              </SheetClose>
              {isConfirmed && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-[40%] cursor-pointer bg-red-600"
                    >
                      Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#080808]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja cancelar esse agendamento?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction
                      onClick={handleCancelBooking}
                      className="cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                      Confirmar
                    </AlertDialogAction>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancelar
                    </AlertDialogCancel>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BookingItem;
