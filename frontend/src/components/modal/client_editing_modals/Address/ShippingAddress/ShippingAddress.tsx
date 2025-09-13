import { Button } from "@/components/button/Button";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";

export const ShippingAddress = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.shippingAddress);
    // Here you would call your API to save changes
  };

  const cancel = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="shippingAddress" className="block text-sm font-medium">
          shipping Address
        </label>

        <textarea
          id="shippingAddress"
          name="shippingAddress"
          value={formData.shippingAddress || undefined}
          onChange={handleChange}
          placeholder="Shipping Address"
          className="border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 w-full rounded-md border shadow-sm p-2"
        />
      </div>

      <div className="flex gap-1.5 justify-end">
        <Button type="button" onClick={cancel} variant="outline" size="md">
          cancel
        </Button>
        <Button type="submit" variant="default" size="md">
          Save
        </Button>
      </div>
    </form>
  );
};
