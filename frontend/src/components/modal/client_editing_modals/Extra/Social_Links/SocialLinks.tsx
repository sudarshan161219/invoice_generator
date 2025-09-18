import { useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Label } from "@/components/input/Label";
import { Trash2, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useUpdateClient } from "@/hooks/client/useUpdateClient";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { useClient } from "@/hooks/useClient";
import { toast } from "sonner";

type Entry = { name: string; url: string; error?: string };

export const SocialLinks = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { closeModal } = useModal();
  const { client } = useClient();
  const { mutate: updateClientMutation, isPending } = useUpdateClient();
  const clientId = usePersistentClientId();

  // 🔹 Prefill from client.socialLinks if available
  useEffect(() => {
    if (client?.socialLinks && typeof client.socialLinks === "object") {
      const prefilled = Object.entries(client.socialLinks).map(
        ([name, url]) => ({
          name,
          url,
          error: undefined,
        })
      );
      setEntries(prefilled);
    } else {
      setEntries([{ name: "", url: "" }]); // at least one empty row
    }
  }, [client]);

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

  // const handleSave = () => {
  //   const validated = entries.map((entry) => {
  //     if (entry.name.trim() === "" || entry.url.trim() === "") {
  //       return { ...entry, error: "Platform and URL are required" };
  //     }
  //     if (!isValidUrl(entry.url.trim())) {
  //       return { ...entry, error: "Invalid URL" };
  //     }
  //     return { ...entry, error: undefined };
  //   });

  //   const validEntries = validated.filter((e) => !e.error);
  //   setEntries(validated);

  //   if (validEntries.length > 0) {
  //     const socialLinksJson = validEntries.reduce((acc, cur) => {
  //       acc[cur.name.trim()] = cur.url.trim();
  //       return acc;
  //     }, {} as Record<string, string>);

  //     updateClientMutation(
  //       { id: clientId, data: { socialLinks: socialLinksJson } },
  //       {
  //         onSuccess: () => {
  //           toast.success(`Client socials updated successfully!`);
  //           closeModal();
  //         },
  //         onError: (err) => {
  //           console.error("Failed to update client", err);
  //           toast.warning("Failed to update client");
  //         },
  //       }
  //     );
  //   }
  // };

  const handleSave = () => {
    // If no entries or all blank → save as {}
    if (
      entries.length === 0 ||
      entries.every((e) => !e.name.trim() && !e.url.trim())
    ) {
      updateClientMutation(
        { id: clientId, data: { socialLinks: {} } },
        {
          onSuccess: () => {
            toast.success(`All socials removed successfully!`);
            closeModal();
          },
          onError: (err) => {
            console.error("Failed to remove socials", err);
            toast.warning("Failed to remove socials");
          },
        }
      );
      return;
    }

    // Otherwise validate
    const validated = entries.map((entry) => {
      if (entry.name.trim() === "" || entry.url.trim() === "") {
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
      const socialLinksJson = validEntries.reduce((acc, cur) => {
        acc[cur.name.trim()] = cur.url.trim();
        return acc;
      }, {} as Record<string, string>);

      updateClientMutation(
        { id: clientId, data: { socialLinks: socialLinksJson } },
        {
          onSuccess: () => {
            toast.success(`Client socials updated successfully!`);
            closeModal();
          },
          onError: (err) => {
            console.error("Failed to update client", err);
            toast.warning("Failed to update client");
          },
        }
      );
    }
  };

  const handleCancel = () => {
    // Reset to original state
    if (client?.socialLinks && typeof client.socialLinks === "object") {
      const prefilled = Object.entries(client.socialLinks).map(
        ([name, url]) => ({
          name,
          url,
          error: undefined,
        })
      );
      setEntries(prefilled);
    } else {
      setEntries([{ name: "", url: "" }]);
    }
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
          disabled={isPending}
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
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="md"
          variant="default"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
