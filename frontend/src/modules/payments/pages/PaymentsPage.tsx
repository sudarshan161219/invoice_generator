import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const PaymentsPage = () => {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="p-4">
      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Plan:</strong> Free
          </p>
          <p>
            <strong>Next Billing:</strong> N/A
          </p>
        </CardContent>
        <CardFooter>
          <Button>Upgrade to Pro</Button>
        </CardFooter>
      </Card>

      {/* Billing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p>Enable Auto-Renewal</p>
          <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
