import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="my-12 grid w-full grid-cols-4 place-items-center">
      <div className="col-span-3 text-center">
        <Loader2 className="mx-auto my-3 h-10 w-10 animate-spin" />
      </div>
    </div>
  );
}
