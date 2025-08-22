import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/input/Input";
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

export const CompanyTab = () => {
  // Optional: fetch existing company info from /api/settings/company
  const form = useForm<{ address?: string; phone?: string; website?: string }>({
    defaultValues: {},
  });

  const onSubmit = async (values: {
    address?: string;
    phone?: string;
    website?: string;
  }) => {
    await api("/api/settings/company", {
      method: "PUT",
      body: JSON.stringify(values),
    });
    toast.success("Company info updated");
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

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          icon={Building2}
          title="Company"
          desc="Your business details for invoices and communications."
        />
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea
              rows={3}
              placeholder="Street, City, State, ZIP"
              {...form.register("address")}
            />
          </div>
          <div className="space-y-2">
            <Input label="Phone" {...form.register("phone")} />
          </div>
          <div className="space-y-2">
            <Input
              label="Website"
              placeholder="https://"
              {...form.register("website")}
            />
          </div>
          <div className="sm:col-span-2">
            <Button size="md" type="submit">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
