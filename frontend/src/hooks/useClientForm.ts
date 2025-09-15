import { useEffect, useState } from "react";
import { useClient } from "@/hooks/useClient";

type Category = {
  id: number;
  name: string;
  color: string;
  isDefault?: boolean;
};

export type ClientFormState = {
  name: string;
  email: string;
  phone?: string;
  company?: string;

  // Addresses
  billingAddress?: string;
  shippingAddress?: string;

  // Business info
  website?: string;
  taxId?: string;
  taxIdType?: string;

  // Status / categorization
  status: "active" | "inactive" | "prospect";
  category?: Category; // could also be number if you link to Category model

  // Extra info
  socialLinks?: Record<string, string>; // e.g. { twitter: "url", linkedin: "url" }

  imageUrl?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export const useClientForm = () => {
  const { client } = useClient();
  const [formData, setFormData] = useState<ClientFormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    // Addresses
    billingAddress: "",
    shippingAddress: "",

    // Business info
    website: "",
    taxId: "",
    taxIdType: "",
    // Status / categorization
    status: "active",
    category: undefined, // could also be number if you link to Category model

    // Extra info
    socialLinks: {},

    imageUrl: "",

    // Meta
    createdAt: "",
    updatedAt: "",
    userId: 0,
  });

  // initialize when client changes
  useEffect(() => {
    if (client) {
      setFormData((prev) => ({
        ...prev,
        ...client,
      }));
    }
  }, [client]);

  // generic input handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const setFieldValue = (name: keyof ClientFormState, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const setFieldValue = <K extends keyof ClientFormState>(
    name: K,
    value: ClientFormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { formData, setFormData, handleChange, setFieldValue };
};
