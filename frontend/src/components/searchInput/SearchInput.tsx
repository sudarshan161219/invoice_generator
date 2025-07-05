import {
  useState,
  useEffect,
  useMemo,
  type FC,
  type ReactElement,
} from "react";
import { debounce } from "lodash";
import type { SearchInputProps } from "@/types/search-input";
// import { Input } from "@/components/ui/input";
import { Input } from "@/components/input/Input";

export const SearchInput: FC<SearchInputProps> = ({
  placeholder = "Search...",
  delay = 500,
  onDebouncedChange,
}): ReactElement => {
  const [value, setValue] = useState("");

  const debouncedChangeHandler = useMemo(() => {
    return debounce(onDebouncedChange, delay);
  }, [onDebouncedChange, delay]);

  useEffect(() => {
    debouncedChangeHandler(value);
    // Cleanup on unmount
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [value, debouncedChangeHandler]);

  return (
    <div className="w-full max-w-sm">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground"
      />
    </div>
  );
};
