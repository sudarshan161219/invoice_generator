import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ClientTag } from "@/types/clients_types/types";

interface TagFilterProps {
  availableTags: ClientTag[];
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTagIds,
  onChange,
}) => {
  const handleToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="w-[250px] rounded-lg border shadow-sm">
      <Command>
        <CommandInput placeholder="Filter by tags..." />
        <CommandList>
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup heading="Tags">
            {availableTags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.name}
                onSelect={() => handleToggle(tag.id)}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedTagIds.includes(tag.id)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50"
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.color ?? "#999" }}
                  />
                  {tag.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};
