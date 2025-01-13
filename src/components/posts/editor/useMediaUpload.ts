import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface Media {
  file: File;
  mediaId: string;
  isUploading: boolean;
}
export default function useMediaUpload() {
  const { toast } = useToast();
  const [medias, setMedias] = useState<Media[]>([]);
  const [progress, setProgress] = useState<number>();
  const { isUploading, startUpload } = useUploadThing("media", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop() as string;
        return new File([file], `media-${crypto.randomUUID()}.${extension}`, {
          type: file.type,
        });
      });
      setMedias((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          mediaId: "",
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setProgress,

    onClientUploadComplete(res) {
      setMedias((prev) =>
        prev.map((media) => {
          const uploadResult = res.find((r) => r.name === media.file.name);
          if (!uploadResult) return media;
          return {
            ...media,
            mediaId: uploadResult?.serverData.mediaId || "",
            isUploading: false,
          };
        }),
      );
    },

    onUploadError(err) {
      setMedias((prev) => prev.filter((m) => !m.isUploading));
      toast({
        variant: "destructive",
        title: "Media Upload failed",
        description: err.message,
      });
    },
  });
  function handleStartUpload(files: File[]) {
    if (isUploading) {
      return toast({
        variant: "destructive",
        title: "Media Upload in progress",
        description: "Please wait for the current upload to finish",
      });
    }
    if (medias.length + files.length > 5) {
      return toast({
        variant: "destructive",
        title: "Too many media",
        description: "You can only upload up to 5 media at a time",
      });
    }
    startUpload(files);
  }

  function removeMedia(fileName: string) {
    setMedias((prev) => prev.filter((m) => m.file.name !== fileName));
  }
  function reset() {
    setMedias([]);
    setProgress(undefined);
  }

  return {
    reset,
    medias,
    progress,
    isUploading,
    removeMedia,
    handleStartUpload,
  };
}
