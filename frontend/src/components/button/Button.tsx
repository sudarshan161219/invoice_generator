import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ButtonProps, type Variant, type Size } from "@/types/buttonProps";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "md",
      type = "button",
      isLoading = false,
      loadingText,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:ring-offset-0.5 disabled:opacity-50 disabled:pointer-events-none md:cursor-pointer";

    const variants: Record<Variant, string> = {
      default:
        "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--accent)]",
      outline:
        "border border-[var(--input)] text-[var(--foreground)] hover:bg-accent",
      ghost: "bg-transparent text-[var(--foreground)] hover:bg-muted ",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes: Record<Size, string> = {
      sm: "px-3 py-1 text-sm rounded-md",
      smMd: "px-3.5 py-2 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-md",
      lg: "px-5 py-3 text-lg rounded-lg",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? loadingText : children}
      </button>
    );
  }
);
