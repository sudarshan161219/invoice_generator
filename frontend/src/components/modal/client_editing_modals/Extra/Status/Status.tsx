import { Label } from "@/components/input/Label";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import { Check } from "lucide-react";
import styles from "./index.module.css";
import { type ClientFormState } from "@/types/clients_types/ClientFormState";
import { Button } from "@/components/button/Button";
import { useUpdateClient } from "@/hooks/client/useUpdateClient";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { toast } from "sonner";

const statusOptions: { value: ClientFormState["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "prospect", label: "Prospect" },
];

export const Status = () => {
  const { closeModal } = useModal();
  const { formData, setFormData } = useClientForm();
  const { mutate: updateClientMutation, isPending } = useUpdateClient();
  const clientId = usePersistentClientId();

  const cancel = () => {
    // reset status or just close modal
    setFormData((prev) => ({ ...prev, status: "active" }));
    closeModal();
  };

  const save = () => {
    console.log("Updated General Info:", formData.status);
    updateClientMutation(
      { id: clientId, data: { status: formData.status } },
      {
        onSuccess: () => {
          toast.success(`Client status updated successfully!`);
          closeModal();
        },
        onError: (err) => {
          console.error("Failed to update client", err);
          toast.warning("Failed to update client");
        },
      }
    );
  };

  return (
    <div>
      <Label htmlFor="status" text="Status" />

      <div className={styles.listContainer}>
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.listItem} ${
              formData.status === option.value ? styles.active : ""
            }`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                status: option.value,
              }))
            }
          >
            {option.label}
            {formData.status === option.value && <Check size={17} />}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 justify-end mt-2">
        <Button
          disabled={isPending}
          type="button"
          onClick={cancel}
          variant="outline"
          size="md"
        >
          cancel
        </Button>
        <Button
          disabled={isPending}
          onClick={save}
          type="submit"
          variant="default"
          size="md"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
