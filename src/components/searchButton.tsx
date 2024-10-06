"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export default function SearchButton() {
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = e.currentTarget.query.value;
    console.log({ query });
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input type="text" name="query" placeholder="Search" className="pe-8" />
      <Search className="absolute right-2 top-1/2 size-5 -translate-y-1/2" />
    </form>
  );
}
