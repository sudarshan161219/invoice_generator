import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ClientForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = (data: any) => {
    if (onSubmit) onSubmit(data);
    console.log("Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Input placeholder="Name" {...register("name", { required: true })} />
      <Input placeholder="Email" type="email" {...register("email", { required: true })} />
      <Input placeholder="Phone" {...register("phone")} />
      <Input placeholder="Company" {...register("company")} />
      <Input placeholder="Address" {...register("address")} />

      <Button type="submit">Save Client</Button>
    </form>
  );
}