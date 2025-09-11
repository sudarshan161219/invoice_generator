import { useEffect, useState } from "react";
import { ClientNotesDesktop } from "../components/ClientNotesDesktop/ClientNotesDesktop";
import { ClientNotesMobile } from "../components/ClientNotesMobile/ClientNotesMobile";

export const ClientNotes = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile ? <ClientNotesMobile /> : <ClientNotesDesktop />;
};
