import {
  type InputHTMLAttributes,
  type ReactElement,
  type ChangeEvent,
} from "react";
import { Check } from "lucide-react";
import styles from "./index.module.css";

type Props = {
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({
  rememberMe,
  setRememberMe,
  ...inputProps
}: Props): ReactElement => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
    inputProps.onChange?.(e);
  };

  return (
    <div>
      <label className={styles.checkboxContainer}>
        <span>remember me</span>
        <input
          type="checkbox"
          {...inputProps}
          className={styles.input}
          checked={rememberMe}
          onChange={handleCheckboxChange}
        />
        <span className={styles.checkmark}>
          {rememberMe && <Check className="text-white w-4 h-4" />}
        </span>
      </label>
    </div>
  );
};
