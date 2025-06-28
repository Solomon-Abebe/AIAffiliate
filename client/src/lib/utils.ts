import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numPrice);
}

export function calculateDiscount(originalPrice: string | number, currentPrice: string | number): number {
  const original = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice;
  const current = typeof currentPrice === "string" ? parseFloat(currentPrice) : currentPrice;
  
  if (original <= current) return 0;
  
  return Math.round(((original - current) / original) * 100);
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatRating(rating: string | number): number {
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  return Math.round(numRating * 10) / 10;
}
