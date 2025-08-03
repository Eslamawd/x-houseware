import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// دمج الكلاسات بشكل ذكي
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// تنسيق العملة (USD بشكل افتراضي)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}
