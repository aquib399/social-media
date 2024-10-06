"use client";

import { signInSchema, SignInValues } from "@/lib/validation";
import { LoadingButton } from "@/components/loadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { SignIn } from "./actions";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

export default function SignInForm() {
  const { toast } = useToast();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });

  async function onSubmit(data: SignInValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await SignIn(data);
      if (error) {
        setError(error);
        toast({
          variant: "destructive",
          title: error,
        });
      }
    });
  }

  return (
    <section className="grid min-h-[90vh] w-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-80 space-y-1.5 sm:min-w-64 sm:max-w-96"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p className="tex-sm text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}
          <LoadingButton isLoading={isPending} type="submit" className="w-full">
            Sign in
          </LoadingButton>
        </form>
      </Form>
    </section>
  );
}
