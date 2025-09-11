// import { useParams } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { Label } from "@/components/input/Label";
// import { CategorySelect } from "@/components/categorySelect/CategorySelect";
// import {
//   type ClientFormValues,
//   clientSchema,
// } from "@/types/clients_types/client_edit_types/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useGetClient } from "@/hooks/client/useGetClient";
// import { Button } from "@/components/button/Button";
// import { Input } from "@/components/input/Input";
// import styles from "./index.module.css";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus, Trash2 } from "lucide-react";
// import { useEffect } from "react";

// export const EditClient = () => {
//   const { id } = useParams<{ id: string }>();
//   const clientId = Number(id);
//   const { data, isLoading, error } = useGetClient(clientId);

//   const client = data?.data;

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<ClientFormValues>({
//     resolver: zodResolver(clientSchema),
//     defaultValues: {
//       status: "active",
//     },
//   });

//   useEffect(() => {
//   if (client) {
//     reset(client); // populate form fields with client data
//   }
// }, [client, reset]);

//   const onSubmit = async (values: ClientFormValues) => {
//     const fullData = {
//       id: clientId,
//       ...client, // original API data
//       ...values, // overwrite with edited form data
//     };

//     console.log("Full Data (merged):", fullData);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Something went wrong</p>;

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
//         {/* Basic Info */}
//         <section>
//           <h3 className="font-semibold mb-2">Basic Info</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Input
//               // value={client?.name}
//               {...register("name")}
//               label="Name"
//               required={true}
//               placeholder="Client name"
//             />
//             <Input
//               {...register("email")}
//               label="Email"
//               type="email"
//               required={true}
//               // value={client?.email}
//               placeholder="client@example.com"
//             />
//           </div>
//         </section>

//         {/* Contact */}
//         <section>
//           <h3 className="font-semibold mb-2">Contact</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Input
//               {...register("phone")}
//               label="phone"
//               placeholder="+91 98765 43210"
//             />
//             <Input
//               {...register("company")}
//               label="Company"
//               placeholder="Company name"
//             />
//           </div>
//         </section>

//         {/* Addresses */}
//         <section>
//           <h3 className="font-semibold mb-2">Addresses</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className={styles.textAreaContainer}>
//               <label className={styles.label} htmlFor="billingAddress">
//                 billing Address
//                 <span className="ml-1.5 text-gray-500 text-xs">(optional)</span>
//               </label>
//               <textarea
//                 id="billingAddress"
//                 {...register("billingAddress")}
//                 placeholder="Billing address"
//                 className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
//               />
//             </div>

//             <div className={styles.textAreaContainer}>
//               <label className={styles.label} htmlFor="shippingAddress">
//                 shipping Address
//                 <span className="ml-1.5 text-gray-500 text-xs">(optional)</span>
//               </label>
//               <textarea
//                 id="shippingAddress"
//                 {...register("shippingAddress")}
//                 placeholder="Shipping address"
//                 className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Business Info */}
//         <section>
//           <h3 className="font-semibold mb-2">Business Info</h3>
//           <div className="w-full">
//             <Input
//               label="Website"
//               {...register("website")}
//               placeholder="https://example.com"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//             <Input
//               label="Tax ID"
//               placeholder="Enter tax ID"
//               {...register("taxId")}
//             />
//             <Input
//               label="Tax ID Type"
//               {...register("taxIdType")}
//               placeholder="e.g. GST, VAT"
//             />
//           </div>
//         </section>

//         {/* Extra */}
//         <section>
//           <h3 className="font-semibold mb-2">Extra</h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
//             <div>
//               <Label htmlFor={"status"} text="Status" required={true} />
//               <Controller
//                 name="status"
//                 control={control}
//                 render={({ field }) => (
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger id="status" className="w-full">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                       <SelectItem value="prospect">Prospect</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.status && (
//                 <p className="text-sm text-red-500">{errors.status.message}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor={"category"} text="Category" required={false} />
//               <CategorySelect
//                 name="category"
//                 control={control}
//                 categories={[]}
//                 onCategoriesUpdated={function (): void {
//                   throw new Error("Function not implemented.");
//                 }}
//               />
//             </div>
//           </div>

//           {/* Social Links (basic JSON handling for now) */}
//           <div className="mt-4">
//             <Label htmlFor={"social"} text="Social Links" required={false} />
//             <Controller
//               control={control}
//               name="socialLinks"
//               render={({ field }) => {
//                 const entries = Object.entries(field.value ?? {}).map(
//                   ([key, value]) => ({
//                     key,
//                     value,
//                   })
//                 );
//                 const socialLinksError = errors.socialLinks?.message as
//                   | string
//                   | undefined;

//                 return (
//                   <div className="space-y-2">
//                     {entries.map((entry, index) => (
//                       <div key={index} className="flex flex-col gap-1">
//                         <div className="flex items-center gap-2">
//                           <Input
//                             placeholder="Platform (e.g. twitter)"
//                             value={entry.key}
//                             onChange={(e) => {
//                               const newEntries = [...entries];
//                               newEntries[index] = {
//                                 ...entry,
//                                 key: e.target.value,
//                               };
//                               field.onChange(
//                                 Object.fromEntries(
//                                   newEntries.map((e) => [e.key, e.value])
//                                 )
//                               );
//                             }}
//                           />
//                           <Input
//                             placeholder="https://..."
//                             value={entry.value}
//                             onChange={(e) => {
//                               const newEntries = [...entries];
//                               newEntries[index] = {
//                                 ...entry,
//                                 value: e.target.value,
//                               };
//                               field.onChange(
//                                 Object.fromEntries(
//                                   newEntries.map((e) => [e.key, e.value])
//                                 )
//                               );
//                             }}
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="md"
//                             onClick={() => {
//                               const newEntries = entries.filter(
//                                 (_, i) => i !== index
//                               );
//                               field.onChange(
//                                 Object.fromEntries(
//                                   newEntries.map((e) => [e.key, e.value])
//                                 )
//                               );
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>

//                         {socialLinksError && (
//                           <p className="text-sm text-red-500">
//                             {socialLinksError}
//                           </p>
//                         )}
//                       </div>
//                     ))}

//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       id="social"
//                       onClick={() => {
//                         const newEntries = [...entries, { key: "", value: "" }];
//                         field.onChange(
//                           Object.fromEntries(
//                             newEntries.map((e) => [e.key, e.value])
//                           )
//                         );
//                       }}
//                     >
//                       <Plus /> Add Link
//                     </Button>
//                   </div>
//                 );
//               }}
//             />
//           </div>
//         </section>

//         {/* <div className="mt-5 cursor-pointer"> */}
//         <Button className="w-full  mt-5 " type="submit" size="md">
//           Save Client
//         </Button>

//         {/* </div> */}
//       </form>
//     </div>
//   );
// };

import { ChevronRight } from "lucide-react";
import styles from "./index.module.css";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { useGetClient } from "@/hooks/client/useGetClient";
import { ModalType } from "@/types/ModalType";
import { useModal } from "@/hooks/useModal";

export const EditClient = () => {
  const { openModal } = useModal();
  const clientId = usePersistentClientId();
  const { data, isLoading, error } = useGetClient(clientId);

  const client = data?.data;

  return (
    <div className={styles.card}>
      <div className={styles.sectionContainer}>
        {/* General Section */}
        <div className={styles.section}>
          <SectionHeader
            title="General"
            desc="Basic details to identify this client."
          />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Display Name</h1>
              <p>{client?.name || "Add the client's full name"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("name", ModalType.Name)}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Email</h1>
              <p>{client?.email || "Add a valid email address"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("email", ModalType.Email)}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.section}>
          <SectionHeader
            title="Contact"
            desc="Ways to get in touch with this client."
          />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Phone</h1>
              <p>{client?.phone || "Add a phone number"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("phone", ModalType.Phone)}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Company</h1>
              <p>{client?.company || "Add the company name (if any)"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("companyName", ModalType.CompanyName)}
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className={styles.section}>
          <SectionHeader
            title="Profile Image"
            desc="Upload a recognizable avatar for this client."
          />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Avatar</h1>
              <p>
                {client?.imageUrl
                  ? "Custom image uploaded"
                  : "Add a profile image"}
              </p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("profileImage", ModalType.ProfileImage)}
            />
          </div>
        </div>

        {/* Business Info */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Business Info"
              desc="Key business-related details for this client."
            />

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Website</h1>
                <p>{client?.website || "Add the client's business website"}</p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("website", ModalType.Website)}
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Tax ID</h1>
                <p>{client?.taxId || "Enter the client's registered tax ID"}</p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("taxId", ModalType.TaxId)}
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Tax ID Type</h1>
                <p>
                  {client?.taxIdType || "Specify type (e.g., GST, VAT, PAN)"}
                </p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("taxIdType", ModalType.TaxIdType)}
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Addresses"
              desc="Manage billing and shipping addresses for this client."
            />

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Billing Address</h1>
                <p>{client?.website || "Add the client's Billing Address"}</p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() =>
                  openModal("billingAddress", ModalType.BillingAddress)
                }
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Shipping Address</h1>
                <p>{client?.website || "Add the client's Shipping Address"}</p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() =>
                  openModal("shippingAddress", ModalType.ShippingAddress)
                }
              />
            </div>
          </div>
        </div>

        {/* Extra Section */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Extra"
              desc="Additional details to better organize this client."
            />

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Status</h1>
                <p>
                  {client?.status ||
                    "Set client status (Active, Inactive, etc.)"}
                </p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("status", ModalType.Status)}
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Social Links</h1>
                <p>
                  {client?.socialLinks?.length
                    ? "Social profiles added"
                    : "Add LinkedIn, Twitter, etc."}
                </p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("socialLinks", ModalType.SocialLinks)}
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Category</h1>
                <p>
                  {client?.category ||
                    "Assign a category (e.g., Business, Personal, VIP)"}
                </p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("category", ModalType.Category)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
