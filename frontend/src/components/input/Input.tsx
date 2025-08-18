import { forwardRef, useState, type ChangeEvent } from "react";
import { type InputProps } from "@/types/inputProps";
import { slugify } from "@/lib/slugify";
import { useValidation } from "./useValidation";
import { InputField } from "./InputField";
import { Label } from "./Label";
import { ErrorMessage } from "./ErrorMessage";
import { useAuthLayout } from "@/hooks/useAuthLayout";

export const Input = forwardRef<
  HTMLInputElement,
  InputProps & { required?: boolean; disableEnterSubmit?: boolean }
>(
  (
    {
      className,
      type = "text",
      label,
      name,
      placeholder,
      id,
      onChange,
      onKeyDown,
      value: controlledValue,
      required = false,
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState("");
    const { isLogin } = useAuthLayout();

    const value =
      controlledValue !== undefined ? controlledValue : uncontrolledValue;

    const toggleShow = () => setShow((prev) => !prev);

    const fallbackId =
      id ??
      name ??
      (label
        ? `input-${slugify(label)}`
        : `input-${Math.random().toString(36).substring(2, 9)}`);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      if (controlledValue === undefined) {
        setUncontrolledValue(newVal);
      }
      if (onChange) onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // prevent form submission
        e.preventDefault();

        // 👉 optionally, move focus to the next input instead of submitting
        const form = e.currentTarget.form;
        if (form) {
          const index = Array.prototype.indexOf.call(form, e.currentTarget);
          const next = form.elements[index + 1] as HTMLElement | undefined;
          next?.focus();
        }
      }

      // call parent-provided onKeyDown if exists
      if (onKeyDown) onKeyDown(e);
    };

    const validationMessage = useValidation(
      name,
      value != null ? String(value) : ""
    );

    return (
      <div className="w-full space-y-1">
        {label && (
          <Label htmlFor={fallbackId} text={label} required={required} />
        )}

        <InputField
          id={fallbackId}
          name={name}
          type={type}
          show={show}
          toggleShow={toggleShow}
          className={className}
          error={!isLogin && !!validationMessage}
          placeholder={placeholder}
          value={value != null ? String(value) : ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={ref}
        />

        {!isLogin && validationMessage && (
          <ErrorMessage message={validationMessage} />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
