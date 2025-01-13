"use client";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";
import { CropImageDialog } from "@/components/cropImageDialog";
import { LoadingButton } from "@/components/loadingButton";
import { useUpdateProfileMutation } from "./mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import Image, { StaticImageData } from "next/image";
import { Textarea } from "@/components/ui/textarea";
import Resizer from "react-image-file-resizer";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { UserData } from "@/lib/types";
import { Camera } from "lucide-react";
import "cropperjs/dist/cropper.css";
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
  FormItem,
  FormField,
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
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateProfileValues) {
    const newAvatar = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    mutation.mutate(
      { values, avatar: newAvatar },
      {
        onSuccess: () => {
          onOpenChange(false);
          setCroppedAvatar(null);
          toast({
            title: "Profile updated",
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
        <div className="space-y-1.5">
          <label>Avatar</label>
          <AvatarImageInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : (user.avatarUrl ?? "/profile-placeholder.png")
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
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

interface AvatarImageInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

export function AvatarImageInput({
  src,
  onImageCropped,
}: AvatarImageInputProps) {
  const [imageTocrop, setImageTocrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageTocrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="hidden sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block border rounded-full overflow-hidden"
      >
        <Image
          src={src}
          alt="Profile picture"
          width={150}
          height={150}
          className="size-32 flex-none obejct-cover rounded-full"
        />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-30 group-hover:opacity-100 group-hover:backdrop-blur-[1px] transition-all">
          <Camera size={32} strokeWidth={1.2} color="white" />
        </span>
      </button>
      {imageTocrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageTocrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageTocrop(undefined);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
    </>
  );
}
