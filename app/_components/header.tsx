import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import SideBar from "./sideBar";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between px-8">
          <Link href="/">
            <Image
              className="h-5 w-30 cursor-pointer"
              alt="FSW BARBER"
              src="/logofsw.png"
              height={1}
              width={1000}
            ></Image>
          </Link>
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" className="cursor-pointer">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SideBar />
          </Sheet>
        </CardContent>
      </Card>
    </>
  );
};
