import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/button/Button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SettingsPage = () => {
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    // Call API here to save settings
    console.log("Settings saved");
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="business">
        <TabsList className="mb-6">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Business Name</Label>
                <Input placeholder="Enter business name" />
              </div>
              <div>
                <Label>Business Address</Label>
                <Textarea placeholder="Enter address" />
              </div>
              <div>
                <Label>Logo Upload</Label>
                <Input type="file" />
              </div>
              <Button onClick={handleSave}>Save Business Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Settings */}
        <TabsContent value="invoice">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Invoice Prefix</Label>
                <Input placeholder="e.g. INV-" />
              </div>
              <div>
                <Label>Default Due Days</Label>
                <Input type="number" placeholder="30" />
              </div>
              <div>
                <Label>Default Notes</Label>
                <Textarea placeholder="Thank you for your business!" />
              </div>
              <Button onClick={handleSave}>Save Invoice Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Default Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Stripe Payments</Label>
                <Switch
                  checked={stripeEnabled}
                  onCheckedChange={setStripeEnabled}
                />
              </div>
              <Button onClick={handleSave}>Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Email me when a client views an invoice</p>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <p>Email me when an invoice is paid</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <p>Send overdue reminders automatically</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <p>Notify me about new features</p>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
