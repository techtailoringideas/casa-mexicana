// Lightweight className merger — no external dependency needed
type ClassValue = string | undefined | null | false | 0;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format price with reduced currency symbol for "Pain of Paying" reduction
 */
export function formatPrice(price: number): string {
  return `Rs ${price}`;
}
