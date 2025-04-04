import SearchButton from "@/components/searchButton";
import { UserButton } from "@/components/userButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3">
        <div className="flex w-full items-center gap-x-5 gap-y-2">
          <Link
            href={"/"}
            className="mr-auto text-2xl font-paytoneOne tracking-wide"
          >
            Drift
          </Link>
          <SearchButton className="hidden sm:block" />
          <UserButton className="cursor-pointer" />
        </div>
        <SearchButton className="w-full sm:hidden" />
      </div>
    </header>
  );
}
