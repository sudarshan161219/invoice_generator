import { useState, useEffect, type FC, type ReactElement } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";

export const MainHeading: FC = (): ReactElement => {
  const location = useLocation();
  const [heading, setHeading] = useState("Overview");
  // Attachments
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/client/")) {
      const id = path.split("/client/")[1]; // e.g., "123"
      if (id && /^\d+$/.test(id)) {
        setHeading(`Client details`);
        return;
      }
    }

    if (path.startsWith("/attachments/")) {
      const id = path.split("/attachments/")[1]; // e.g., "123"
      if (id && /^\d+$/.test(id)) {
        setHeading(`Attachments`);
        return;
      }
    }

    const pathToHeadingMap: Record<string, string> = {
      "/": "Overview",
      "/clients": "Clients",
      "/invoices": "Invoices",
      "/invoices/new": "Create Invoice",
      "/clients/new": "Create Client",
      "/settings": "Settings",
      "/profile": "Your Profile",
    };

    const title = pathToHeadingMap[location.pathname] || "Overview";
    setHeading(title);
  }, [location.pathname]);

  return (
    <div className="hidden md:inline">
      <h1 className="mainHeading text-accent-foreground">{heading}</h1>
    </div>
  );
};
