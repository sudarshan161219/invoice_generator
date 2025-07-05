import { type FC, type ReactElement } from "react";
import { InvoicesTable } from "../components/invoicesTable/InvoicesTable";
import { InvoiceStatusPieChart } from "../components/invoiceStatusPieChart/InvoiceStatusPieChart";
import { RevenueChart } from "../components/revenueChart/RevenueChart";
import { Card } from "@/components/card/Card";

type CardMetric = {
  title: string;
  amount: string;
  trend: "up" | "down";
  trendPercent: string;
  highlight: string;
  description: string;
};

const cardMetrics: CardMetric[] = [
  {
    title: "Total Revenue",
    amount: "$12,500.00",
    trend: "up",
    trendPercent: "+12.5%",
    highlight: "Revenue increasing steadily",
    description: "Based on paid invoices this month",
  },
  {
    title: "Paid Invoices",
    amount: "32",
    trend: "up",
    trendPercent: "+8.3%",
    highlight: "Collection rate improving",
    description: "Paid invoices are up compared to last month",
  },
  {
    title: "Pending Invoices",
    amount: "14",
    trend: "down",
    trendPercent: "-5.2%",
    highlight: "Payments awaiting action",
    description: "Follow up with clients to reduce delays",
  },
  {
    title: "Overdue Invoices",
    amount: "5",
    trend: "down",
    trendPercent: "-2.1%",
    highlight: "Attention needed on overdue invoices",
    description: "Consider sending reminders or penalties",
  },
];

export const DashboardPage: FC = (): ReactElement => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-5">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-2  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-4 ">
          {cardMetrics.map((item, idx) => (
            <Card
              key={idx}
              title={item.title}
              growth={item.trendPercent}
              trend={item.trend}
              amount={item.amount}
              description={item.description}
            />
          ))}
        </div>

        <InvoicesTable />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-7">
          <InvoiceStatusPieChart />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};
