export interface SearchInputProps {
  placeholder?: string;
  delay?: number; // debounce delay in ms
  onDebouncedChange: (value: string) => void;
}
