import { Button } from "@/components/button/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import styles from "./index.module.css";

type Subscription = {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  currentPeriodEnd: string; // ISO
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

const useSubscription = () =>
  useQuery<Subscription>({
    queryKey: ["settings", "subscription"],
    queryFn: () => api("/api/subscription"),
  });

function useCreateCheckout() {
  return useMutation({
    mutationFn: async (plan: "pro" | "enterprise") => {
      const { url } = await api<{ url: string }>(`/api/subscription/checkout`, {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      window.location.href = url; // Stripe/Razorpay Checkout
    },
  });
}

function useBillingPortal() {
  return useMutation({
    mutationFn: async () => {
      const { url } = await api<{ url: string }>("/api/subscription/portal", {
        method: "POST",
      });
      window.location.href = url; // Manage billing/payment method
    },
  });
}
export const SubscriptionTab = () => {
  const { data, isLoading } = useSubscription();
  const checkout = useCreateCheckout();
  const portal = useBillingPortal();

  return (
    <div className={styles.card}>
      <CardHeader>
        <SectionHeader
          title="Subscription"
          desc="Manage your plan, payments and invoices."
        />
      </CardHeader>
      <div className={styles.sectionContainer}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="text-lg font-semibold capitalize">
              {data?.plan ?? "free"}
            </div>
            {data?.status && (
              <div className="text-xs text-muted-foreground">
                Status: {data.status}
              </div>
            )}
            {data?.currentPeriodEnd && (
              <div className="text-xs text-muted-foreground">
                Renews: {new Date(data.currentPeriodEnd).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => portal.mutate()} variant="outline">
              Manage Billing
            </Button>
            <Button onClick={() => checkout.mutate("pro")}>
              Upgrade to Pro
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-muted">
            Pro includes: unlimited invoices, custom branding, payment
            reminders.
          </div>
          <div className="p-3 rounded-xl bg-muted">
            Enterprise: SSO, priority support, team roles & audit logs.
          </div>
        </div>
      </div>
    </div>
  );
};
