import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import style from "./index.module.css";

export const TaxId = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.taxId);
    // Here you would call your API to save changes
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
