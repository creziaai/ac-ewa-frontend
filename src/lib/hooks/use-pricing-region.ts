"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/endpoints/billing";

export type Currency = "INR" | "USD";

const STORAGE_KEY = "accewa:currency";

/**
 * Decides which currency the pricing UI uses.
 *
 * Priority: the customer's manual choice > the server's country detection > INR.
 * A saved USD choice is only honoured when the backend says international
 * checkout is enabled; otherwise it is discarded so customers are never stuck
 * on a USD screen they cannot pay on.
 */
export function usePricingRegion() {
  const { data, isLoading } = useQuery({
    queryKey: ["billing", "region"],
    queryFn: billingApi.region,
    staleTime: Infinity,
    retry: false,
  });

  const internationalEnabled = data?.internationalCheckoutEnabled === true;

  const [override, setOverride] = useState<Currency | null>(null);

  // Restore the saved choice once we know whether USD is allowed.
  useEffect(() => {
    if (isLoading) return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "INR" || (saved === "USD" && internationalEnabled)) {
        setOverride(saved);
      } else if (saved === "USD") {
        window.localStorage.removeItem(STORAGE_KEY); // stale USD choice
      }
    } catch {
      /* storage can be blocked (private mode); ignore */
    }
  }, [isLoading, internationalEnabled]);

  const setCurrency = useCallback(
    (currency: Currency) => {
      setOverride(currency);
      try {
        // Only remember USD if it is actually payable.
        if (currency === "INR" || internationalEnabled) {
          window.localStorage.setItem(STORAGE_KEY, currency);
        }
      } catch {
        /* ignore */
      }
    },
    [internationalEnabled],
  );

  const detected: Currency =
    data?.currency === "USD" && internationalEnabled ? "USD" : "INR";

  const regionAvailable = Boolean(data);

  return {
    isLoading,
    regionAvailable,
    country: data?.country ?? null,
    detectedCurrency: detected,
    currency: (override ?? detected) as Currency,
    internationalEnabled,
    setCurrency,
  };
}

/** "FR" -> "🇫🇷". Returns "" for anything that isn't a 2-letter code. */
export function countryFlag(code: string | null | undefined): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}