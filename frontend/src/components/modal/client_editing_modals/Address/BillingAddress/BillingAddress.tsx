import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import { useUpdateClient } from "@/hooks/client/useUpdateClient";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { toast } from "sonner";

export const BillingAddress = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();
  const { mutate: updateClientMutation, isPending } = useUpdateClient();
  const clientId = usePersistentClientId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.billingAddress);
    updateClientMutation(
      { id: clientId, data: { billingAddress: formData.billingAddress } },
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
      <div className="flex flex-col gap-2">
        <label htmlFor="billingAddress" className="block text-sm font-medium">
          Billing address
        </label>

        <textarea
          id="billingAddress"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
          placeholder="Billing address"
          className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
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
