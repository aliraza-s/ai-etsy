/**
 * Etsy fee math. All rates pulled from Etsy's Seller Handbook
 * (etsy.com/seller-handbook). Updated for 2026.
 */

export type CountryCode = "US" | "UK" | "CA" | "AU" | "EU" | "OTHER";

export interface Country {
  code: CountryCode;
  label: string;
  /** ISO 4217 currency code. */
  currency: string;
  /** Currency symbol. */
  symbol: string;
  /** Payment processing — percentage of (item + shipping). */
  processingPct: number;
  /** Payment processing — flat fee in local currency. */
  processingFlat: number;
  /** Regulatory operating fee — % of (item + shipping). */
  regulatoryPct: number;
}

export const COUNTRIES: Country[] = [
  {
    code: "US",
    label: "United States",
    currency: "USD",
    symbol: "$",
    processingPct: 0.03,
    processingFlat: 0.25,
    regulatoryPct: 0.0025,
  },
  {
    code: "UK",
    label: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    processingPct: 0.04,
    processingFlat: 0.2,
    regulatoryPct: 0.011,
  },
  {
    code: "CA",
    label: "Canada",
    currency: "CAD",
    symbol: "CA$",
    processingPct: 0.03,
    processingFlat: 0.25,
    regulatoryPct: 0.0035,
  },
  {
    code: "AU",
    label: "Australia",
    currency: "AUD",
    symbol: "A$",
    processingPct: 0.03,
    processingFlat: 0.25,
    regulatoryPct: 0.0045,
  },
  {
    code: "EU",
    label: "Eurozone (DE/FR/ES/IT…)",
    currency: "EUR",
    symbol: "€",
    processingPct: 0.04,
    processingFlat: 0.3,
    regulatoryPct: 0.004,
  },
  {
    code: "OTHER",
    label: "Other",
    currency: "USD",
    symbol: "$",
    processingPct: 0.04,
    processingFlat: 0.3,
    regulatoryPct: 0.003,
  },
];

export const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c])) as Record<
  CountryCode,
  Country
>;

/** Flat Etsy fees. */
export const LISTING_FEE = 0.2;
export const TRANSACTION_PCT = 0.065;
export const OFFSITE_ADS_PCT_UNDER_10K = 0.15;
export const OFFSITE_ADS_PCT_OVER_10K = 0.12;
export const ETSY_PLUS_MONTHLY = 10;

export interface FeeInput {
  /** Item price in local currency. */
  itemPrice: number;
  /** Shipping charge in local currency. */
  shipping: number;
  countryCode: CountryCode;
  /** Did the sale come via an Offsite Ad? */
  offsiteAds: boolean;
  /** Seller has crossed $10K in revenue in trailing 12 months (Offsite Ads rate drops to 12%). */
  highVolume: boolean;
  /** Allocate Etsy Plus subscription cost ($10/mo amortized) into this sale. */
  etsyPlus: boolean;
}

export interface FeeBreakdown {
  listingFee: number;
  transactionFee: number;
  processingFee: number;
  offsiteAdsFee: number;
  regulatoryFee: number;
  etsyPlusFee: number;
  totalFees: number;
  totalRevenue: number;
  netPayout: number;
  effectiveFeePct: number;
  currency: string;
  symbol: string;
}

export function calculateFees(input: FeeInput): FeeBreakdown {
  const country = COUNTRY_BY_CODE[input.countryCode];
  const orderTotal = Math.max(0, input.itemPrice + input.shipping);

  const listingFee = LISTING_FEE;
  const transactionFee = orderTotal * TRANSACTION_PCT;
  const processingFee = orderTotal * country.processingPct + country.processingFlat;
  const regulatoryFee = orderTotal * country.regulatoryPct;

  const offsiteAdsRate = input.highVolume ? OFFSITE_ADS_PCT_OVER_10K : OFFSITE_ADS_PCT_UNDER_10K;
  const offsiteAdsFee = input.offsiteAds ? orderTotal * offsiteAdsRate : 0;
  const etsyPlusFee = input.etsyPlus ? ETSY_PLUS_MONTHLY : 0;

  const totalFees =
    listingFee + transactionFee + processingFee + offsiteAdsFee + regulatoryFee + etsyPlusFee;
  const netPayout = orderTotal - totalFees;
  const effectiveFeePct = orderTotal > 0 ? totalFees / orderTotal : 0;

  return {
    listingFee,
    transactionFee,
    processingFee,
    offsiteAdsFee,
    regulatoryFee,
    etsyPlusFee,
    totalFees,
    totalRevenue: orderTotal,
    netPayout,
    effectiveFeePct,
    currency: country.currency,
    symbol: country.symbol,
  };
}
