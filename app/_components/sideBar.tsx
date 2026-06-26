"use client";

import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { SheetClose, SheetContent, SheetHeader } from "./ui/sheet";
import { quickSearchOptions } from "../_constants/search";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import SignDialog from "./sign-in-dialog";

const SideBar = () => {
  const { data } = useSession();

  const handleLogoutClick = () => signOut();

  return (
    <SheetContent className="bg-[#080808] px-5">
      <SheetHeader className="pl-0 font-bold">Menu</SheetHeader>

      <div className="mb-2 flex items-center gap-3">
        {data?.user ? (
          <>
            <Avatar>
              <AvatarImage src={data.user.image ?? ""}></AvatarImage>
            </Avatar>

            <div>
              <h1 className="text-lg font-bold">{data.user.name}</h1>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </>
        ) : (
          <>
            <Dialog>
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-bold">Olá, faça seu login!</h1>
                <Button size="icon" asChild className="cursor-pointer">
                  <DialogTrigger>
                    <LogInIcon />
                  </DialogTrigger>
                </Button>
              </div>
              <DialogContent className="w-[70%] bg-[#141414]">
                <SignDialog />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Home and Booking button */}
      <div className="flex flex-col gap-1 border-b border-solid">
        <Button className="justify-start px-5" asChild>
          <Link href="/">
            <HomeIcon />
            Início
          </Link>
        </Button>

        <Button
          className="mb-5 cursor-pointer justify-start px-5"
          variant="ghost"
        >
          <CalendarIcon />
          Agendamentos
        </Button>
      </div>

      {/* QuickSearch Buttons */}
      <div className="flex flex-col items-start gap-5 border-b border-solid pb-5">
        {quickSearchOptions.map((items) => (
          <SheetClose key={items.title} asChild>
            <Button variant="ghost" className="cursor-pointer" asChild>
              <Link href={`/barbershops?service=${items.title}`}>
                <Image
                  height={18}
                  width={18}
                  alt={items.title}
                  src={items.imageUrl}
                />
                {items.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {/* Logout */}
      {data?.user && (
        <div>
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleLogoutClick}
          >
            <LogOutIcon />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  );
};

export default SideBar;
