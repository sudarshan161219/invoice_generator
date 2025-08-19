import { type FC, type ReactElement } from "react";
import { Input } from "@/components/input/Input";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/button/Button";
import { TagInput } from "../tags/TagInput";
import styles from "./index.module.css";
import type {
  ClientCreateForm,
  ClientFormValues,
} from "@/modules/createClient/services";
import { useCreateClient } from "@/hooks/client/useCreateClient";

export const ClientForm: FC = (): ReactElement => {
  const { mutate, isPending } = useCreateClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>();

  const onSubmit: SubmitHandler<ClientCreateForm> = async (data) => {
    mutate(data);
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

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <Button
          isLoading={isPending}
          type="submit"
          loadingText="Please wait..."
          variant="default"
          size="md"
        >
          {isPending ? "Saving..." : "Save Client"}
        </Button>
      </form>
    </>
  );
};
