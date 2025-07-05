import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const HelpItem = ({ title, content }: { title: string; content: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && <p className="mt-2 text-gray-600">{content}</p>}
    </div>
  );
};

export const HelpPage = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Help & Support</h1>

      <div className="space-y-4">
        <HelpItem
          title="How do I create an invoice?"
          content="Go to the dashboard, click 'New Invoice', fill in client details, items, and save. You can then download or send it."
        />
        <HelpItem
          title="How does the client pay?"
          content="You can either collect payment manually (like UPI or cash), or enable Stripe/Razorpay so they can pay directly online."
        />
        <HelpItem
          title="How to mark an invoice as paid?"
          content="Open the invoice from your dashboard and click the 'Mark as Paid' button. Add payment method and date if required."
        />
        <HelpItem
          title="How to download a PDF of the invoice?"
          content="Click on the invoice, then use the 'Download PDF' button to get a copy."
        />
        <HelpItem
          title="How can I contact support?"
          content="You can email us at support@yourdomain.com or WhatsApp us at +91-XXXX-XXXXXX."
        />
        <HelpItem
          title="Where can I read the privacy policy?"
          content="Visit our Privacy Policy and Terms of Service at the bottom of this page or go to /privacy-policy and /terms."
        />
      </div>
    </div>
  );
};
