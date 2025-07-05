import { cn } from "@/lib/utils";
import type { TableProps } from "@/types/table.types";
import styles from "./index.module.css";

export const Table = <T,>({
  data,
  columns,
  rowKey,
  emptyText = "No data.",
}: TableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">No clients found.</div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-[var(--card)] text-[var(--primary)]">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-2 py-2 not-first:font-medium",
                  col.className,
                  styles.th
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn("px-2 py-2", col.className, styles.td)}
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
