import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, PlugZap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/button/Button";

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

type PaymentConnections = {
  stripeConnected: boolean;
  razorpayConnected: boolean;
  stripeAccountId?: string | null;
  razorpayAccountId?: string | null;
};

const usePaymentConnections = () =>
  useQuery<PaymentConnections>({
    queryKey: ["settings", "payments"],
    queryFn: () => api("/api/settings/payments"),
  });

function useConnectStripe() {
  return useMutation({
    mutationFn: async () => {
      const { url } = await api<{ url: string }>(
        "/api/payments/stripe/connect-link",
        { method: "POST" }
      );
      window.location.href = url; // redirect to Stripe onboarding / account link
    },
  });
}

function useConnectRazorpay() {
  return useMutation({
    mutationFn: async () => {
      const { url } = await api<{ url: string }>(
        "/api/payments/razorpay/connect-link",
        { method: "POST" }
      );
      window.location.href = url; // redirect to Razorpay onboarding
    },
  });
}

function SectionHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<any>;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-2xl bg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
    </div>
  );
}

export const PaymentTab = () => {
  const { data, isLoading, refetch } = usePaymentConnections();
  const connectStripe = useConnectStripe();
  const connectRazorpay = useConnectRazorpay();

  if (isLoading) return <Loading />;

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          icon={PlugZap}
          title="Payment Integrations"
          desc="Connect Stripe or Razorpay to receive payments from invoices."
        />
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <motion.div whileHover={{ y: -2 }} className="border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Stripe</h4>
            <span
              className={`text-xs px-2 py-1 rounded ${
                data?.stripeConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data?.stripeConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Onboard or manage your Stripe account to enable card payments
            globally.
          </p>
          <div className="flex gap-2">
            <Button
              size="md"
              onClick={() => connectStripe.mutate()}
              disabled={connectStripe.isPending}
            >
              {connectStripe.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              {data?.stripeConnected ? "Manage" : "Connect Stripe"}
            </Button>
            {data?.stripeConnected && (
              <Button size="md" variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            )}
          </div>
          {data?.stripeAccountId && (
            <p className="text-xs mt-3 text-muted-foreground">
              Account: {data.stripeAccountId}
            </p>
          )}
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Razorpay</h4>
            <span
              className={`text-xs px-2 py-1 rounded ${
                data?.razorpayConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data?.razorpayConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Razorpay account for UPI, cards and popular Indian
            payment methods.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => connectRazorpay.mutate()}
              disabled={connectRazorpay.isPending}
            >
              {connectRazorpay.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              {data?.razorpayConnected ? "Manage" : "Connect Razorpay"}
            </Button>
            {data?.razorpayConnected && (
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            )}
          </div>
          {data?.razorpayAccountId && (
            <p className="text-xs mt-3 text-muted-foreground">
              Account: {data.razorpayAccountId}
            </p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};
