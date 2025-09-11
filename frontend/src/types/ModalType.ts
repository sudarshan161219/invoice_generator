// export const ModalType = {
//   AddNote: "addNote",
//   EditNote: "editNote",
//   AddFile: "addFile",
//   EditFileName: "editFileName",
//   Warning: "warning",
//   ManageCategories: "manageCategories",
//   AddClient: "addClient",
// } as const;

// export type ModalType = (typeof ModalType)[keyof typeof ModalType];

export const ModalType = {
  AddNote: "addNote",
  EditNote: "editNote",
  AddFile: "addFile",
  EditFileName: "editFileName",
  Warning: "warning",
  ManageCategories: "manageCategories",
  AddClient: "addClient",

  // 🔹 Client Info Editing
  Name: "name",
  Email: "email",
  Phone: "phone",
  CompanyName: "companyName",
  ProfileImage: "profileImage",

  // 🔹 Extra
  Status: "status",
  SocialLinks: "socialLinks",
  Category: "category",

  // 🔹 Business Info
  Website: "website",
  TaxId: "taxId",
  TaxIdType: "taxIdType",

  // 🔹 Addresses
  BillingAddress: "billingAddress",
  ShippingAddress: "shippingAddress",
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];
