import { SearchIcon } from "lucide-react";
import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import { Badge } from "./_components/ui/badge";
import Image from "next/image";
import { Card, CardContent } from "./_components/ui/card";
import { Avatar, AvatarImage } from "./_components/ui/avatar";

export default function Home() {
  return (
    <div>
      {/*Header*/}
      <Header />
      <div className="p-8">
        <h2 className="text-xl font-bold">Olá, Nicolas!</h2>
        <p>Terça-feira, 09 de Junho</p>
      </div>

      {/*BUSCA*/}
      <div className="mx-auto flex h-20 justify-between gap-2 px-8 pb-7">
        <Input placeholder="busque aqui" className="h-full" />
        <Button className="h-full w-15">
          <SearchIcon />
        </Button>
      </div>

      {/*Buttons*/}
      <div className="mx-auto flex h-14 justify-between gap-5 px-8">
        <button className="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-[#0C0E12] px-4">
          <Image
            src="/cut.png"
            alt="barba"
            width={100}
            height={1}
            className="h-4 w-5"
          />
          Cabelo
        </button>
        <button className="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-[#0C0E12] px-4">
          <Image
            src="/barba.png"
            alt="barba"
            width={100}
            height={1}
            className="h-2 w-5"
          />
          Barba
        </button>
        <button className="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-[#0C0E12] px-5">
          <Image
            src="/acabamento.png"
            alt="acabamento"
            width={100}
            height={1}
            className="h-4 w-5"
          />
          Acabamento
        </button>
      </div>
      <br></br>

      {/*BANNER*/}
      <div>
        <Image
          src="/banner.png"
          alt="Banner"
          width={600}
          height={10}
          className="mx-auto w-full rounded-xl px-8"
        />
      </div>

      {/* AGENDAMENTO */}
      <h1 className="px-8 py-5">AGENDAMENTOS</h1>
      <Card>
        <CardContent className="flex justify-between px-8">
          {/* ESQUERDA*/}
          <div className="flex flex-col justify-center gap-2">
            <div>
              <Badge className="w-fit">Confirmado</Badge>
              <h3>Corte de cabelo</h3>
            </div>

            <div className="">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" />
                <p className="text-sm whitespace-nowrap">Barbearia FSW</p>
              </Avatar>
            </div>
          </div>
          {/* DIREITA*/}
          <div className="flex flex-col items-center justify-center border-l border-solid pl-5">
            <p>Junho</p>
            <p>5</p>
            <p>2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
