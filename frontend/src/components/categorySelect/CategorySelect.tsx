import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { ColorDropdown } from "../ColorDropdown/ColorDropdown";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";


type Category = {
  id: number;
  name: string;
  color: string;
  isDefault?: boolean;
};

type CategorySelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  categories: Category[];
  onCategoriesUpdated: () => void; // callback after add/edit/delete
};

export const CategorySelect = <T extends FieldValues>({
  control,
  name,
}: CategorySelectProps<T>) => {

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
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(value) =>
              field.onChange(value === "none" ? "" : value)
            }
            value={field.value || ""}
          >
            <SelectTrigger id={name} className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— No Category —</SelectItem>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between pr-2"
                >
                  <SelectItem value={cat.id.toString()} className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>

                  {!cat.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent select from closing
                        handleRemoveCategory(cat.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="border-t my-2" />

              {/* Add Category Input + Color */}
              <div className="p-2 space-y-2">
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

              <div className="border-t my-1" />
              {/* <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() =>
                  openModal("manageCategories", ModalType.ManageCategories)
                }
              >
                ⚙ Manage Categories
              </Button> */}
            </SelectContent>
          </Select>
        )}
      />
    </>
  );
};
