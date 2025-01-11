import { Cropper, ReactCropperElement } from "react-cropper";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

interface cropImageDialogProps {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export const CropImageDialog = ({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: cropImageDialogProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => {
      onCropped(blob);
    }, "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides
          zoomable={false}
          ref={cropperRef}
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
