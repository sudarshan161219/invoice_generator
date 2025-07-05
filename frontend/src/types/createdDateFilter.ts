export type CreatedDateFilter = "today" | "this-week" | "this-month" | "custom";

export const createdDateOptions: {
  label: string;
  value: CreatedDateFilter;
}[] = [
  { label: "Added Today", value: "today" },
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "Custom Date Range", value: "custom" },
];
