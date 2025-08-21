import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const InvoicePaymentPage = () => {
  const invoice = {
    id: "INV-001",
    client: "John Doe",
    amount: 250,
    dueDate: "2025-09-01",
    status: "Unpaid",
  };

  const handlePayNow = () => {
    // For now just mock it
    alert("Redirecting to payment...");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Invoice #{invoice.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Client:</strong> {invoice.client}
          </p>
          <p>
            <strong>Amount:</strong> ${invoice.amount}
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePayNow}>
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
