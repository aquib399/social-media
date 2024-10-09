import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid h-screen w-full place-content-center">
      <Loader2 className="mx-auto my-3 size-6 animate-spin sm:size-8" />
    </div>
  );
}
