import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const APP_NAME = "Invii - Invoicing Simplified";

export function AppTitle() {
  const location = useLocation();
  let pageTitle = "";

  switch (location.pathname) {
    case "/":
      pageTitle = APP_NAME;
      break;
    case "/invoices":
      pageTitle = "Invoices";
      break;
    case "/invoices/new":
      pageTitle = "Create Invoice";
      break;
    case "/clients":
      pageTitle = "Clients";
      break;
    case "/clients/new":
      pageTitle = "Create Client";
      break;
    case "/payments":
      pageTitle = "Payments";
      break;
    case "/settings":
      pageTitle = "Settings";
      break;
    case "/notifications":
      pageTitle = "Notifications";
      break;
    case "/help":
      pageTitle = "Help";
      break;
    case "/forgot-password":
      pageTitle = "Forgot Password";
      break;
    case "/reset-password":
      pageTitle = "Reset Password";
      break;
    case "/auth":
      pageTitle = "Sign In / Sign Up";
      break;
    case "/oauth/github":
      pageTitle = "GitHub Login";
      break;
    default:
      pageTitle = "Invii";
  }

  useEffect(() => {
    document.title = `${pageTitle}`;
  }, [pageTitle]);

  return null;
}
