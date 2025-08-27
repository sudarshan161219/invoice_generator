import { cn } from "@/lib/utils";
import styles from "./Input.module.css";

interface LabelProps {
  htmlFor: string;
  text: string;
  required?: boolean;
}

export const Label = ({ htmlFor, text, required = false }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-[var(--label)]",
        styles.inputlabel
      )}
    >
      {text}
      {required ? (
        <span className="text-red-500 ml-1.5">*</span>
      ) : (
        <span className="text-gray-500 text-xs ml-1.5">(optional)</span>
      )}
    </label>
  );
};
