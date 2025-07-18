import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainHeading } from "@/components/mainHeading/MainHeading";
import { QuickActions } from "@/components/quickAction/QuickActions";
import { PanelLeftOpen } from "lucide-react";
import { useCollapse } from "@/hooks/useCollapse";
// import styles from "./index.module.css";
export const Header = () => {
  const { collapse, toggleSidebar } = useCollapse();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="h-16 border-b px-6 sticky top-0  flex items-center justify-between md:justify-between">
      <div className="flex flex-row gap-3  items-center">
        <button
          className={`cursor-pointer mb-0.5 z-10 ${
            collapse ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        >
          <PanelLeftOpen size={20} />
        </button>
        <MainHeading />
      </div>
      <div className="flex items-center gap-3">
        <QuickActions />
        {!isMobile && (
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
};
