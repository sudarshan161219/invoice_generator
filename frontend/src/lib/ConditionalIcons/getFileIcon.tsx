import React from "react";
import {
  FileText,
  FileImage,
  FileArchive,
  FileAudio,
  FileVideo,
  File,
} from "lucide-react";

export const getFileIcon = (type: string | null | undefined): React.ReactNode => {
  if (!type) return <File size={16} />;

  if (type.startsWith("image/")) return <FileImage size={16} />;
  if (type.startsWith("video/")) return <FileVideo size={16} />;
  if (type.startsWith("audio/")) return <FileAudio size={16} />;
  if (
    type === "application/pdf" ||
    type.includes("msword") ||
    type.includes("wordprocessingml") ||
    type.includes("vnd.ms-excel") ||
    type.includes("spreadsheetml")
  )
    return <FileText size={16} />;
  if (
    type === "application/zip" ||
    type === "application/x-zip-compressed" ||
    type.includes("rar") ||
    type.includes("tar")
  )
    return <FileArchive size={16} />;

  return <File size={16} />;
};
