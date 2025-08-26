import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  status: z.string().nullable().optional(),
  taxId: z.string().optional(),
  taxIdType: z.string().optional(),
  notes: z.string().optional(),
  socialLinks: z.record(z.string()).optional(), // e.g. { linkedin: "...", twitter: "..." }
  category: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

type ClientFormProps = {
  client?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
};

export const EditModal = ({ client, onSubmit }: ClientFormProps) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      company: client?.company ?? "",
      billingAddress: client?.billingAddress ?? "",
      shippingAddress: client?.shippingAddress ?? "",
      website: client?.website ?? "",
      status: client?.status ?? "",
      taxId: client?.taxId ?? "",
      taxIdType: client?.taxIdType ?? "",
      notes: "",
      socialLinks: client?.socialLinks ?? {},
      category: client?.category ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <section>
          <h3 className="font-semibold mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="client@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Contact */}
        <section>
          <h3 className="font-semibold mb-2">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Addresses */}
        <section>
          <h3 className="font-semibold mb-2">Addresses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Billing address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Shipping address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Business Info */}
        <section>
          <h3 className="font-semibold mb-2">Business Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxIdType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. GST, VAT" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Extra */}
        <section>
          <h3 className="font-semibold mb-2">Extra</h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional notes..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Social Links (basic JSON handling for now) */}
          <FormField
            control={form.control}
            name="socialLinks"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Social Links (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='{"linkedin": "https://...", "twitter": "https://..."}'
                    value={JSON.stringify(field.value ?? {}, null, 2)}
                    onChange={(e) => {
                      try {
                        field.onChange(JSON.parse(e.target.value));
                      } catch {
                        field.onChange({});
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <Button type="submit" className="w-full mt-6">
          Save Client
        </Button>
      </form>
    </Form>
  );
};
