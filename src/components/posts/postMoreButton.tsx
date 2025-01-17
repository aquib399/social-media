import { MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import DeletePostDialog from "./deletePostDialoag";
import { PostData } from "@/lib/types";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}
export default function PostMoreButton({
  post,
  className,
}: PostMoreButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className={className}>
          <MoreHorizontal className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.replace(`/?edit=${post.id}`)}>
          <span className="flex items-center gap-3 text-primary">
            <PenLine className="size-4" />
            Edit Post
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <span className="flex items-center gap-3 text-destructive">
            <Trash2 className="size-4" />
            Delete
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeletePostDialog
        post={post}
        open={open}
        onClose={() => setOpen(false)}
      />
    </DropdownMenu>
  );
}
