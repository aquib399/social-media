"use client";
import { LoadingButton } from "@/components/loadingButton";
import { useSession } from "@/app/(main)/sessionProvider";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import useMediaUpload, { Media } from "./useMediaUpload";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { useSubmitPostMutation } from "./mutations";
import UserAvatar from "@/components/userAvatar";
import { Button } from "@/components/ui/button";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import Image from "next/image";
import "./styles.css";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const {
    medias,
    reset,
    progress,
    isUploading,
    removeMedia,
    handleStartUpload,
  } = useMediaUpload();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something here...",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: medias.map((media) => media.mediaId).filter(Boolean),
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          reset();
        },
      },
    );
  }
  return (
    <div className="flex flex-col gap-x-5 gap-y-3 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="flex gap-5">
        <UserAvatar user={user} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-80 w-full overflow-y-auto rounded-xl bg-background px-5 py-3 sm:rounded-2xl"
        />
      </div>
      {!!medias.length && (
        <MediaPreviews medias={medias} removeMedia={removeMedia} />
      )}

      {isUploading && (
        <div className="w-full text-center">
          <span className="text-xs">
            {String(progress == 100 ? 99 : progress || 0)}%
          </span>
          <div
            className="h-1 bg-secondary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 items-center">
        <AddMediaButton
          onFilesSelected={handleStartUpload}
          disabled={isUploading || medias.length > 5}
        />
        <LoadingButton
          isLoading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface addMediaProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}
export function AddMediaButton({ onFilesSelected, disabled }: addMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*, audio/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface mediasPreviewProps {
  medias: Media[];
  removeMedia: (fileName: string) => void;
}
function MediaPreviews({ medias, removeMedia }: mediasPreviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        medias.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {medias.map((m, index) => (
        <MediaPreview
          key={index}
          media={m}
          onRemove={() => removeMedia(m.file.name)}
        />
      ))}
    </div>
  );
}

interface mediaPreviewProps {
  media: Media;
  onRemove: () => void;
}
function MediaPreview({ media, onRemove }: mediaPreviewProps) {
  const { file, isUploading } = media;
  const src = URL.createObjectURL(file);
  const fileType = file.type.startsWith("image")
    ? "image"
    : file.type.startsWith("video")
      ? "video"
      : "audio";

  const source = {
    image: (
      <Image
        src={src}
        alt="Media preview"
        width={500}
        height={500}
        className="size-fit max-h-[30rem] rounded-xl"
      />
    ),
    video: (
      <video controls className="size-fit max-h-[30rem] rounded-xl">
        <source src={src} type={file.type} />
      </video>
    ),
    audio: <audio src={src} controls controlsList="nodownload" />,
  };
  return (
    <div
      className={cn(
        "relative mx-auto size-fit",
        isUploading ? "animate-pulse" : "",
      )}
    >
      {source[fileType]}
      {!isUploading && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 rounded-full bg-background/60 p-1 transition-colors hover:bg-background"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
}
