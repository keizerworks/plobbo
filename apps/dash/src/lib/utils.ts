import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export const getRecordName = (name: string) => {
  const parts = name.split(".");
  if (parts.length <= 2) {
    return name; // If it's "domain.com", return as is
  }
  return parts.slice(0, -2).join("."); // Remove the last two segments (domain + TLD)
};

export function formatCurrency(amount: number, currency: string) {
  const currencyCode = currency.toLowerCase();
  const majorAmount = amount / 100;

  const currencySymbols = {
    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    cny: "¥",
    inr: "₹",
    cad: "CA$",
    aud: "A$",
    brl: "R$",
    chf: "CHF",
    sek: "kr",
    nok: "kr",
    dkk: "kr",
    rub: "₽",
    mxn: "MX$",
    sgd: "S$",
    hkd: "HK$",
    krw: "₩",
    try: "₺",
    zar: "R",
    // Add more currencies as needed
  };

  const symbol =
    currencySymbols[currencyCode as unknown as keyof typeof currencySymbols] ||
    currencyCode.toUpperCase();

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (currencyCode === "jpy" || currencyCode === "krw") {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  }

  try {
    return new Intl.NumberFormat("en-US", options).format(majorAmount);
  } catch {
    const formattedNumber = majorAmount.toFixed(options.minimumFractionDigits);
    return `${symbol}${formattedNumber}`;
  }
}
