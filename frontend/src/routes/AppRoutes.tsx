import { Routes, Route } from "react-router-dom";
import {
  AuthPage,
  DashboardPage,
  ClientsPage,
  ClientPage,
  AttachmentsPage,
  ClientNotes,
  InvoicesPage,
  SettingsPage,
  CreateInvoice,
  CreateClient,
  PaymentsPage,
  NotFound,
  ForgotPasswordPage,
  ResetPassword,
  HelpPage,
  InvoicePaymentPage,
  NotificationsPage,
} from "@/modules/export.ts";
import { OAuthGitHub } from "@/modules/auth/pages/OAuthGitHub";
import { PrivateRoutes } from "./PrivateRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/oauth/github" element={<OAuthGitHub />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/invoice/:id" element={<InvoicePaymentPage />} />
      <Route path="/" element={<PrivateRoutes />}>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/new" element={<CreateInvoice />} />
        <Route path="clients/new" element={<CreateClient />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="client/:id" element={<ClientPage />} />
        <Route path="attachments/:id" element={<AttachmentsPage />} />
        <Route path="notes/:id" element={<ClientNotes />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
