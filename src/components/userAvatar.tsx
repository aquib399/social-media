import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  user,
  className,
}: {
  user: {
    displayName: string | null;
    avatarUrl: string | null;
  };
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.avatarUrl ?? "https://i.pravatar.cc/300"}
        alt={user.displayName + " profile"}
      />
      <AvatarFallback>{user.displayName}</AvatarFallback>
    </Avatar>
  );
}
