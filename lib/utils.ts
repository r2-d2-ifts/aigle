import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function healthColor(score: number) {
  if (score >= 75) return "emerald";
  if (score >= 50) return "amber";
  return "rose";
}

export function healthLabel(score: number) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Warning";
  return "Critical";
}
