import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between px-8">
          <Image
            className="h-5 w-30"
            alt="FSW BARBER"
            src="/logofsw.png"
            height={1}
            width={1000}
          ></Image>
          <Button size="icon" variant="outline">
            <Menu></Menu>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
