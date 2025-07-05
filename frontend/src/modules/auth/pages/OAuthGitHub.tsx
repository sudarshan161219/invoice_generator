import { Loader2 } from "lucide-react"; // or your custom spinner

export const OAuthGitHub = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      <span className="ml-2">please wait...</span>
    </div>
  );
};
