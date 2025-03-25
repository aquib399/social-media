"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

interface GithubSignInButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export default function GithubSignInButton({
  children,
  ...props
}: GithubSignInButtonProps) {
  return (
    <Button asChild {...props}>
      <Link href={`/signin/github`}>
        {children || (
          <>
            <Github /> Sign in with Github
          </>
        )}
      </Link>
    </Button>
  );
}
