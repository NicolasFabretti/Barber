import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

// TODO receber agendamento como prop
const BookintItem = () => {
  return (
    <>
      <h1 className="px-8 py-5 text-sm font-bold text-gray-400">
        AGENDAMENTOS
      </h1>
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
    </>
  );
};

export default BookintItem;
