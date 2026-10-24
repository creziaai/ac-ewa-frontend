"use client";

import { useEffect, useState } from "react";
import { Check, Download, Globe, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelSubscription,
  useCreateOrder,
  useInvoices,
  usePaymentHistory,
  usePlans,
  useRetryPayment,
  useSubscription,
  useUsageSummary,
} from "@/lib/hooks/use-billing";
import {
  countryFlag,
  usePricingRegion,
  type Currency,
} from "@/lib/hooks/use-pricing-region";
import { useAuth } from "@/lib/hooks/use-auth";
import { billingApi } from "@/lib/api/endpoints/billing";
import { paymentsApi } from "@/lib/api/endpoints/payments";
import { openRazorpayCheckout } from "@/lib/razorpay/checkout";
import { formatMoney, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Payment } from "@/types/models";

export default function BillingPage() {
  const billingQueryClient = useQueryClient();
  useEffect(() => {
    const url = new URL(window.location.href);
    const paypalStatus = url.searchParams.get("paypal");
    const orderId = url.searchParams.get("token");
    if (paypalStatus === "success" && orderId) {
      paymentsApi.capturePaypalOrder(orderId).then((result) => {
        if (result.verified) toast.success("PayPal payment received and your plan is active.");
      }).catch((error) => toast.error(getApiErrorMessage(error, "PayPal payment could not be verified. Contact support if you were charged."))).finally(() => {
        url.searchParams.delete("paypal"); url.searchParams.delete("token"); window.history.replaceState({}, "", url.toString());
        billingQueryClient.invalidateQueries({ queryKey: ["billing"] });
        billingQueryClient.invalidateQueries({ queryKey: ["payments"] });
      });
    } else if (paypalStatus === "cancel") {
      toast.info("PayPal checkout was cancelled."); url.searchParams.delete("paypal"); window.history.replaceState({}, "", url.toString());
    }
  }, [billingQueryClient]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Billing</h1>
        <p className="text-sm text-ink-muted">
          Manage your plan, payment history, and invoices.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="history">Payment history</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="plans">
          <PlansTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

function OverviewTab() {
  const { data: subscription, isLoading } = useSubscription();
  const { data: usage } = useUsageSummary();
  const cancelSubscription = useCancelSubscription();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-semibold">
                  {subscription.plan.name}
                </span>
                <Badge variant={subscription.status === "ACTIVE" ? "success" : "outline"}>
                  {subscription.status}
                </Badge>
              </div>

              <p className="text-sm text-ink-muted">
                {subscription.plan.amountCents === 0
                  ? "Free"
                  : `${formatMoney(subscription.plan.amountCents, subscription.plan.currency)} / ${subscription.plan.interval}`}
              </p>

              {subscription.currentPeriodEnd && (
                <p className="text-xs text-ink-faint">
                  {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              )}

              {!subscription.cancelAtPeriodEnd && subscription.plan.code !== "FREE" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelSubscription.mutate()}
                  disabled={cancelSubscription.isPending}
                >
                  {cancelSubscription.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Cancel at period end
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-ink-muted">No active subscription found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage this period</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!usage ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            usage.usage.map((item) => {
              const unlimited = item.limit === -1;
              const pct = unlimited
                ? 0
                : item.limit === 0
                  ? 100
                  : Math.min(100, (item.used / item.limit) * 100);

              return (
                <div key={item.metric}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-ink-muted">{metricLabel(item.metric)}</span>
                    <span className="font-mono-tabular text-ink-faint">
                      {item.used} / {unlimited ? "∞" : item.limit}
                    </span>
                  </div>
                  <Progress value={unlimited ? 8 : pct} />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Plans (country-aware pricing)                                              */
/* -------------------------------------------------------------------------- */

function PlansTab() {
  const {
    currency,
    setCurrency,
    country,
    internationalEnabled,
    isLoading: regionLoading,
  } = usePricingRegion();

  const { data: plans, isLoading, isError, refetch } = usePlans(currency);
  const { data: subscription } = useSubscription();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();

  const [upgradingCode, setUpgradingCode] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => { queryClient.invalidateQueries({ queryKey: ["billing"] }); queryClient.invalidateQueries({ queryKey: ["payments"] }); };
    window.addEventListener("accewa:billing-refresh", refresh);
    return () => window.removeEventListener("accewa:billing-refresh", refresh);
  }, [queryClient]);

  if (regionLoading || isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !plans?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plans unavailable</CardTitle>
          <CardDescription>
            The billing service did not return any active plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // The server is the source of truth for prices. If it returned prices in a
  // different currency than the one selected (e.g. an older backend that ignores
  // ?currency=), never let the customer pay on a mismatched screen.
  const pricesMatch = plans.every(
    (p) => p.amountCents === 0 || p.currency.toUpperCase() === currency,
  );
  const usdUnavailable = currency === "USD" && !internationalEnabled;
  const checkoutBlocked = usdUnavailable || !pricesMatch;
  const activePaidPlan = Boolean(
    subscription &&
    subscription.plan.code !== "FREE" &&
    (subscription.status === "ACTIVE" || subscription.status === "TRIALING") &&
    (!subscription.currentPeriodEnd || new Date(subscription.currentPeriodEnd).getTime() > Date.now())
  );

  const refreshBilling = () => {
    queryClient.invalidateQueries({ queryKey: ["billing"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  const handleUpgrade = async (planCode: string) => {
    if (upgradingCode) return; // ignore double clicks

    // Switching to Free never involves a payment.
    if (planCode === "FREE") {
      setUpgradingCode(planCode);
      try {
        await billingApi.upgrade(planCode);
        refreshBilling();
        toast.success("Switched to the Free plan.");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setUpgradingCode(null);
      }
      return;
    }

    if (checkoutBlocked) return;

    setUpgradingCode(planCode);

    if (currency === "USD") {
      try {
        const paypalOrder = await paymentsApi.createPaypalOrder({ planCode });
        window.location.assign(paypalOrder.approvalUrl);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Couldn't start PayPal checkout. Please try again."));
        setUpgradingCode(null);
      }
      return;
    }

    // INR orders are created by the server and charged through Razorpay.
    let order;
    try {
      order = await createOrder.mutateAsync({ planCode, currency });
    } catch {
      // useCreateOrder already showed the error toast.
      setUpgradingCode(null);
      return;
    }

    // 2) Open checkout using exactly what the server told us to charge.
    try {
      await openRazorpayCheckout({
        keyId: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Accewa",
        description: `Upgrade to ${planCode}`,
        order_id: order.orderId,
        prefill: { email: user?.email },
        theme: { color: "#2A4CDB" },

        handler: async (response) => {
          try {
            const result = await paymentsApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // New backend activates the plan inside /verify (and via webhook),
            // so closing the tab can't leave a paid customer on the old plan.
            // Older backends don't; fall back to the previous behaviour.
            if (!result.activated) {
              await billingApi.upgrade(planCode);
            }

            refreshBilling();
            toast.success(`Upgraded to ${planCode}.`);
          } catch (error) {
            toast.error(
              getApiErrorMessage(
                error,
                "Payment succeeded, but activating the plan failed. Contact support.",
              ),
            );
          } finally {
            setUpgradingCode(null);
          }
        },

        modal: { ondismiss: () => setUpgradingCode(null) },
      });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Couldn't open checkout. Please try again."),
      );
      setUpgradingCode(null);
    }
  };

  const flag = countryFlag(country);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-raised p-4">
        <div>
          <p className="text-sm font-semibold text-ink">Display currency</p>
          <p className="text-xs text-ink-muted">Switch currencies to see the available plan prices.</p>
        </div>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <Globe className="h-3.5 w-3.5" />
          {country ? `Detected country: ${flag} ${country}. ` : ""}
          Showing {currency === "INR" ? "₹ INR" : "$ USD"} prices.
        </p>

        <div
          className="flex gap-1"
          role="group"
          aria-label="Choose pricing currency"
        >
          {(["INR", "USD"] as Currency[]).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={currency === c ? "default" : "outline"}
              aria-pressed={currency === c}
              disabled={upgradingCode !== null}
              onClick={() => setCurrency(c)}
            >
              {c === "INR" ? "₹ INR" : "$ USD"}
            </Button>
          ))}
        </div>
      </div>

      {currency === "USD" && (
        <p className="text-xs text-ink-faint">
          You&apos;re charged in USD. Your bank or card provider may convert the
          amount to your local currency and add its own fees.
        </p>
      )}

      {activePaidPlan && (
        <p className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink-muted">
          You already have an active {subscription?.plan.name} plan. You can&apos;t purchase or switch plans until this plan expires
          {subscription?.currentPeriodEnd ? ` on ${formatDate(subscription.currentPeriodEnd)}` : ""}. Your current plan and features remain active until then.
        </p>
      )}

      {usdUnavailable && (
        <p className="rounded-[var(--radius-md)] border border-border bg-surface-raised px-3 py-2 text-xs text-ink-muted">
          International (USD) checkout isn&apos;t available yet. You can switch to
          INR to pay now, or contact support to be notified when USD billing
          opens.
        </p>
      )}

      {!pricesMatch && !usdUnavailable && (
        <p className="rounded-[var(--radius-md)] border border-border bg-surface-raised px-3 py-2 text-xs text-ink-muted">
          Prices in {currency} aren&apos;t available right now. Please choose
          another currency.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan.code === plan.code;
          const isFree = plan.code === "FREE";
          const busy = upgradingCode === plan.code;

          return (
            <Card key={plan.id} className={isCurrent ? "border-brand" : undefined}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.amountCents === 0
                    ? "Free"
                    : !pricesMatch
                      ? `Not available in ${currency}`
                      : `${formatMoney(plan.amountCents, plan.currency)} / ${plan.interval}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <ul className="space-y-1.5 text-sm text-ink-muted">
                  <PlanLimit label="Websites" value={plan.websiteLimit} />
                  <PlanLimit label="Scans / mo" value={plan.scanLimit} />
                  <PlanLimit label="AI requests / mo" value={plan.aiRequestLimit} />
                  <PlanLimit label="Reports / mo" value={plan.reportLimit} />
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrent ? "secondary" : "default"}
                  disabled={
                    isCurrent ||
                    upgradingCode !== null ||
                    activePaidPlan ||
                    (!isFree && checkoutBlocked)
                  }
                  onClick={() => handleUpgrade(plan.code)}
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isCurrent
                    ? "Current plan"
                    : activePaidPlan
                      ? "Available after expiry"
                      : !isFree && checkoutBlocked
                        ? "Unavailable"
                        : "Choose plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PlanLimit({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-3.5 w-3.5 text-minor" />
      {value === -1 ? "Unlimited" : value} {label}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Payment history + invoices                                                 */
/* -------------------------------------------------------------------------- */

function HistoryTab() {
  const { data: payments, isLoading: loadingPayments } = usePaymentHistory();
  const { data: invoices, isLoading: loadingInvoices } = useInvoices();
  const { user } = useAuth();
  const retryPayment = useRetryPayment();
  const queryClient = useQueryClient();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Retrying used to create a new order and then do nothing with it. Now the
  // checkout actually opens, and the result is verified like a normal payment.
  const handleRetry = async (paymentId: string) => {
    if (retryingId) return;
    setRetryingId(paymentId);

    let order;
    try {
      order = await retryPayment.mutateAsync(paymentId);
    } catch {
      setRetryingId(null); // hook already toasted
      return;
    }

    try {
      await openRazorpayCheckout({
        keyId: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Accewa",
        description: "Retry payment",
        order_id: order.orderId,
        prefill: { email: user?.email },
        theme: { color: "#2A4CDB" },

        handler: async (response) => {
          try {
            await paymentsApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            queryClient.invalidateQueries({ queryKey: ["billing"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            toast.success("Payment received.");
          } catch (error) {
            toast.error(
              getApiErrorMessage(
                error,
                "We couldn't confirm that payment. Contact support if you were charged.",
              ),
            );
          } finally {
            setRetryingId(null);
          }
        },

        modal: { ondismiss: () => setRetryingId(null) },
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't open checkout. Please try again."));
      setRetryingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loadingPayments ? (
            <Skeleton className="m-6 h-24" />
          ) : !payments || payments.length === 0 ? (
            <p className="border-t border-border px-6 py-8 text-center text-sm text-ink-muted">
              No payments yet.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {payments.map((payment: Payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {formatMoney(payment.amountCents, payment.currency)}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <PaymentStatusBadge status={payment.status} />

                    {payment.status === "FAILED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Retry payment"
                        disabled={retryingId !== null}
                        onClick={() => handleRetry(payment.id)}
                      >
                        {retryingId === payment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loadingInvoices ? (
            <Skeleton className="m-6 h-24" />
          ) : !invoices || invoices.length === 0 ? (
            <p className="border-t border-border px-6 py-8 text-center text-sm text-ink-muted">
              No invoices yet.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {invoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {formatMoney(invoice.amountDueCents, invoice.currency)}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {formatDate(invoice.issuedAt)}
                    </p>
                  </div>

                  {invoice.hostedUrl ? (
                    <a href={invoice.hostedUrl} target="_blank" rel="noreferrer">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Download invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  ) : (
                    <Badge variant="outline">{invoice.status}</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "critical" | "outline" | "neutral"> = {
    SUCCEEDED: "success",
    FAILED: "critical",
    PENDING: "outline",
    REFUNDED: "neutral",
  };

  return <Badge variant={map[status] ?? "neutral"}>{status}</Badge>;
}

function metricLabel(metric: string) {
  return (
    {
      WEBSITES: "Websites",
      SCANS: "Scans",
      AI_REQUESTS: "AI requests",
      REPORTS: "Reports",
    }[metric] ?? metric
  );
}
