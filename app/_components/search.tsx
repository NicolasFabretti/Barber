"use client";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

const formSchema = z.object({
  search: z.string().trim().min(1, {
    message: "Digite algo para buscar",
  }),
});

const Search = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });
  const router = useRouter();
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?title=${encodeURIComponent(data.search)}`);
  };
  return (
    <>
      {/*ATUAL */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex h-10 gap-3">
                  <FormControl className="">
                    <Input
                      placeholder="Faça sua busca..."
                      {...field}
                      className="h-10 w-full"
                    />
                  </FormControl>
                  <Button className="h-full w-15" type="submit">
                    <SearchIcon />
                  </Button>
                </div>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default Search;
