import {
  PanelLeftClose,
  LayoutDashboard,
  Users,
  UserRoundPlus,
  FileText,
  Settings,
  LogOut,
  CreditCard,
  FilePlus,
} from "lucide-react";
import { Header } from "@/components/header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import darkLogo from "@/assets/dark.svg";
import lightLogo from "@/assets/light.svg";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useCollapse } from "@/hooks/useCollapse";
import { Breadcrumbs } from "@/components/breadCrumbs/Breadcrumbs";
import styles from "./index.module.css";

export const DesktopSidebar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { collapse, toggleSidebar } = useCollapse();
  const handleLogout = () => {
    console.log("Logging out...");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/",
    },
    { label: "Invoices", icon: <FileText size={18} />, path: "/invoices" },
    {
      label: "Create Invoice",
      icon: <FilePlus size={18} />,
      path: "/invoices/new",
    },
    { label: "Clients", icon: <Users size={18} />, path: "/clients" },
    {
      label: "Create Client",
      icon: <UserRoundPlus size={18} />,
      path: "clients/new",
    },
    { label: "Payments", icon: <CreditCard size={18} />, path: "/payments" },
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${styles.sideBar} ${
          collapse ? "border-none" : "border-r"
        } ${collapse ? `${styles.sideBarClose}` : `${styles.sideBarOpen}`}`}
      >
        <div className="flex items-center justify-between p-4">
          <img
            className="ml-3"
            src={theme === "dark" ? darkLogo : lightLogo}
            alt="Billoop logo"
            width={80}
            height={80}
          />
          <button
            className={`cursor-pointer ${collapse ? "hidden" : "inline"}`}
            onClick={toggleSidebar}
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        {/* Sidebar Items */}

        <nav
          className={`${
            collapse ? "hidden" : "flex"
          }  flex-col gap-1 w-full p-2`}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 w-full"
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div
          className={`${
            collapse ? "hidden" : "flex"
          }  flex-col gap-1 absolute bottom-0 p-4 cursor-pointer w-full`}
        >
          <Button
            onClick={handleLogout}
            type="button"
            variant="destructive"
            size="sm"
            className=" w-full cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Topbar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-2 overflow-y-auto bg-background">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
