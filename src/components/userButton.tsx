"use client";

import { Dot, LogOut, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useSession } from "@/app/(main)/sessionProvider";
import { signOut } from "@/app/(auth)/actions";
import { useTheme } from "next-themes";
import UserAvatar from "./userAvatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";

export function UserButton({ className }: { className?: string }) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <div>
          <UserAvatar user={user} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Signed In as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/users/" + user.username}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            {
              {
                system: <Monitor className="mr-2 size-4" />,
                light: <Sun className="mr-2 size-4" />,
                dark: <Moon className="mr-2 size-4" />,
              }[theme as string]
            }
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="cursor-pointer"
              >
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <Dot />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer"
              >
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Dot />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer"
              >
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Dot />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
