import { SearchIcon } from "lucide-react";
import { Header } from "./_components/header";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-8">
        <h2 className="text-xl font-bold">Olá, Nicolas!</h2>
        <p>Terça-feira, 09 de Junho</p>
      </div>
      {/* */}
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
      <h1 className="px-8 py-5">AGENDAMENTOS</h1>
    </div>
  );
}
