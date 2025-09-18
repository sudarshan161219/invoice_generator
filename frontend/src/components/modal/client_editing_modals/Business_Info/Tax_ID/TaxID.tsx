import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import { useUpdateClient } from "@/hooks/client/useUpdateClient";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { toast } from "sonner";
import style from "./index.module.css";

export const TaxId = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();
  const { mutate: updateClientMutation, isPending } = useUpdateClient();
  const clientId = usePersistentClientId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.taxId);
    updateClientMutation(
      { id: clientId, data: { taxId: formData.taxId } },
      {
        onSuccess: () => {
          toast.success(`Client name updated successfully!`);
          closeModal();
        },
        onError: (err) => {
          console.error("Failed to update client", err);
          toast.warning("Failed to update client");
        },
      }
    );
  };

  const cancel = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taxId" className="block text-sm font-medium">
          Tax ID
        </label>
        <Input
          id="taxId"
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          placeholder="Enter tax ID"
          className={style.input}
        />
      </div>

      <div className="flex gap-1.5 justify-end">
        <Button
          disabled={isPending}
          type="button"
          onClick={cancel}
          variant="outline"
          size="md"
        >
          cancel
        </Button>
        <Button disabled={isPending} type="submit" variant="default" size="md">
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
