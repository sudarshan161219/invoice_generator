import { cn } from "@/lib/utils";
import styles from "./Input.module.css";

export const Label = ({ htmlFor, text }: { htmlFor: string; text: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-[var(--label)]",
        styles.inputlabel
      )}
    >
      {text}
    </label>
  );
};
