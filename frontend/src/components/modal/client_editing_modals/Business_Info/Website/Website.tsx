import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { useModal } from "@/hooks/useModal";
import { useClientForm } from "@/hooks/useClientForm";
import style from "./index.module.css";

export const Website = () => {
  const { closeModal } = useModal();
  const { formData, handleChange, setFormData } = useClientForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", formData.website);
    // Here you would call your API to save changes
  };

  const cancel = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="website" className="block text-sm font-medium">
          website
        </label>
        <Input
          id="website"
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
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
