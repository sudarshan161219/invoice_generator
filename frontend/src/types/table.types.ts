export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
}
