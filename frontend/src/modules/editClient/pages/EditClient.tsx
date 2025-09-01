import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/input/Label";
import { CategorySelect } from "@/components/categorySelect/CategorySelect";
import {
  type ClientFormValues,
  clientSchema,
} from "@/types/clients_types/client_edit_types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetClient } from "@/hooks/client/useGetClient";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import styles from "./index.module.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const { data, isLoading, error } = useGetClient(clientId);

  const client = data?.data;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    console.log("Form Data:", values);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Basic Info */}
        <section>
          <h3 className="font-semibold mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              value={client?.name}
              {...register("name")}
              label="Name"
              required={true}
              placeholder="Client name"
            />
            <Input
              {...register("email")}
              label="Email"
              type="email"
              required={true}
              value={client?.email}
              placeholder="client@example.com"
            />
          </div>
        </section>

        {/* Contact */}
        <section>
          <h3 className="font-semibold mb-2">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register("phone")}
              label="phone"
              placeholder="+91 98765 43210"
            />
            <Input
              {...register("company")}
              label="Company"
              placeholder="Company name"
            />
          </div>
        </section>

        {/* Addresses */}
        <section>
          <h3 className="font-semibold mb-2">Addresses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={styles.textAreaContainer}>
              <label className={styles.label} htmlFor="billingAddress">
                billing Address
                <span className="ml-1.5 text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                id="billingAddress"
                {...register("billingAddress")}
                placeholder="Billing address"
                className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
              />
            </div>

            <div className={styles.textAreaContainer}>
              <label className={styles.label} htmlFor="shippingAddress">
                shipping Address
                <span className="ml-1.5 text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                id="shippingAddress"
                {...register("shippingAddress")}
                placeholder="Shipping address"
                className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
              />
            </div>
          </div>
        </section>

        {/* Business Info */}
        <section>
          <h3 className="font-semibold mb-2">Business Info</h3>
          <div className="w-full">
            <Input
              label="Website"
              {...register("website")}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label="Tax ID"
              placeholder="Enter tax ID"
              {...register("taxId")}
            />
            <Input
              label="Tax ID Type"
              {...register("taxIdType")}
              placeholder="e.g. GST, VAT"
            />
          </div>
        </section>

        {/* Extra */}
        <section>
          <h3 className="font-semibold mb-2">Extra</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
            <div>
              <Label htmlFor={"status"} text="Status" required={true} />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor={"category"} text="Category" required={false} />
              <CategorySelect name="category" control={control} />
              {/* <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>

                      <div className="p-2 border-t mt-1">
                        <Button
                          size="md"
                          type="button"
                          onClick={() => console.log("Custom Action")}
                        >
                          + Add New Category
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                )}
              /> */}
            </div>
          </div>

          {/* Social Links (basic JSON handling for now) */}
          <div className="mt-4">
            <Label htmlFor={"social"} text="Social Links" required={false} />
            <Controller
              control={control}
              name="socialLinks"
              render={({ field }) => {
                const entries = Object.entries(field.value ?? {}).map(
                  ([key, value]) => ({
                    key,
                    value,
                  })
                );
                const socialLinksError = errors.socialLinks?.message as
                  | string
                  | undefined;

                return (
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div key={index} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Platform (e.g. twitter)"
                            value={entry.key}
                            onChange={(e) => {
                              const newEntries = [...entries];
                              newEntries[index] = {
                                ...entry,
                                key: e.target.value,
                              };
                              field.onChange(
                                Object.fromEntries(
                                  newEntries.map((e) => [e.key, e.value])
                                )
                              );
                            }}
                          />
                          <Input
                            placeholder="https://..."
                            value={entry.value}
                            onChange={(e) => {
                              const newEntries = [...entries];
                              newEntries[index] = {
                                ...entry,
                                value: e.target.value,
                              };
                              field.onChange(
                                Object.fromEntries(
                                  newEntries.map((e) => [e.key, e.value])
                                )
                              );
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() => {
                              const newEntries = entries.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(
                                Object.fromEntries(
                                  newEntries.map((e) => [e.key, e.value])
                                )
                              );
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {socialLinksError && (
                          <p className="text-sm text-red-500">
                            {socialLinksError}
                          </p>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      id="social"
                      onClick={() => {
                        const newEntries = [...entries, { key: "", value: "" }];
                        field.onChange(
                          Object.fromEntries(
                            newEntries.map((e) => [e.key, e.value])
                          )
                        );
                      }}
                    >
                      <Plus /> Add Link
                    </Button>
                  </div>
                );
              }}
            />
          </div>
        </section>

        <div className="mt-5">
          <Button className="w-full" type="submit" size="md">
            Save Client
          </Button>
        </div>
      </form>
    </div>
  );
};
