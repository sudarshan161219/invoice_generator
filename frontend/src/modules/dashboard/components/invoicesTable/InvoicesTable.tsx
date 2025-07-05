import { type FC, type ReactElement } from "react";
import { Table } from "@/components/table/Table";
import { MoreVertical, Copy } from "lucide-react";
import type { Column } from "@/types/table.types";

type Invoice = {
  invoice: string;
  client: string;
  email: string;
  paymentStatus: "Paid" | "Unpaid" | "Overdue";
  bg: string;
  totalAmount: string;
  paymentMethod: string;
  due: string;
};

const invoices: Invoice[] = [
  {
    invoice: "INV001",
    client: "Acme Corp",
    email: "john.doe@example.com",
    paymentStatus: "Paid",
    bg: "bg-green-300",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    due: "2025-05-01",
  },
  {
    invoice: "INV002",
    client: "Globex Ltd",
    email: "sophia.williams@freelancehub.com",
    paymentStatus: "Overdue",
    bg: "bg-yellow-200",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    due: "2025-05-10",
  },
  {
    invoice: "INV003",
    client: "Soylent Inc",
    email: "michael.smith@startupzone.io",
    paymentStatus: "Unpaid",
    bg: "bg-red-400",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    due: "2025-04-28",
  },
  {
    invoice: "INV004",
    client: "Initech",
    paymentStatus: "Paid",
    email: "emily.james@businessmail.org",
    bg: "bg-green-300",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    due: "2025-05-03",
  },
  {
    invoice: "INV005",
    client: "Umbrella Co",
    email: "david.lee@consultancypro.net",
    paymentStatus: "Paid",
    bg: "bg-green-300",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    due: "2025-04-30",
  },
];

const statusColorMap: Record<Invoice["paymentStatus"], string> = {
  Paid: "border-[var(--status-paid-border)] text-[var(--status-paid-text)]",
  Unpaid:
    "border-[var(--status-unpaid-border)] text-[var(--status-unpaid-text)]",
  Overdue:
    "border-[var(--status-overdue-border)] text-[var(--status-overdue-text)]",
};

const invoiceColumns: Column<Invoice>[] = [
  { key: "invoice", title: "Invoice ID" },
  { key: "client", title: "Client" },
  {
    key: "email",
    title: "Email",
    render: (invoice) => (
      <div className="flex items-center gap-2">
        <span>{invoice.email}</span>
        <CopyButton value={invoice.email} />
      </div>
    ),
  },
  {
    key: "paymentStatus",
    title: "Status",
    render: (invoice) => (
      <span
        className={`px-2.5 py-0.5  border rounded-md text-xs font-medium ${
          statusColorMap[invoice.paymentStatus]
        }`}
      >
        {invoice.paymentStatus}
      </span>
    ),
  },
  { key: "totalAmount", title: "Amount" },
  { key: "paymentMethod", title: "Method" },
  {
    key: "due",
    title: "Due Date",
    render: (value) => new Date(value.due).toLocaleDateString(),
  },
  {
    key: "actions",
    title: "Actions",
    render: () => (
      <div className="space-x-2">
        <button className="hover:text-gray-800">
          <MoreVertical size={18} />
        </button>
      </div>
    ),
  },
];

function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      console.log("Copied to clipboard:", value);
      // Optional: use toast("Copied!") here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-gray-400 hover:text-gray-600"
      title="Copy to clipboard"
    >
      <Copy size={16} />
    </button>
  );
}

export const InvoicesTable: FC = (): ReactElement => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Recent Invoices</h2>

      <Table
        data={invoices}
        columns={invoiceColumns}
        rowKey={(c) => c.invoice}
      />
    </div>
  );
};
