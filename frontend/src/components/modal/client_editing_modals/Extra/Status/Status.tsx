import { Label } from "@/components/input/Label";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import styles from "./index.module.css";
import { type ClientFormState } from "@/hooks/useClientForm";
import { Button } from "@/components/button/Button";

const statusOptions: { value: ClientFormState["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "prospect", label: "Prospect" },
];

export const Status = () => {
  const { closeModal } = useModal();
  const { formData, setFormData } = useClientForm();

  const cancel = () => {
    // reset status or just close modal
    setFormData((prev) => ({ ...prev, status: "active" }));
    closeModal();
  };

  const save = () => {
    // here you would call API or pass formData up
    console.log("Saving status:", formData.status);
    closeModal();
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
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 justify-end mt-2">
        <Button type="button" onClick={cancel} variant="outline" size="md">
          cancel
        </Button>
        <Button onClick={save} type="submit" variant="default" size="md">
          Save
        </Button>
      </div>
    </div>
  );
};
