import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { SheetContent, SheetHeader } from "./ui/sheet";
import { quickSearchOptions } from "../_constants/search";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const SideBar = () => {
  return (
    <SheetContent className="bg-[#080808] px-5">
      <SheetHeader className="pl-0 font-bold">Menu</SheetHeader>

      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-lg font-bold">Olá, faça seu login!</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon">
              <LogInIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[80%] bg-[#141414]">
            <DialogHeader className="flex items-center">
              <DialogTitle>Faça Login na plataforma</DialogTitle>
              <DialogDescription>
                Conecte-se usando sua conta do Google
              </DialogDescription>
              <Button
                variant="secondary"
                className="flex h-10 w-full cursor-pointer gap-2"
              >
                <Image
                  src="/vector.svg"
                  width={18}
                  height={18}
                  alt="Google Image"
                />
                <Image
                  src="/Button.svg"
                  width={50}
                  height={18}
                  alt="Google Image"
                  className="mt-0.5"
                />
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Avatar 
        <Avatar size="lg">
          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </Avatar>
        <div>
          <h1 className="text-lg font-bold">Nicolas Fabretti</h1>
          <p className="text-xs">emailteste@gmail.com</p>
        </div>
        */}
      </div>

      {/* Home and Booking button */}
      <div className="flex flex-col gap-1 border-b border-solid">
        <Button className="justify-start px-5" asChild>
          <Link href="/">
            <HomeIcon />
            Início
          </Link>
        </Button>

        <Button className="mb-5 justify-start px-5" variant="ghost">
          <CalendarIcon />
          Agendamentos
        </Button>
      </div>

      {/* QuickSearch Buttons */}
      <div className="flex flex-col items-start gap-5 border-b border-solid pb-5">
        {quickSearchOptions.map((items) => (
          <Button key={items.title} variant="ghost" className="">
            <Image
              height={18}
              width={18}
              alt={items.title}
              src={items.imageUrl}
            />
            {items.title}
          </Button>
        ))}
      </div>

      {/* Logout */}
      <div>
        <Button className="cursor-pointer" variant="ghost">
          <LogOutIcon />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  );
};

export default SideBar;
