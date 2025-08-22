import {
  useState,
  useMemo,
  useEffect,
  type FC,
  type ReactElement,
} from "react";
import { debounce } from "lodash";
import type { SearchInputProps } from "@/types/search-input";
import { Input } from "@/components/input/Input";
import styles from "./index.module.css";

export const SearchInput: FC<SearchInputProps> = ({
  placeholder = "Search...",
  delay = 500,
  onDebouncedChange,
}): ReactElement => {
  const [value, setValue] = useState("");

  // Create debounced function ONCE
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((val: string) => {
        onDebouncedChange(val);
      }, delay),
    [onDebouncedChange, delay]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    debouncedChangeHandler(val); // debounce here instead of in effect
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`placeholder:text-muted-foreground ${styles.input}`}
    />
  );
};
