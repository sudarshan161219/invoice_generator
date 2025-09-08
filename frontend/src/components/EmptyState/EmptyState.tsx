import { Button } from "../button/Button";
import { useModal } from "@/hooks/useModal";

type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFileName"
  | "addClient";

export const ModalType = {
  AddNote: "addNote",
  EditNote: "editNote",
  AddFile: "addFile",
  EditFileName: "editFileName",
  Warning: "warning",
  ManageCategories: "manageCategories",
  AddClient: "addClient",
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];

type EmptyStateProps = {
  title: string;
  description?: string;
  buttonText: string;
  redirectTo?: string;
  mode: Mode;
  modeType: ModalType;
};

export const EmptyState = ({
  title,
  description,
  buttonText,
  mode,
  modeType,
}: EmptyStateProps) => {
  const { openModal } = useModal();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      <Button variant="outline" onClick={() => openModal(mode, modeType)}>
        {buttonText}
      </Button>
    </div>
  );
};
