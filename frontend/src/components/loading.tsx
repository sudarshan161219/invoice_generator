import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
};
