// Geolocation-based currency detection utility
// Uses ipapi.co free API to detect visitor's country and map to currency

export interface CurrencyInfo {
  code: string;
  symbol: string;
  country: string;
}

// Mapping of country codes to Stripe-supported currencies
const COUNTRY_TO_CURRENCY: Record<string, { code: string; symbol: string }> = {
  // Americas
  US: { code: "usd", symbol: "$" },
  CA: { code: "cad", symbol: "CA$" },
  BR: { code: "brl", symbol: "R$" },
  MX: { code: "mxn", symbol: "MX$" },
  AR: { code: "ars", symbol: "ARS" },
  CL: { code: "clp", symbol: "CLP$" },
  CO: { code: "cop", symbol: "COP$" },
  PE: { code: "pen", symbol: "S/" },
  UY: { code: "uyu", symbol: "$U" },

  // Europe
  AT: { code: "eur", symbol: "€" },
  BE: { code: "eur", symbol: "€" },
  DE: { code: "eur", symbol: "€" },
  ES: { code: "eur", symbol: "€" },
  FI: { code: "eur", symbol: "€" },
  FR: { code: "eur", symbol: "€" },
  GR: { code: "eur", symbol: "€" },
  IE: { code: "eur", symbol: "€" },
  IT: { code: "eur", symbol: "€" },
  LU: { code: "eur", symbol: "€" },
  NL: { code: "eur", symbol: "€" },
  PT: { code: "eur", symbol: "€" },
  SK: { code: "eur", symbol: "€" },
  SI: { code: "eur", symbol: "€" },
  EE: { code: "eur", symbol: "€" },
  LV: { code: "eur", symbol: "€" },
  LT: { code: "eur", symbol: "€" },
  MT: { code: "eur", symbol: "€" },
  CY: { code: "eur", symbol: "€" },
  GB: { code: "gbp", symbol: "£" },
  CH: { code: "chf", symbol: "CHF" },
  SE: { code: "sek", symbol: "kr" },
  NO: { code: "nok", symbol: "kr" },
  DK: { code: "dkk", symbol: "kr" },
  PL: { code: "pln", symbol: "zł" },
  CZ: { code: "czk", symbol: "Kč" },
  HU: { code: "huf", symbol: "Ft" },
  RO: { code: "ron", symbol: "lei" },
  BG: { code: "bgn", symbol: "лв" },
  HR: { code: "eur", symbol: "€" },
  IS: { code: "isk", symbol: "kr" },

  // Asia & Oceania
  JP: { code: "jpy", symbol: "¥" },
  CN: { code: "cny", symbol: "¥" },
  KR: { code: "krw", symbol: "₩" },
  IN: { code: "inr", symbol: "₹" },
  AU: { code: "aud", symbol: "A$" },
  NZ: { code: "nzd", symbol: "NZ$" },
  SG: { code: "sgd", symbol: "S$" },
  HK: { code: "hkd", symbol: "HK$" },
  TW: { code: "twd", symbol: "NT$" },
  TH: { code: "thb", symbol: "฿" },
  MY: { code: "myr", symbol: "RM" },
  PH: { code: "php", symbol: "₱" },
  ID: { code: "idr", symbol: "Rp" },
  VN: { code: "vnd", symbol: "₫" },

  // Africa & Middle East
  ZA: { code: "zar", symbol: "R" },
  AE: { code: "aed", symbol: "د.إ" },
  SA: { code: "sar", symbol: "﷼" },
  IL: { code: "ils", symbol: "₪" },
  TR: { code: "try", symbol: "₺" },
  NG: { code: "ngn", symbol: "₦" },
  KE: { code: "kes", symbol: "KSh" },
  EG: { code: "egp", symbol: "E£" },
};

const DEFAULT_CURRENCY: CurrencyInfo = {
  code: "eur",
  symbol: "€",
  country: "unknown",
};

const CACHE_KEY = "shelter_currency_info";

export async function detectCurrency(): Promise<CurrencyInfo> {
// Removed sessionStorage check to force IP evaluation on every reload.

  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Geolocation API returned ${response.status}`);
    }

    const data = await response.json();
    const countryCode: string = data.country_code || "";
    const mapping = COUNTRY_TO_CURRENCY[countryCode];

    const currencyInfo: CurrencyInfo = mapping
      ? { code: mapping.code, symbol: mapping.symbol, country: countryCode }
      : { ...DEFAULT_CURRENCY, country: countryCode };

    // Removed sessionStorage setItem to avoid caching the result

    return currencyInfo;
  } catch (error) {
    console.warn("Currency detection failed, using default (EUR):", error);
    return DEFAULT_CURRENCY;
  }
}

// Zero-decimal currencies in Stripe (amount is in whole units, not cents)
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

/**
 * Convert a display amount to Stripe's smallest currency unit.
 * For most currencies this means multiplying by 100 (dollars → cents).
 * For zero-decimal currencies, the amount is used as-is.
 */
export function toStripeAmount(displayAmount: number, currencyCode: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currencyCode.toLowerCase())) {
    return Math.round(displayAmount);
  }
  return Math.round(displayAmount * 100);
}
