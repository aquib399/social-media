import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  user,
  className,
}: {
  user: {
    displayName: string | null;
    avatarUrl: string | null;
  };
  className?: String;
}) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl ?? "https://i.pravatar.cc/300"} />
      <AvatarFallback>{user.displayName}</AvatarFallback>
    </Avatar>
  );
}
