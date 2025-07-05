import { forwardRef, useState, type ChangeEvent } from "react";
import { type InputProps } from "@/types/inputProps";
import { slugify } from "@/lib/slugify";
import { useValidation } from "./useValidation";
import { InputField } from "./InputField";
import { Label } from "./Label";
import { ErrorMessage } from "./ErrorMessage";
import { useAuthLayout } from "@/hooks/useAuthLayout";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, name, id, onChange }, ref) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState("");
    const { isLogin } = useAuthLayout();

    const toggleShow = () => setShow((prev) => !prev);

    const fallbackId =
      id ??
      name ??
      (label
        ? `input-${slugify(label)}`
        : `input-${Math.random().toString(36).substring(2, 9)}`);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value); // update local state
      if (onChange) onChange(e); // forward to parent if neede
    };

    const validationMessage = useValidation(name, value);

    return (
      <div className="w-full space-y-1">
        {label && <Label htmlFor={fallbackId} text={label} />}

        <InputField
          id={fallbackId}
          name={name}
          type={type}
          show={show}
          toggleShow={toggleShow}
          className={className}
          error={!isLogin && !!validationMessage}
          value={value}
          onChange={handleChange}
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
