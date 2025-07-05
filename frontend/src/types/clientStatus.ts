export type ClientStatus = "active" | "inactive" | "blacklisted" | "new";

export const clientStatusOptions: {
  label: string;
  value: ClientStatus;
}[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blacklisted", value: "blacklisted" },
  { label: "New", value: "new" },
];
