"use client";

import { signupSchema, type SignUpValues } from "@/lib/validation";
import GoogleSignInButton from "../signin/google/google-sign-in";
import GithubSignInButton from "../signin/github/github-sign-in";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { LoadingButton } from "@/components/loadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignUp } from "./actions";
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

export default function AdminSignupForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      username: "",
    },
  });

  async function onSubmit(data: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await SignUp(data);
      if (error) {
        setError(error);
        toast.error("Sign up failed", { description: error });
      } else {
        toast.success("Signed up successfully");
      }
    });
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border-input"
                        type="text"
                        placeholder="something"
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
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border-input"
                        type="text"
                        placeholder="Tapu ke papa"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border-input"
                        type="email"
                        placeholder="user@example.com"
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
                Sign up
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
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
