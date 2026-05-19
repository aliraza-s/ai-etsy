"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  COUNTRIES,
  ETSY_PLUS_MONTHLY,
  TRANSACTION_PCT,
  calculateFees,
  type CountryCode,
  type FeeBreakdown,
} from "@/lib/content/fee-calculator";
import { cn } from "@/lib/utils";

function fmt(value: number, symbol: string) {
  const negative = value < 0;
  const abs = Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${negative ? "−" : ""}${symbol}${abs}`;
}

function pct(value: number) {
  return `${(value * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}

export function FeeCalculator() {
  const [itemPrice, setItemPrice] = useState("25");
  const [shipping, setShipping] = useState("5");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [offsiteAds, setOffsiteAds] = useState(false);
  const [highVolume, setHighVolume] = useState(false);
  const [etsyPlus, setEtsyPlus] = useState(false);

  const fees: FeeBreakdown = useMemo(
    () =>
      calculateFees({
        itemPrice: Number.parseFloat(itemPrice) || 0,
        shipping: Number.parseFloat(shipping) || 0,
        countryCode,
        offsiteAds,
        highVolume,
        etsyPlus,
      }),
    [itemPrice, shipping, countryCode, offsiteAds, highVolume, etsyPlus],
  );

  const country = COUNTRIES.find((c) => c.code === countryCode)!;

  return (
    <div className="border-border bg-card text-card-foreground rounded-2xl border shadow-sm">
      <div className="grid lg:grid-cols-[1fr_1px_1fr]">
        {/* INPUTS */}
        <form className="space-y-5 p-6 sm:p-8" onSubmit={(e) => e.preventDefault()}>
          <FieldGroup label="Item price" hint={`In ${country.currency}`}>
            <NumberInput
              value={itemPrice}
              onChange={setItemPrice}
              symbol={country.symbol}
              ariaLabel="Item price"
            />
          </FieldGroup>

          <FieldGroup label="Shipping charge" hint="Set to 0 for free shipping">
            <NumberInput
              value={shipping}
              onChange={setShipping}
              symbol={country.symbol}
              ariaLabel="Shipping charge"
            />
          </FieldGroup>

          <FieldGroup label="Country" hint="Sets processing + regulatory rates">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value as CountryCode)}
              aria-label="Country"
              className="border-input bg-background text-foreground focus-visible:ring-ring h-11 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </FieldGroup>

          <div className="space-y-2.5 pt-2">
            <ToggleRow
              checked={offsiteAds}
              onChange={setOffsiteAds}
              label="Sale came via Offsite Ads"
              hint="Etsy takes an extra 12–15% on these"
            />
            {offsiteAds && (
              <ToggleRow
                checked={highVolume}
                onChange={setHighVolume}
                label="Over $10K/year (Offsite Ads → 12%)"
                hint="Under $10K is 15%"
                indent
              />
            )}
            <ToggleRow
              checked={etsyPlus}
              onChange={setEtsyPlus}
              label="Subscribe to Etsy Plus"
              hint={`Adds ${country.symbol}${ETSY_PLUS_MONTHLY.toFixed(2)}/month`}
            />
          </div>
        </form>

        {/* DIVIDER */}
        <div aria-hidden className="bg-border/60 hidden lg:block" />

        {/* RESULTS */}
        <div className="bg-secondary/30 rounded-r-2xl p-6 sm:p-8">
          <p className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase">
            Order revenue
          </p>
          <p className="text-foreground mt-1 text-3xl font-semibold tabular-nums">
            {fmt(fees.totalRevenue, fees.symbol)}
          </p>

          <ul className="border-border/60 mt-5 space-y-2 border-t pt-4 text-sm">
            <FeeLine label="Listing fee" value={fees.listingFee} symbol={fees.symbol} />
            <FeeLine
              label="Transaction fee"
              hint={`${pct(TRANSACTION_PCT)} of order`}
              value={fees.transactionFee}
              symbol={fees.symbol}
            />
            <FeeLine
              label="Payment processing"
              hint={`${pct(country.processingPct)} + ${country.symbol}${country.processingFlat.toFixed(2)}`}
              value={fees.processingFee}
              symbol={fees.symbol}
            />
            {fees.offsiteAdsFee > 0 && (
              <FeeLine
                label="Offsite Ads fee"
                hint={highVolume ? "12% of order" : "15% of order"}
                value={fees.offsiteAdsFee}
                symbol={fees.symbol}
              />
            )}
            <FeeLine
              label="Regulatory operating fee"
              hint={`${pct(country.regulatoryPct)} of order`}
              value={fees.regulatoryFee}
              symbol={fees.symbol}
            />
            {fees.etsyPlusFee > 0 && (
              <FeeLine
                label="Etsy Plus"
                hint="Monthly subscription"
                value={fees.etsyPlusFee}
                symbol={fees.symbol}
              />
            )}
          </ul>

          <div className="border-border/60 mt-4 space-y-2 border-t pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-muted-foreground text-sm">Total fees</span>
              <span className="text-foreground text-sm font-semibold tabular-nums">
                {fmt(fees.totalFees, fees.symbol)}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-muted-foreground text-xs">Effective fee rate</span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {pct(fees.effectiveFeePct)}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "mt-5 flex items-baseline justify-between rounded-lg px-4 py-3",
              fees.netPayout < 0 ? "bg-destructive/10" : "bg-primary/10",
            )}
          >
            <span className={cn("text-sm font-medium", fees.netPayout < 0 && "text-destructive")}>
              You net
            </span>
            <span
              className={cn(
                "text-2xl font-semibold tabular-nums",
                fees.netPayout < 0 ? "text-destructive" : "text-primary",
              )}
            >
              {fmt(fees.netPayout, fees.symbol)}
            </span>
          </div>

          <p className="text-muted-foreground mt-4 flex items-start gap-1.5 text-xs">
            <Info className="mt-0.5 size-3 flex-none" aria-hidden />
            <span>
              All rates from Etsy&apos;s Seller Handbook, updated for 2026. Excludes income tax, VAT
              collected on buyer&apos;s behalf, and your own material/labor costs.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-foreground text-sm font-medium">{label}</label>
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  symbol,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  symbol: string;
  ariaLabel: string;
}) {
  return (
    <div className="border-input bg-background focus-within:ring-ring flex h-11 items-center rounded-md border px-3 transition-colors focus-within:ring-2">
      <span className="text-muted-foreground pr-2 font-mono text-sm">{symbol}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || /^[0-9]*\.?[0-9]*$/.test(v)) onChange(v);
        }}
        aria-label={ariaLabel}
        className="text-foreground placeholder:text-muted-foreground w-full bg-transparent font-mono text-sm tabular-nums focus:outline-none"
      />
    </div>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
  hint,
  indent,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  indent?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md py-1.5",
        indent && "border-border/60 ml-6 border-l pl-3",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="border-input checked:bg-primary checked:border-primary focus-visible:ring-ring bg-background mt-0.5 size-4 flex-none rounded border transition-colors focus-visible:ring-2 focus-visible:outline-none"
      />
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </div>
    </label>
  );
}

function FeeLine({
  label,
  hint,
  value,
  symbol,
}: {
  label: string;
  hint?: string;
  value: number;
  symbol: string;
}) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <div>
        <p className="text-foreground text-sm">{label}</p>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </div>
      <span className="text-foreground font-mono text-sm tabular-nums">{fmt(value, symbol)}</span>
    </li>
  );
}
