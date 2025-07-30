// components/ui/checkbox.tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react"; // Optional: icon

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className={`peer appearance-none h-5 w-5 border rounded-md border-gray-300 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 ${className}`}
            {...props}
          />
          <Check className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition" />
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
