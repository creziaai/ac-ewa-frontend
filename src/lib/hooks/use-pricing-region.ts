
"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/endpoints/billing";

export type Currency = "INR" | "USD";

const STORAGE_KEY = "accewa:currency";

export function usePricingRegion() {
  const { data, isLoading } = useQuery({
    queryKey: ["billing", "region"],
    queryFn: billingApi.region,
    staleTime: Infinity,
    retry: false,
  });

  const internationalEnabled =
    data?.internationalCheckoutEnabled === true;

  const [override, setOverride] = useState<Currency | null>(null);

  // Restore the saved currency after the component mounts.
  // Deferring the update avoids synchronous setState inside the effect.
  useEffect(() => {
    if (isLoading) return;

    let timer: number | undefined;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (
        saved === "INR" ||
        (saved === "USD" && internationalEnabled)
      ) {
        timer = window.setTimeout(() => {
          setOverride(saved as Currency);
        }, 0);
      } else if (saved === "USD") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Local storage may be unavailable.
    }

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [isLoading, internationalEnabled]);

  const setCurrency = useCallback(
    (currency: Currency) => {
      // USD is allowed only when international checkout is enabled.
      if (currency === "USD" && !internationalEnabled) {
        return;
      }

      setOverride(currency);

      try {
        window.localStorage.setItem(STORAGE_KEY, currency);
      } catch {
        // Continue working if local storage is unavailable.
      }
    },
    [internationalEnabled],
  );

  const detected: Currency =
    data?.currency === "USD" && internationalEnabled
      ? "USD"
      : "INR";

  return {
    isLoading,
    regionAvailable: Boolean(data),
    country: data?.country ?? null,
    detectedCurrency: detected,
    currency: override ?? detected,
    internationalEnabled,
    setCurrency,
  };
}

export function countryFlag(
  code: string | null | undefined,
): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) {
    return "";
  }

  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((character) => {
        return 0x1f1e6 + character.charCodeAt(0) - 65;
      }),
  );
}
