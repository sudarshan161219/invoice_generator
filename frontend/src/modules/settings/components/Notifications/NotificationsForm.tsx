import { Button } from "@/components/button/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@radix-ui/react-switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const notificationSchema = z.object({
  emailPaymentReceived: z.boolean().default(true),
  emailInvoiceOverdue: z.boolean().default(true),
  emailSubscriptionEvents: z.boolean().default(true),
  pushReminders: z.boolean().default(false),
});

type NotificationForm = z.infer<typeof notificationSchema>;

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

function useUpdateNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NotificationForm) =>
      api("/api/settings/notifications", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["settings", "notifications"] }),
  });
}

const useNotifications = () =>
  useQuery<NotificationForm>({
    queryKey: ["settings", "notifications"],
    queryFn: () => api("/api/settings/notifications"),
  });

export const NotificationsTab = () => {
  const { data, isLoading } = useNotifications();
  const { mutateAsync, isPending } = useUpdateNotifications();
  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    values: data,
  });

  const onSubmit = async (values: NotificationForm) => {
    await mutateAsync(values);
    toast.success("Notification preferences saved");
  };

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

  if (isLoading) return <Loading />;

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          icon={Bell}
          title="Notifications"
          desc="Choose how you want to be notified."
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border p-3">
            <div>
              <div className="font-medium">Payment received (email)</div>
              <div className="text-sm text-muted-foreground">
                When a client pays an invoice.
              </div>
            </div>
            <Switch
              checked={form.watch("emailPaymentReceived")}
              onCheckedChange={(v) => form.setValue("emailPaymentReceived", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-3">
            <div>
              <div className="font-medium">Invoice overdue (email)</div>
              <div className="text-sm text-muted-foreground">
                Remind you when invoices pass the due date.
              </div>
            </div>
            <Switch
              checked={form.watch("emailInvoiceOverdue")}
              onCheckedChange={(v) => form.setValue("emailInvoiceOverdue", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-3">
            <div>
              <div className="font-medium">Subscription events (email)</div>
              <div className="text-sm text-muted-foreground">
                Renewals, payment failures, plan changes.
              </div>
            </div>
            <Switch
              checked={form.watch("emailSubscriptionEvents")}
              onCheckedChange={(v) =>
                form.setValue("emailSubscriptionEvents", v)
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-3">
            <div>
              <div className="font-medium">Reminders (push)</div>
              <div className="text-sm text-muted-foreground">
                Daily/weekly pending invoice reminders.
              </div>
            </div>
            <Switch
              checked={form.watch("pushReminders")}
              onCheckedChange={(v) => form.setValue("pushReminders", v)}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
