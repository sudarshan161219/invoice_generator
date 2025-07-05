import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./index.module.css";

const breadcrumbNameMap: Record<string, string> = {
  invoices: "Invoices",
  new: "New",
  clients: "Clients",
  client: "Client",
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
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          const label =
            breadcrumbNameMap[segment] || decodeURIComponent(segment);

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
