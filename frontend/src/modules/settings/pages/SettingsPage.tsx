import { ProfileTab } from "../components/Profile/ProfileForm";
import { CompanyTab } from "../components/Company/CompanyForm";
import { PreferencesTab } from "../components/Preferences/PreferencesForm";
import { PaymentTab } from "../components/Payments/PaymentsIntegration";
import { SubscriptionTab } from "../components/Subscription/SubscriptionPanel";
import { NotificationsTab } from "../components/Notifications/NotificationsForm";
import { Tabs } from "../components/Tabs/Tabs";

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
    <div className="px-6">
      <Tabs
        tabs={tabData}
        defaultTabId={1}
        variant="default"
        persistPath="/settings"
      />
    </div>
  );
};
