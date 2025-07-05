import { type FC, type ReactElement, useState } from "react";
import "./index.css";

type Tab = {
  label: string;
  count: number;
};

const tabs: Tab[] = [
  { label: "All Clients", count: 20 },
  { label: "New Clients", count: 5 },
];

export const Tabs: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  return (
    <div>
      <div className="flex flex-row gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`tabs text-sm text-accent-foreground cursor-pointer ${
              activeTab === tab.label
                ? "border-b-2 1px solid border-gray-500"
                : "none"
            }`}
          >
            {tab.label} <span className="tab-span-text ">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* <div>
        <h2>{activeTab} Content</h2>
        <p>This is the content for the "{activeTab}" tab.</p>
      </div> */}
    </div>
  );
};
