"use client";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";
import { LoadingButton } from "@/components/loadingButton";
import { useUpdateProfileMutation } from "./mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { UserData } from "@/lib/types";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { toast } = useToast();
  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });
  const mutation = useUpdateProfileMutation();
  async function onSubmit(values: UpdateProfileValues) {
    mutation.mutate(
      { values },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "Profile updated from components.tsx",
            description: "Your profile has been updated successfully.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error updating profile",
            description: "There was an error updating your profile.",
          });
        },
      },
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Edit your profile information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                size="sm"
                title="Make sure to your personal details are correct."
                variant="outline"
                isLoading={mutation.isPending}
                type="submit"
              >
                Update
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
