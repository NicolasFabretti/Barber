import Image from "next/image";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const SignDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google");
  return (
    <DialogHeader className="flex items-center">
      <DialogTitle>Faça Login na plataforma</DialogTitle>
      <DialogDescription>
        Conecte-se usando sua conta do Google
      </DialogDescription>
      <Button
        variant="secondary"
        className="flex h-10 w-full cursor-pointer gap-2"
        onClick={handleLoginWithGoogleClick}
      >
        <Image src="/vector.svg" width={18} height={18} alt="Google Image" />
        <Image
          src="/Button.svg"
          width={50}
          height={18}
          alt="Google Image"
          className="mt-0.5"
        />
      </Button>
    </DialogHeader>
  );
};

export default SignDialog;
