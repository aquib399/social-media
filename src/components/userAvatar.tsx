import { cn } from "@/lib/utils";
import Image from "next/image";

export default function UserAvatar({
  user,
  className,
  size,
}: {
  user: {
    displayName: string | null;
    avatarUrl: string | null;
  };
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src={user.avatarUrl ?? "/profile-placeholder.png"}
      alt={user.displayName + " profile"}
      aria-label={user.displayName + " profile"}
      width={size ?? 120}
      height={size || 120}
      className={cn(
        "rounded-full aspect-square size-10 flex-none bg-secondary",
        className,
      )}
    />
  );
}
