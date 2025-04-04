"use client";

import { signInSchema, type SignInValues } from "@/lib/validation";
import { LoadingButton } from "@/components/loadingButton";
import { useEffect, useState, useTransition } from "react";
import GoogleSignInButton from "./google/google-sign-in";
import GithubSignInButton from "./github/github-sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { SignIn } from "./actions";
import Link from "next/link";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function SigninForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      indentifier: "",
      password: "",
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
          title: "Sign in failed",
          description: error,
        });
      } else {
        toast({ title: "Signed in successfully" });
      }
    });
  }

  useEffect(() => {
    const dismissToast = toast({
      title: "You could use a public account",
      description: "Please maintain professionalism with the account.",
      duration: Infinity,
      action: (
        <Button
          className="rounded bg-foreground px-3 py-1 text-background hover:bg-foreground/90"
          onClick={() => {
            SignIn({ indentifier: "", password: "" }, true).then(() => {
              dismissToast.dismiss();
              toast({
                variant: "default",
                title: "Login as a demo user",
                description: "You can use the demo account to test the app.",
              });
            });
          }}
        >
          Try Demo
        </Button>
      ),
    });
    return () => {
      dismissToast.dismiss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="indentifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border-input"
                        type="text"
                        placeholder="Username or Email"
                        {...field}
                        required
                      />
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
                    <FormLabel className="flex items-center gap-2">
                      <LockIcon className="h-4 w-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border-input"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-center text-sm font-medium text-destructive">
                    {error}
                  </p>
                </div>
              )}

              <LoadingButton
                isLoading={isPending}
                type="submit"
                className="w-full rounded-md font-semibold"
              >
                Sign in
              </LoadingButton>

              <div className="relative my-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <GoogleSignInButton
                  variant={"outline"}
                  className="w-full rounded-md font-semibold"
                />
                <GithubSignInButton
                  variant={"outline"}
                  className="w-full rounded-md font-semibold"
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm font-medium">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
