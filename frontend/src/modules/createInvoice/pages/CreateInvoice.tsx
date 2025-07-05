import { type FC, type ReactElement, useState } from "react";
import { InvoiceForm } from "../components/export.ts";
import { Tabs } from "@/components/tab/Tab.tsx";
import type { Tab } from "@/components/tab/types/tab.types.ts";
import { InvoicePreview } from "../components/export.ts";
import type { Invoice } from "../types/invoice";

export const CreateInvoice: FC = (): ReactElement => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const tabData: Tab[] = [
    {
      id: 1,
      label: "Create",
      icon: undefined,
      content: <InvoiceForm onChange={setInvoice} />,
    },
    {
      id: 2,
      label: "Preview",
      icon: undefined,
      content: invoice ? (
        <InvoicePreview invoice={invoice} />
      ) : (
        <p>No invoice data</p>
      ),
    },
  ];

  return (
    <div className="min-h-screen  w-full">
      <Tabs tabs={tabData} mode={"default"} />
    </div>
  );
};
