import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";

export const General = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.email);
    // Here you would call your API to save changes
  };

  const cancel = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>

        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="client@example.com"
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
