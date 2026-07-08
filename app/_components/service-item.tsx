"use client";
import { Barbershop, BarbershopService, Booking } from "@prisma/client";
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
import { useEffect, useMemo, useState } from "react";
import { TIME_LIST } from "../_constants/timeList";
import { isPast, isToday, set } from "date-fns";
import { createBooking } from "../_actions/create-booking";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getBooking } from "../_actions/get-booking";
import { Dialog, DialogContent } from "./ui/dialog";
import SignDialog from "./sign-in-dialog";
import BookingSumary from "./booking-sumary";
import { useRouter } from "next/navigation";
import createPayment from "../_actions/create-payment";
import getBookingStatus from "../_actions/get-booking-status";

interface ServiceComponentProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name">;
}

const ServiceComponent = ({ service, barbershop }: ServiceComponentProps) => {
  const { data } = useSession(); // Chamando o user logado em CALLBACK em route.ts em nextAuth
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectetime] = useState<string | undefined>(
    undefined,
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [BookingSheetOpen, setBookingSheetOpen] = useState(false);
  const [openDialogSignin, setOpenDialogSignin] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    qrCode?: string;
    qrCodeBase64?: string;
  } | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectetime(time);
  };

  interface GetTimeListProps {
    bookings: Booking[];
    selectedDay: Date;
  }

  const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
    return TIME_LIST.filter((time) => {
      const hour = Number(time.split(":")[0]);
      const minutes = Number(time.split(":")[1]);

      const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }));
      if (timeIsOnThePast && isToday(selectedDay)) {
        return false;
      }

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

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined);
    setSelectetime(undefined);
    setDayBookings([]);
    setPaymentData(null);
    setBookingSheetOpen(false);
    setBookingId(null);
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

  useEffect(() => {
    if (!paymentData || !bookingId) return;

    const interval = setInterval(async () => {
      const status = await getBookingStatus({ bookingId });

      if (status === "APPROVED") {
        clearInterval(interval);
        toast.success("Reserva agendada com sucesso!", {
          action: {
            label: "Ver agendamentos",
            onClick: () => router.push("/bookings"),
          },
        });
        handleBookingSheetOpenChange();
      }

      if (status === "REJECTED") {
        clearInterval(interval);
        toast.error("Pagamento não aprovado. Tente novamente.");
      }
    }, 3000); // checa a cada 3 segundos

    return () => clearInterval(interval);
  }, [paymentData, bookingId, router]);

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return;
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    });
  }, [selectedDay, selectedTime]);

  //CRIAR BOOKING
  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return;

      const booking = await createBooking({
        serviceId: service.id,
        date: selectedDate,
      });

      setBookingId(booking.id); // guarda pro polling usar

      const result = await createPayment({ bookingId: booking.id });
      setPaymentData(result);
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

  const timeList = useMemo(() => {
    if (!selectedDay) return [];
    return getTimeList({ bookings: dayBookings, selectedDay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayBookings, selectedDay]);

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
                <SheetTitle>
                  {paymentData ? "Pagamento pix" : "Fazer reserva"}
                </SheetTitle>
              </SheetHeader>
              {!paymentData ? (
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
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
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
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDate && (
                    <BookingSumary
                      barbershop={barbershop}
                      service={service}
                      selectedDate={selectedDate}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-5">
                  {paymentData.qrCodeBase64 && (
                    <Image
                      src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                      alt="QR Code Pix"
                      width={220}
                      height={220}
                    />
                  )}

                  {paymentData.qrCode && (
                    <div className="w-full">
                      <p className="mb-1 text-xs text-gray-400">
                        Pix copia e cola:
                      </p>
                      <textarea
                        readOnly
                        value={paymentData.qrCode}
                        className="w-full rounded-md border border-gray-700 bg-[#111] p-2 text-xs"
                        rows={4}
                      />
                      <Button
                        variant="secondary"
                        className="mt-2 w-full cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentData.qrCode!);
                          toast.success("Código copiado!");
                        }}
                      >
                        Copiar código
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <SheetFooter>
                {!paymentData && (
                  <Button
                    disabled={!selectedDay || !selectedTime}
                    onClick={handleCreateBooking}
                    className="cursor-pointer"
                  >
                    Confirmar
                  </Button>
                )}
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
