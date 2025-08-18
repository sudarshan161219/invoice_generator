import { type FC, type ReactElement, useState } from "react";
import type { ApiErrorResponse } from "./types/client";
import { Input } from "@/components/input/Input";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/button/Button";
import { createClient } from "./api/create.client.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TagInput } from "../tags/TagInput";
import styles from "./index.module.css";
import type {
  ClientCreateForm,
  ClientFormValues,
} from "@/modules/createClient/services";

export const ClientForm: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>();

  function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
    return (error as AxiosError)?.isAxiosError === true;
  }

  const onSubmit: SubmitHandler<ClientCreateForm> = async (data) => {
    setLoading(true);
    try {
      await createClient(data);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputContainer}>
          <Input
            type="text"
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name", { required: true })}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="JohnDoe@example.com"
            error={errors.email?.message}
            {...register("email")}
            required
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
            placeholder="Doe.co"
            {...register("company")}
          />

          {/* <TagInput /> */}

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <Button
          isLoading={loading}
          type="submit"
          loadingText="Please wait..."
          variant="default"
          size="md"
        >
          {loading ? "Saving..." : "Save Client"}
        </Button>
      </form>
    </>
  );
};
