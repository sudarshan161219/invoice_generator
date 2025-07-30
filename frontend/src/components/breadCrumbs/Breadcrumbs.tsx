import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";

const breadcrumbNameMap: Record<string, string> = {
  invoices: "Invoices",
  new: "New",
  clients: "Clients",
  client: "Client",
  attachments: "Attachments",
  payments: "Payments",
  settings: "Settings",
  help: "Help",
  "reset-password": "Reset Password",
  "forgot-password": "Forgot Password",
  oauth: "OAuth",
  github: "GitHub",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const { clientName } = useInvoiceClient();
  const pathnames = location.pathname.split("/").filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <nav className={styles.nav}>
      <ol className="flex items-center flex-wrap space-x-2">
        <li>
          <Link to="/" className={styles.link}>
            Dashboard
          </Link>
        </li>
        {pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;
          let label = breadcrumbNameMap[segment] || decodeURIComponent(segment);
          let routeTo = "/" + pathnames.slice(0, index + 1).join("/");

          if (/^\d+$/.test(segment) && pathnames[index - 1] === "client") {
            label = clientName || "Client";
          }

          if (/^\d+$/.test(segment) && pathnames[index - 1] === "attachments") {
            label = "Attachments";
          }

          // ✅ Force `/client` to render as "Clients" and link to `/clients`
          if (segment === "client" && pathnames.length === 2) {
            label = "Clients";
            routeTo = "/clients";
          }

          if (segment === "attachments" && pathnames.length === 2) {
            label = "Client";
            routeTo = `/client/${clientId}`;
          }

          return (
            <li key={routeTo} className="flex items-center space-x-2">
              <span className="mx-1">
                <ChevronRight size={15} />
              </span>
              {isLast ? (
                <span className={styles.label}>{label}</span>
              ) : (
                <Link to={routeTo} className={styles.link}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
