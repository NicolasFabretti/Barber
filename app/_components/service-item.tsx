"use client";
import { Barbershop, BarbershopService, Booking, User } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";

import { TIME_LIST } from "../_constants/timeList";
import { Card, CardContent } from "./ui/card";
import { format, set } from "date-fns";
import { createBooking } from "../_actions/create-booking";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getBooking } from "../_actions/get-booking";
import { Dialog, DialogContent } from "./ui/dialog";
import SignDialog from "./sign-in-dialog";

interface ServiceComponentProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name">;
}

const ServiceComponent = ({ service, barbershop }: ServiceComponentProps) => {
  const { data } = useSession(); // Chamando o user logado em CALLBACK em route.ts em nextAuth

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectetime] = useState<string | undefined>(
    undefined,
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [BookingSheetOpen, setBookingSheetOpen] = useState(false);
  const [openDialogSignin, setOpenDialogSignin] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectetime(time);
  };

  const getTimeList = (bookings: Booking[]) => {
    return TIME_LIST.filter((time) => {
      const hour = Number(time.split(":")[0]);
      const minutes = Number(time.split(":")[1]);

      const hasBookingOnCurrentTime = bookings.some(
        (booking) =>
          booking.date.getHours() === hour &&
          booking.date.getMinutes() === minutes,
      );
      if (hasBookingOnCurrentTime) {
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return;
      const bookings = await getBooking({
        date: selectedDay,
        serviceId: service.id,
      });
      setDayBookings(bookings);
    };
    fetch();
  }, [selectedDay, service.id]);

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined);
    setSelectetime(undefined);
    setDayBookings([]);
    setBookingSheetOpen(false);
  };

  console.log("dias agendados", dayBookings);

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return;
      const hour = Number(selectedTime.split(":")[0]); // ["09"]
      const minute = Number(selectedTime.split(":")[1]); // ["30"]
      const newDate = set(selectedDay, { minutes: minute, hours: hour });

      await createBooking({
        serviceId: service.id,
        userId: (data?.user as User).id,
        date: newDate,
      });
      handleBookingSheetOpenChange();
      toast.success("Reserva criada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("erro ao criar a reserva!");
    }
  };

  const handleBookingclick = () => {
    if (data?.user) {
      return setBookingSheetOpen(true);
    }
    return setOpenDialogSignin(true);
  };

  return (
    <div className="mb-5 flex h-38 w-full rounded-2xl border bg-[#2020203f] p-3">
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
        <div className="flex items-center justify-between">
          <h1>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </h1>
          {/*BOOK BUTTON*/}
          <Sheet
            open={BookingSheetOpen}
            onOpenChange={handleBookingSheetOpenChange}
          >
            <Button
              variant="secondary"
              className="cursor-pointer"
              size="lg"
              onClick={handleBookingclick}
            >
              Reservar
            </Button>
            <SheetContent className="bg-[#080808] px-5">
              <SheetHeader>
                <SheetTitle>Fazer reserva</SheetTitle>
              </SheetHeader>
              <div className="py-5">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={selectedDay}
                  onSelect={handleDateSelect}
                  className="w-full border-b border-solid"
                  disabled={{ before: new Date() }}
                ></Calendar>
                {selectedDay && (
                  <div className="overflow-x-none flex gap-3 overflow-hidden">
                    {getTimeList(dayBookings).map((time) => (
                      <Button
                        variant={
                          selectedTime === time ? "default" : "secondary"
                        }
                        className="mt-5 cursor-pointer rounded-2xl"
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedDay && selectedTime && (
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
                        <h2>
                          {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
                        </h2>
                      </div>
                      <div className="flex justify-between">
                        <h2>Horário</h2>
                        <h2>{selectedTime}</h2>
                      </div>
                      <div className="flex justify-between">
                        <h2>Barbearia</h2>
                        <h2>{barbershop.name}</h2>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <SheetFooter>
                <Button
                  disabled={!selectedDay || !selectedTime}
                  onClick={handleCreateBooking}
                  className="cursor-pointer"
                >
                  Confirmar
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Dialog
        open={openDialogSignin}
        onOpenChange={(open) => setOpenDialogSignin(open)}
      >
        <DialogContent>
          <SignDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceComponent;
