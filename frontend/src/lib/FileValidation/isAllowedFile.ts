import { ALLOWED_EXTENSIONS } from "@/lib/extensions/allowed_extensions";
import { ALLOWED_TYPES } from "@/lib/extensions/allowed_types";
import { toast } from "sonner";
// const validateFile = (file: File) => {
//   if (!ALLOWED_TYPES.includes(file.type)) {
//     toast.warning(`Unsupported file: ${file.name}`);
//     return false;
//   }
//   const sizeMB = file.size / (1024 * 1024);
//   if (sizeMB > MAX_SIZE_MB) {
//     toast.warning(`File too large: ${file.name}`);
//     return false;
//   }
//   return true;
// };
const MAX_SIZE_MB = 25;

export const isAllowedFile = (file: File): boolean => {
  const fileName = file.name;
  const fileSizeMB = file.size / (1024 * 1024);
  const fileExt = "." + (fileName.split(".").pop()?.toLowerCase() ?? "");
  const typeAllowed = ALLOWED_TYPES.includes(file.type);
  const extAllowed = ALLOWED_EXTENSIONS.includes(fileExt);

  if (!typeAllowed && !extAllowed) {
    toast.warning(`Unsupported file type: ${fileName}`);
    return false;
  }

  if (fileSizeMB > MAX_SIZE_MB) {
    toast.warning(`File too large (${MAX_SIZE_MB}MB max): ${fileName}`);
    return false;
  }

  return true;
};
