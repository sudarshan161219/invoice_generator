import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { GoEye, GoEyeClosed } from "react-icons/go";
import styles from "./Input.module.css";

type Props = {
  id: string;
  name?: string;
  type: string;
  show: boolean;
  toggleShow: () => void;
  value: string;
  className?: string;
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField = forwardRef<HTMLInputElement, Props>(
  (
    { id, name, type, show, toggleShow, className, error, value, onChange },
    ref
  ) => {
    const inputType = type === "password" && show ? "text" : type;

    return (
      <div className="relative flex flex-col items-end justify-center">
        <input
          id={id}
          name={name}
          type={inputType}
          className={cn(
            "w-full rounded-md border shadow-sm",
            "border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1",
            error && "border-red-500 ring-red-500 focus:ring-red-500",
            styles.input,
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <span
            className="absolute mr-3 cursor-pointer text-[var(--foreground)] dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            onClick={toggleShow}
            tabIndex={-1}
          >
            {show ? <GoEyeClosed size={18} /> : <GoEye size={18} />}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
