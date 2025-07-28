import "./index.css";
import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(rootEl).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
