"use client";

import { Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PhoneItemProps {
  phone: string;
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneClick = (action: string) => {
    navigator.clipboard.writeText(action);
    toast.success("Telefone copiado com sucesso!");
  };
  return (
    <div className="flex justify-between px-5 py-2">
      <div className="flex items-center gap-2">
        <Smartphone />
        <h1 className="text-xl">{phone}</h1>
      </div>

      <div>
        <Button
          className="h-10 w-20 cursor-pointer"
          variant="outline"
          onClick={() => handleCopyPhoneClick(phone)}
        >
          Copiar
        </Button>
      </div>
    </div>
  );
};

export default PhoneItem;

/*Você até poderia chamar navigator.clipboard.writeText() dentro de um useEffect, mas normalmente não faz sentido porque copiar para a área de transferência é uma ação do usuário (clique), não um efeito colateral da renderização.

Regra prática
Clique em botão → função normal (handleClick, handleSubmit, etc.)
Buscar dados de API → useEffect
Adicionar/remover event listeners → useEffect
Manipular timers (setInterval, setTimeout) → useEffect
Reagir à mudança de estado/props → useEffect

No seu componente, usar uma função comum para o onClick é exatamente o que se espera em React. */
