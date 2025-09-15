import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { ColorDropdown } from "@/components/ColorDropdown/ColorDropdown";
import { X } from "lucide-react";
import { useClientForm } from "@/hooks/useClientForm";
import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";

type Category = {
  id: number;
  name: string;
  color: string;
  isDefault?: boolean;
};

export const Category = () => {
  const { formData, setFieldValue } = useClientForm();
  const { closeModal } = useModal();
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "VIP", color: "#ef4444", isDefault: true },
    { id: 2, name: "Regular", color: "#3b82f6", isDefault: true },
    { id: 3, name: "One-time", color: "#22c55e", isDefault: true },
  ]);

  const [labelColor, setLabelColor] = useState("#f97316");
  const [labelName, setLabelName] = useState("");

  const handleAddCategory = () => {
    if (!labelName.trim()) return;
    const newCat: Category = {
      id: categories.length + 1,
      name: labelName,
      color: labelColor,
    };
    setCategories((prev) => [...prev, newCat]);
    setLabelName("");
    setLabelColor("#f97316");
  };

  const handleRemoveCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));

    // If removed category was selected, clear selection
    if (formData.category?.id === id) {
      setFieldValue("category", {
        id: 0,
        name: "",
        color: "",
      });
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.category?.id
  );

  const handleSave = () => {
    console.log(selectedCategory);
  };

  const handleCancel = () => {
    setCategories([
      {
        id: 0,
        name: "",
        color: "",
        isDefault: true,
      },
    ]);
    closeModal();
  };

  return (
    <div className="space-y-4">
      {/* Category List */}
      <div className="space-y-2 border rounded-md p-3">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Choose Category
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex items-center justify-between rounded-md px-2 py-1 cursor-pointer ${
              formData.category?.id === cat.id
                ? `${styles.categoryActive}`
                : `${styles.category}`
            }`}
            onClick={() =>
              setFieldValue("category", {
                id: cat.id,
                name: cat.name,
                color: cat.color,
              })
            }
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full "
                style={{ backgroundColor: cat.color }}
              />
              <span className={styles.categoryName}>{cat.name}</span>
            </div>

            {!cat.isDefault && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCategory(cat.id);
                }}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {/* Add new category */}
        <div className="border-t my-2 pt-2 space-y-2">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="New category"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
            />
            <ColorDropdown
              selectedColor={labelColor}
              onChange={(color) => setLabelColor(color)}
            />
          </div>
          <Button
            type="button"
            size="md"
            onClick={handleAddCategory}
            className="w-full"
          >
            + Add Category
          </Button>
        </div>
      </div>

      {/* Selected Category at Bottom */}
      {selectedCategory && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Selected:</span>
          <span
            className="flex items-center gap-2 rounded-full px-2 py-1 text-white text-xs"
            style={{ backgroundColor: selectedCategory.color }}
          >
            {selectedCategory.name}
          </span>
        </div>
      )}

      <div className="flex gap-2 pt-2 justify-end">
        <Button
          type="button"
          size="md"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button type="button" size="md" variant="default" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
