import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, User2 } from "lucide-react";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  profileImage: z.string().url().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const useProfile = () =>
  useQuery<ProfileForm>({
    queryKey: ["settings", "profile"],
    queryFn: () => api("/api/settings/profile"),
  });

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileForm) =>
      api("/api/settings/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["settings", "profile"] }),
  });
}

export const ProfileTab = () => {
  // const { data, isLoading } = useProfile();
  // const { mutateAsync, isPending } = useUpdateProfile();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: "",
  });

  const onSubmit = async (values: ProfileForm) => {
    // await mutateAsync(values);
    toast.success("Profile updated");
  };

  function SectionHeader({
    icon: Icon,
    title,
    desc,
  }: {
    icon: React.ComponentType<any>;
    title: string;
    desc?: string;
  }) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-2xl bg-muted">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
        </div>
      </div>
    );
  }

  function Loading() {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
      </div>
    );
  }

  // if (isLoading) return <Loading />;

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          icon={User2}
          title="Profile"
          desc="Update your personal and company information."
        />
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <Input label="Full Name" id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              label="Email"
              id="email"
              type="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input label="Phone" id="phone" {...form.register("phone")} />
          </div>

          <div className="space-y-2">
            <Input
              label="Company"
              id="companyName"
              {...form.register("companyName")}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Input
              label="Avatar URL"
              id="profileImage"
              placeholder="https://..."
              {...form.register("profileImage")}
            />
          </div>

          <div className="sm:col-span-2">
            {/* <Button size="md" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Save Changes
            </Button> */}

            <Button size="md" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
