import { useSession } from "@/app/(main)/sessionProvider";
import CommentMoreButton from "./commentMoreButton";
import { formatRelativeDate } from "@/lib/utils";
import { CommentData } from "@/lib/types";
import UserToolTip from "../userTooltip";
import UserAvatar from "../userAvatar";
import Link from "next/link";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserToolTip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar user={comment.user} size={40} />
          </Link>
        </UserToolTip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserToolTip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserToolTip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
