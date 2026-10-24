import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats integer cents into a currency string. Backend amounts are always integer cents. */
export function formatMoney(cents: number, currency = "inr") {
<<<<<<< HEAD
  const code = currency.toUpperCase();
  return new Intl.NumberFormat(code === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: code,
=======
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
>>>>>>> 3a9bca51b6c02abe374fb51540c359783f274e15
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function initials(email: string) {
  const [name] = email.split("@");
  return name.slice(0, 2).toUpperCase();
}

