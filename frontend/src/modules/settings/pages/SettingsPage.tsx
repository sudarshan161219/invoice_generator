import { ProfileTab } from "../components/Profile/ProfileForm";
import { CompanyTab } from "../components/Company/CompanyForm";
import { PreferencesTab } from "../components/Preferences/PreferencesForm";
import { PaymentTab } from "../components/Payments/PaymentsIntegration";
import { SubscriptionTab } from "../components/Subscription/SubscriptionPanel";
import { NotificationsTab } from "../components/Notifications/NotificationsForm";
import { Tabs } from "@/components/tab/Tab";

const tabData = [
  {
    id: 1,
    label: "Profile",
    content: <ProfileTab />,
  },
  {
    id: 2,
    label: "Company",
    content: <CompanyTab />,
  },
  {
    id: 3,
    label: "Invoice Defaults",
    content: <PreferencesTab />,
  },
  {
    id: 4,
    label: "Payments",
    content: <PaymentTab />,
  },
  {
    id: 5,
    label: "Subscription",
    content: <SubscriptionTab />,
  },
  {
    id: 6,
    label: "Notifications",
    content: <NotificationsTab />,
  },
];

export const SettingsPage = () => {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your account, invoice defaults, payments, and
            notifications.
          </p>
        </div>
      </div>

      <Tabs tabs={tabData} variant="outline" />
    </div>
  );
};
