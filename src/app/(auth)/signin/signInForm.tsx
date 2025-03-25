"use client";

import { signInSchema, type SignInValues } from "@/lib/validation";
import { LoadingButton } from "@/components/loadingButton";
import GoogleSignInButton from "./google/google-sign-in";
import GithubSignInButton from "./github/github-sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { LockIcon, MailIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignIn } from "./actions";
import { toast } from "sonner";
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
        toast.error("Sign in failed", {
          description: error,
        });
      } else {
        toast.success("Signed in successfully");
      }
    });
  }

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
                <GoogleSignInButton className="w-full rounded-md font-semibold" />
                <GithubSignInButton className="w-full rounded-md font-semibold" />
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
