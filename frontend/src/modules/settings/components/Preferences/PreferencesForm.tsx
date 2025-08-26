import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import styles from "./index.module.css";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const preferencesSchema = z.object({
  invoicePrefix: z.string().min(1).max(10),
  taxRate: z.coerce.number().min(0).max(100).nullable().optional(),
  defaultDueDays: z.coerce.number().min(0).max(365).nullable().optional(),
  defaultCurrency: z.string().min(1),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  defaultInvoiceFooter: z.string().max(1000).optional(),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

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

const usePreferences = () =>
  useQuery<PreferencesForm>({
    queryKey: ["settings", "preferences"],
    queryFn: () => api("/api/settings/preferences"),
  });

function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PreferencesForm) =>
      api("/api/settings/preferences", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["settings", "preferences"] }),
  });
}

export const PreferencesTab = () => {
  const { data, isLoading } = usePreferences();
  const { mutateAsync, isPending } = useUpdatePreferences();
  const form = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    values: data,
  });

  const onSubmit = async (values: PreferencesForm) => {
    await mutateAsync(values);
    toast.success("Invoice defaults saved");
  };

  return (
    <div className={styles.card}>
      <CardHeader>
        <SectionHeader
          title="Invoice Defaults"
          desc="Defaults applied when creating new invoices."
        />
      </CardHeader>
      <div className={styles.sectionContainer}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <Input
              label="Invoice Prefix"
              placeholder="INV"
              {...form.register("invoicePrefix")}
            />
          </div>

          <div className="space-y-2">
            <Label className={styles.label}>Default Currency</Label>
            <Select
              onValueChange={(v) => form.setValue("defaultCurrency", v)}
              value={form.watch("defaultCurrency")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.defaultCurrency && (
              <p className="text-sm text-red-500">
                {form.formState.errors.defaultCurrency.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              step="0.01"
              placeholder="18"
              label="Tax Rate (%)"
              {...form.register("taxRate")}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="30"
              label="Default Due (days)"
              {...form.register("defaultDueDays")}
            />
          </div>

          <div className="space-y-2">
            <Label className={styles.label}>Date Format</Label>
            <Select
              onValueChange={(v) => form.setValue("dateFormat", v as any)}
              value={form.watch("dateFormat")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className={styles.label}>Default Invoice Footer / Terms</Label>
            <Textarea
              rows={4}
              placeholder="Thank you for your business..."
              {...form.register("defaultInvoiceFooter")}
            />
          </div>

          <div className="sm:col-span-2">
            <Button size="md" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Save Defaults
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
