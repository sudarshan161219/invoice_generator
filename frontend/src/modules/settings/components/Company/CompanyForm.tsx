import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import styles from "./index.module.css";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";

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

  const openModal = (name: string) => {
    console.log(name);
  };

  return (
    <div className={styles.card}>
      <CardHeader>
        <SectionHeader
          // icon={Building2}
          title="Company"
          desc="Your business details for invoices and communications."
        />
      </CardHeader>
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Address</h1>
              <p>{"Not set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("name")}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Phone (optional)</h1>
              <p>{"not Set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("email")}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Website (optional)</h1>
              <p>{"not Set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("email")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


  //  <form
  //         onSubmit={form.handleSubmit(onSubmit)}
  //         className="grid gap-4 sm:grid-cols-2"
  //       >
  //         <div className="space-y-2 sm:col-span-2">
  //           <Label>Address</Label>
  //           <Textarea
  //             rows={3}
  //             placeholder="Street, City, State, ZIP"
  //             {...form.register("address")}
  //           />
  //         </div>
  //         <div className="space-y-2">
  //           <Input label="Phone" {...form.register("phone")} />
  //         </div>
  //         <div className="space-y-2">
  //           <Input
  //             label="Website"
  //             placeholder="https://"
  //             {...form.register("website")}
  //           />
  //         </div>
  //         <div className="sm:col-span-2">
  //           <Button size="md" type="submit">
  //             Save
  //           </Button>
  //         </div>
  //       </form>