export type ClientCategory = "freelancer" | "agency" | "long-term" | "one-time";

export const clientCategoryOptions: {
  label: string;
  value: ClientCategory;
}[] = [
  { label: "Freelancers", value: "freelancer" },
  { label: "Agencies", value: "agency" },
  { label: "Long-Term", value: "long-term" },
  { label: "One-Time", value: "one-time" },
];
