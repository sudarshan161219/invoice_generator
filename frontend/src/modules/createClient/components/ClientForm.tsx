import { type FC, type ReactElement, useState } from "react";
import type { ApiErrorResponse } from "../types/client";
import { Input } from "@/components/input/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/Button";
import { createClient } from "../api/create.client.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  clientSchema,
  type ClientCreateForm,
} from "@/modules/createClient/services";

export const ClientForm: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>("");

  function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
    return (error as AxiosError)?.isAxiosError === true;
  }

  const {
    register,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm<ClientCreateForm>({
    resolver: zodResolver(clientSchema),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setValue("imageUrl", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ClientCreateForm> = async (data) => {
    setLoading(true);
    try {
      const clientData: ClientCreateForm = data;
      const res = await createClient(clientData);
      console.log(res);
      toast.success(`${data.name || "Client"} created successfully.`);
    } catch (error) {
      if (isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border rounded p-4 shadow"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          label="Name"
          placeholder="Client Name"
          {...register("name")}
        />
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          {...register("email")}
        />

        <Input
          type="number"
          label="Phone"
          placeholder="Phone"
          {...register("phone")}
        />

        <Input
          type="text"
          label="Company"
          placeholder="Company"
          {...register("company")}
        />

        <Input
          type="text"
          label="address"
          placeholder="Address"
          {...register("address")}
        />
      </div>

      <textarea
        placeholder="Notes"
        className="border p-2 w-full"
        {...register("notes.0.content")}
      />

      {/* Optional Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Upload Client Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Client Preview"
            className="w-24 h-24 rounded object-cover border"
          />
        )}
      </div>

      <Button
        isLoading={loading}
        type="submit"
        loadingText="Please wait..."
        variant="default"
        size="md"
        className="text-sm"
      >
        Save Client
      </Button>
    </form>
  );
};
