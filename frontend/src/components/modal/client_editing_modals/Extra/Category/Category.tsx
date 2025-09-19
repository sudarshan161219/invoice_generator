import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { ColorDropdown } from "@/components/ColorDropdown/ColorDropdown";
import { X, Pen } from "lucide-react";
import { useClientForm } from "@/hooks/useClientForm";
import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";
import { useCategories } from "@/hooks/category/useCategories";
import { toast } from "sonner";

export const Category = () => {
  const { formData, setFieldValue } = useClientForm();
  const { closeModal } = useModal();
  const { categories, addCategory, editCategory, removeCategory, isLoading } =
    useCategories();

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [labelColor, setLabelColor] = useState("#f97316");
  const [labelName, setLabelName] = useState("");

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.category?.id
  );

  const handleAddOrEditCategory = async () => {
    if (!labelName.trim()) return;

    if (editId) {
      // update category
      await editCategory.mutateAsync({
        id: editId,
        data: { name: labelName, color: labelColor },
      });
    } else {
      // add new custom category
      await addCategory.mutateAsync({
        name: labelName,
        color: labelColor,
        isDefault: false,
      });
    }

    // reset
    setLabelName("");
    setLabelColor("#f97316");
    setEditId(null);
    setEdit(false);
  };

  const handleEditCategory = (id: number, name: string, color: string) => {
    setLabelName(name);
    setLabelColor(color);
    setEditId(id);
    setEdit(true);
  };

  const handleRemoveCategory = async (id: number) => {
    await removeCategory.mutateAsync(id);

    // clear selection if removed
    if (formData.category?.id === id) {
      setFieldValue("category", { id: 0, name: "", color: "" });
    }
    setLabelName("");
    setLabelColor("#f97316");
    setEditId(null);
    setEdit(false);
  };

  const handleCancel = () => {
    setLabelName("");
    setLabelColor("#f97316");
    setEdit(false);
    setEditId(null);
    closeModal();
  };

  const handleSave = () => {
    if (selectedCategory) {
      console.log("Selected category:", selectedCategory);
      closeModal();
    } else {
      toast.warning("please select category");
    }
  };

  if (isLoading) {
    return <p>please wait...</p>;
  }

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
                ? styles.categoryActive
                : styles.category
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
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className={styles.categoryName}>{cat.name}</span>
            </div>

            {!cat.isDefault && (
              <div className="flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(cat.id, cat.name, cat.color);
                  }}
                  className="ml-2 text-[var(--label)] cursor-pointer"
                >
                  <Pen size={14} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(cat.id);
                  }}
                  className="ml-2 text-[var(--label)] hover:text-red-500 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add or Edit Category */}
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
            onClick={handleAddOrEditCategory}
            className="w-full flex items-center gap-1"
          >
            {edit ? (
              <>
                <Pen size={13} /> Update Category
              </>
            ) : (
              "+ Add Category"
            )}
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
