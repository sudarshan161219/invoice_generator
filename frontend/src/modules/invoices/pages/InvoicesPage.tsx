import type { FC, ReactElement } from "react";
import { EmptyState } from "@/components/EmptyState/EmptyState";

export const InvoicesPage: FC = (): ReactElement => {
  return (
    <EmptyState
      title="No invoices found"
      description="Looks like you haven’t created any invoices yet."
      buttonText="Create Invoice"
      redirectTo="/invoices/new"
    />
  );
};
