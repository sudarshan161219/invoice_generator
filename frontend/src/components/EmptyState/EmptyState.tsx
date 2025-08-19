import { Button } from "../button/Button";
import { useModal } from "@/hooks/useModal";

type EmptyStateProps = {
  title: string;
  description?: string;
  buttonText: string;
  redirectTo: string;
};

export const EmptyState = ({
  title,
  description,
  buttonText,
}: EmptyStateProps) => {
  const { toggleModal } = useModal();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      <Button variant="outline" onClick={toggleModal}>
        {buttonText}
      </Button>
    </div>
  );
};
