import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";

export const General = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.name);
    // Here you would call your API to save changes
  };

  const cancel = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Display Name
        </label>
        <Input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter client's name"
          className="mt-1 w-full rounded border p-2"
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
