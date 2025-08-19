import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { z } from "zod";
import { ColorDropdown } from "@/components/ColorDropdown/ColorDropdown";
import { labelColors } from "@/lib/labelColors/labelColors";
import styles from "./index.module.css";

const tagsSchema = z
  .array(
    z.object({
      name: z.string(),
      color: z.string().optional().default("#3b82f6"),
    })
  )
  .max(10, "You can add a maximum of 10 tags")
  .optional();

type Tag = { name: string; color: string };

interface TagInputProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
}

export const TagInput = ({ value, onChange }: TagInputProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<Tag[]>([]);
  const tags = value ?? uncontrolledValue;
  const [input, setInput] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const result = tagsSchema.safeParse(tags);
    if (!result.success) {
      alert(result.error.errors[0].message);
    } else {
      console.log("✅ Validated & saved tags:", result.data);
    }
  }, [tags]);

  const handleAddTag = () => {
    const name = input.trim();
    if (!name) return;
    if (tags.length >= 10) return alert("Max 10 tags allowed");

    if (!tags.find((t) => t.name.toLowerCase() === name.toLowerCase())) {
      const color = selectedColor || labelColors[0].hex;
      const newTags = [...tags, { name, color }];
      if (onChange) {
        onChange(newTags);
      } else {
        setUncontrolledValue(newTags);
      }
    }

    setInput("");
    setSelectedColor("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      e.stopPropagation();
      handleAddTag();
    }
  };

  const removeTag = (text: string) => {
    onChange(value.filter((tag) => tag.name !== text));
  };

  return (
    <div className="space-y-3">
      {/* Tag list */}
      <div>
        {tags.length < 10 && (
          <div className="flex items-center gap-2">
            <div
              className={`w-full rounded-md border shadow-sm not-last-of-type:border-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--ring)] focus:ring-1 ${styles.inputContainer}`}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type tag..."
              />
              <button type="button" onClick={handleAddTag}>
                <Plus size={15} />
                add
              </button>
            </div>

            <ColorDropdown
              selectedColor={selectedColor || labelColors[0].hex}
              onChange={(color) => setSelectedColor(color)}
            />
          </div>
        )}

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span
              key={tag.name}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                onClick={() => removeTag(tag.name)}
                className="ml-1 text-white hover:text-gray-200"
              >
                <X className=" cursor-pointer " size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
