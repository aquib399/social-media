import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict, formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const curr = new Date();
  if (curr.getTime() - from.getTime() < 24 * 60 * 60 * 1000)
    return formatDistanceToNowStrict(from, { addSuffix: true });

  return formatDate(from, "dd MMMM yyyy");
}

export function formatNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number);
}
