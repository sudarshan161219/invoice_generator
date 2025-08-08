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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleHelp } from "lucide-react";
import { Header } from "@/components/header/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import darkLogo from "@/assets/dark.svg";
import lightLogo from "@/assets/light.svg";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useCollapse } from "@/hooks/useCollapse";
import { useAuth } from "@/hooks/useAuth";
import styles from "./index.module.css";
import { Tabs } from "@/components/tab/Tab";
import { type Tab } from "@/components/tab/types/tab.types";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

export const MobileSidebar = () => {
  const location = useLocation();
  const { collapse, toggleSidebar } = useCollapse();
  const { user } = useAuth();
  const { theme, toggleTheme, toggleLight, toggleDark } = useTheme();

  const tabData: Tab[] = [
    {
      id: 1,
      label: "Light",
      themeColor: "light",
      icon: <Sun size={16} />,
      content: undefined,
      toggleLight: toggleLight,
    },
    {
      id: 2,
      label: "Dark",
      themeColor: "dark",
      icon: <Moon size={16} />,
      content: undefined,
      toggleDark: toggleDark,
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    console.log(collapse);
  };

  function shortenEmail(email: string) {
    const [name, domain] = email.split("@");
    return name.length > 10
      ? `${name.slice(0, 6)}...@${domain.split(".")[0]}`
      : `${name}@...`;
  }

  const mainMenuItems = [
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
  ];

  const secondaryMenuItems = [
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { label: "Help", icon: <CircleHelp size={18} />, path: "/help" },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`border-r ${styles.sidebar} transition-all duration-300 ${
          collapse ? "w-0" : "w-70"
        }`}
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
            className={`cursor-pointer z-10 ${collapse ? "hidden" : "inline"}`}
            onClick={toggleSidebar}
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
        {/* Main Menu */}
        <div
          className={`flex flex-col gap-1 mt-4 p-2 ${
            collapse ? "hidden" : "flex"
          }`}
        >
          <span className=" mb-1 text-sm text-[var(--label)]">menu</span>
          {mainMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 w-full"
                onClick={toggleSidebar}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
        {/* Divider */}
        <hr className="my-3 border-muted" />
        {/* Secondary Menu */}
        <div
          className={`flex flex-col p-2 gap-1 ${collapse ? "hidden" : "flex"}`}
        >
          <span className=" mb-1 text-sm text-[var(--label)]">support</span>
          {secondaryMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 w-full text-muted-foreground"
                onClick={toggleSidebar}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
        <div
          className={`${
            collapse ? "hidden" : "flex"
          }  flex-col gap-2.5 absolute bottom-0 p-2 cursor-pointer w-full`}
        >
          <div
            className={`flex flex-col gap-1 ${collapse ? "hidden" : "flex"}`}
          >
            <span className="ml-4 mb-1 text-sm text-[var(--label)]">Theme</span>
            <Tabs
              tabs={tabData}
              mode={"theme"}
              toggleTheme={toggleTheme}
              variant="outline"
            />
          </div>

          <div className={styles.profile}>
            <div className="flex items-center gap-2">
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className={styles.name_email}>
                <span className={styles.name}>{user && user.name}</span>
                <span className={styles.email}>
                  {user && shortenEmail(user?.email)}
                </span>
              </div>
            </div>
            <LogOut onClick={handleLogout} size={18} />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 h-screen">
        <Header />

        <main className="flex-1 p-4 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>

      <div
        onClick={toggleSidebar}
        className={`${styles.backdrop} ${
          collapse ? "hidden" : "inline"
        } transition-all duration-300`}
      ></div>
    </div>
  );
};
