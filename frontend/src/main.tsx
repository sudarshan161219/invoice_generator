import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CollapseProvider } from "./providers/CollapseProvider";
import { AuthLayoutProvider } from "./providers/AuthLayoutProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GitHubOAuthProvider } from "./providers/GitHubOAuthProvider";
import { NotesModalProvider } from "./providers/NotesModalProvider";
import { InvoiceClientProvider } from "./providers/InvoiceClientProvider";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Failed to find root element");

createRoot(rootEl).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
    <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <AuthLayoutProvider>
            <InvoiceClientProvider>
              <NotesModalProvider>
                <CollapseProvider>
                  <BrowserRouter>
                    <GitHubOAuthProvider>
                      <App />
                    </GitHubOAuthProvider>
                  </BrowserRouter>
                  <Toaster richColors />
                </CollapseProvider>
              </NotesModalProvider>
            </InvoiceClientProvider>
          </AuthLayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
