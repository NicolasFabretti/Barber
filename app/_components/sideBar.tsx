import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogOutIcon } from "lucide-react";
import { SheetContent, SheetHeader } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { quickSearchOptions } from "../_constants/search";
import Image from "next/image";
import Link from "next/link";

const SideBar = () => {
  return (
    <SheetContent className="bg-[#080808] px-5">
      <SheetHeader className="pl-0 font-bold">Menu</SheetHeader>

      {/* Avatar */}
      <div className="mb-2 flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </Avatar>
        <div>
          <h1 className="text-lg font-bold">Nicolas Fabretti</h1>
          <p className="text-xs">emailteste@gmail.com</p>
        </div>
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
