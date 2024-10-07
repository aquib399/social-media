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
  const random = Math.floor(Math.random() * 100) + 250;
  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.avatarUrl ?? "https://i.pravatar.cc/" + random}
        alt={user.displayName + " profile"}
      />
      <AvatarFallback>{user.displayName}</AvatarFallback>
    </Avatar>
  );
}
