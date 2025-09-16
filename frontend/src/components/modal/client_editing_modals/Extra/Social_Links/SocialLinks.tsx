import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Label } from "@/components/input/Label";
import { Trash2, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";

type Entry = { name: string; url: string; error?: string };

export const SocialLinks = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { closeModal } = useModal();

  const handleChange = (
    index: number,
    field: "name" | "url",
    newValue: string
  ) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: newValue, error: undefined };
    setEntries(updated);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    const validated = entries.map((entry) => {
      if (entry.name.trim() === "" && entry.url.trim() === "") {
        return { ...entry, error: "Platform and URL are required" };
      }
      if (!isValidUrl(entry.url.trim())) {
        return { ...entry, error: "Invalid URL" };
      }
      return { ...entry, error: undefined };
    });

    const validEntries = validated.filter((e) => !e.error);

    setEntries(validated);

    if (validEntries.length > 0) {
      // Convert array -> JSON object
      const socialLinksJson = validEntries.reduce((acc, cur) => {
        acc[cur.name.trim()] = cur.url.trim();
        return acc;
      }, {} as Record<string, string>);

      console.log("Saved Social Links (JSON):", socialLinksJson);

      // TODO: send `socialLinksJson` to backend
      // await api.updateClient({ socialLinks: socialLinksJson });
    }
  };

  const handleCancel = () => {
    setEntries([]); // reset
    closeModal();
  };

  return (
    <div className="mt-4 space-y-4">
      <Label htmlFor="social" text="Social Links" required={false} />

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Platform (e.g. Twitter)"
                value={entry.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="https://..."
                value={entry.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEntries(entries.filter((_, i) => i !== index))
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {entry.error && (
              <p className="text-sm text-red-500">{entry.error}</p>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          id="social"
          onClick={() => setEntries([...entries, { name: "", url: "" }])}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Link
        </Button>
      </div>

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
