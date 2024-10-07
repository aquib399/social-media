import { useDeletePostMutation } from "./mutations";
import { LoadingButton } from "../loadingButton";
import { Post } from "@prisma/client";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const mutation = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You will not be able to recover this post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
            isLoading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button variant="outline" disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
