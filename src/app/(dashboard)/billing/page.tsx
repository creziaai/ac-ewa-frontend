"use client";

import { useState } from "react";
import { Check, Download, Loader2, RefreshCcw } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Billing
        </h1>

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

                <Badge
                  variant={
                    subscription.status === "ACTIVE"
                      ? "success"
                      : "outline"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>

              <p className="text-sm text-ink-muted">
                {formatMoney(
                  subscription.plan.amountCents,
                  subscription.plan.currency,
                )}{" "}
                / {subscription.plan.interval}
              </p>

              {subscription.currentPeriodEnd && (
                <p className="text-xs text-ink-faint">
                  {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              )}

              {!subscription.cancelAtPeriodEnd &&
                subscription.plan.code !== "FREE" && (
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
            <p className="text-sm text-ink-muted">
              No active subscription found.
            </p>
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
                  : Math.min(
                      100,
                      (item.used / item.limit) * 100,
                    );

              return (
                <div key={item.metric}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-ink-muted">
                      {metricLabel(item.metric)}
                    </span>

                    <span className="font-mono-tabular text-ink-faint">
                      {item.used} /{" "}
                      {unlimited ? "∞" : item.limit}
                    </span>
                  </div>

                  <Progress
                    value={unlimited ? 8 : pct}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PlansTab() {
  const {
    data: plans,
    isLoading,
    isError,
    refetch,
  } = usePlans();

  const { data: subscription } = useSubscription();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();

  const [upgradingCode, setUpgradingCode] =
    useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-64 w-full"
          />
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
          <Button
            variant="outline"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleUpgrade = async (planCode: string) => {
    if (planCode === "FREE") {
      try {
        await billingApi.upgrade(planCode);

        queryClient.invalidateQueries({
          queryKey: ["billing"],
        });

        toast.success(
          "Switched to the Free plan.",
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(error),
        );
      }

      return;
    }

    setUpgradingCode(planCode);

    try {
      const order =
        await createOrder.mutateAsync(planCode);

      await openRazorpayCheckout({
        keyId:
          order.keyId ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "",

        amount: order.amount,
        currency: order.currency,

        name: "Accewa",

        description: `Upgrade to ${planCode}`,

        order_id: order.orderId,

        prefill: {
          email: user?.email,
        },

        theme: {
          color: "#2A4CDB",
        },

        handler: async (response) => {
          try {
            await paymentsApi.verify({
              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,
            });

            await billingApi.upgrade(
              planCode,
            );

            queryClient.invalidateQueries({
              queryKey: ["billing"],
            });

            queryClient.invalidateQueries({
              queryKey: ["payments"],
            });

            toast.success(
              `Upgraded to ${planCode}.`,
            );
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

        modal: {
          ondismiss: () =>
            setUpgradingCode(null),
        },
      });
    } catch {
      setUpgradingCode(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const isCurrent =
          subscription?.plan.code === plan.code;

        return (
          <Card
            key={plan.id}
            className={
              isCurrent
                ? "border-brand"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle>
                {plan.name}
              </CardTitle>

              <CardDescription>
                {plan.amountCents === 0
                  ? "Free"
                  : formatMoney(
                      plan.amountCents,
                      plan.currency,
                    )}

                {plan.amountCents > 0 &&
                  ` / ${plan.interval}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <ul className="space-y-1.5 text-sm text-ink-muted">
                <PlanLimit
                  label="Websites"
                  value={plan.websiteLimit}
                />

                <PlanLimit
                  label="Scans / mo"
                  value={plan.scanLimit}
                />

                <PlanLimit
                  label="AI requests / mo"
                  value={plan.aiRequestLimit}
                />

                <PlanLimit
                  label="Reports / mo"
                  value={plan.reportLimit}
                />
              </ul>

              <Button
                className="w-full"
                variant={
                  isCurrent
                    ? "secondary"
                    : "default"
                }
                disabled={
                  isCurrent ||
                  upgradingCode === plan.code
                }
                onClick={() =>
                  handleUpgrade(plan.code)
                }
              >
                {upgradingCode ===
                  plan.code && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {isCurrent
                  ? "Current plan"
                  : "Choose plan"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PlanLimit({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-3.5 w-3.5 text-minor" />

      {value === -1
        ? "Unlimited"
        : value}{" "}
      {label}
    </li>
  );
}

function HistoryTab() {
  const {
    data: payments,
    isLoading: loadingPayments,
  } = usePaymentHistory();

  const {
    data: invoices,
    isLoading: loadingInvoices,
  } = useInvoices();

  const retryPayment =
    useRetryPayment();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loadingPayments ? (
            <Skeleton className="m-6 h-24" />
          ) : !payments ||
            payments.length === 0 ? (
            <p className="border-t border-border px-6 py-8 text-center text-sm text-ink-muted">
              No payments yet.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {payments.map(
                (payment: Payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {formatMoney(
                          payment.amountCents,
                          payment.currency,
                        )}
                      </p>

                      <p className="text-xs text-ink-faint">
                        {formatDate(
                          payment.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <PaymentStatusBadge
                        status={payment.status}
                      />

                      {payment.status ===
                        "FAILED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Retry payment"
                          onClick={() =>
                            retryPayment.mutate(
                              payment.id,
                            )
                          }
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ),
              )}
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
          ) : !invoices ||
            invoices.length === 0 ? (
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
                      {formatMoney(
                        invoice.amountDueCents,
                      )}
                    </p>

                    <p className="text-xs text-ink-faint">
                      {formatDate(
                        invoice.issuedAt,
                      )}
                    </p>
                  </div>

                  {invoice.hostedUrl ? (
                    <a
                      href={invoice.hostedUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Download invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  ) : (
                    <Badge variant="outline">
                      {invoice.status}
                    </Badge>
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

function PaymentStatusBadge({
  status,
}: {
  status: string;
}) {
  const map: Record<
    string,
    "success" | "critical" | "outline" | "neutral"
  > = {
    SUCCEEDED: "success",
    FAILED: "critical",
    PENDING: "outline",
    REFUNDED: "neutral",
  };

  return (
    <Badge
      variant={map[status] ?? "neutral"}
    >
      {status}
    </Badge>
  );
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