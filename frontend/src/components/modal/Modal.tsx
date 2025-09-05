// import styles from "./index.module.css";
// import { useModal } from "@/hooks/useModal";
// import { ModalHeader } from "./ModalHeader";
// import { AddNoteModal } from "@/components/addNoteModal/AddNoteModal";
// import { UploadFileButton } from "./UploadFileButton";
// import { Warning } from "./WarningModal";
// import { ManageCategoriesModal } from "../ManageCategoriesModal/ManageCategoriesModal";
// import { CreateClientModal } from "@/components/createClientModal/CreateClientModal";
// import { EditFileInfoModal } from "./editFileInfoModal";

// export type Mode =
//   | "addNote"
//   | "editNote"
//   | "addFile"
//   | "warning"
//   | "manageCategories"
//   | "addClient";

// export const Modal = () => {
//   const { isOpen, mode, closeModal } = useModal();

//   if (!isOpen) return null;

//   const renderView = () => {
//     switch (mode) {
//       case "addNote":
//         return <AddNoteModal />;
//       case "manageCategories":
//         return <ManageCategoriesModal />;
//       case "addFile":
//         return <UploadFileButton />;
//       case "warning":
//         return <Warning />;
//       case "editFile":
//         return <EditFileInfoModal />;
//       case "addClient":
//         return <CreateClientModal />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalCard}>
//         <ModalHeader mode={mode || ""} toggleModal={closeModal} />
//         {renderView()}
//       </div>
//       <div onClick={closeModal} className={styles.modalBg}></div>
//     </div>
//   );
// };

import { lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";
import { ModalHeader } from "./ModalHeader";

// Lazy load with default re-map for named exports
const AddNoteModal = lazy(() =>
  import("@/components/addNoteModal/AddNoteModal").then((m) => ({
    default: m.AddNoteModal,
  }))
);

const UploadFileButton = lazy(() =>
  import("./UploadFileButton").then((m) => ({
    default: m.UploadFileButton,
  }))
);

const Warning = lazy(() =>
  import("./WarningModal").then((m) => ({
    default: m.Warning,
  }))
);

const ManageCategoriesModal = lazy(() =>
  import("../ManageCategoriesModal/ManageCategoriesModal").then((m) => ({
    default: m.ManageCategoriesModal,
  }))
);

const CreateClientModal = lazy(() =>
  import("@/components/createClientModal/CreateClientModal").then((m) => ({
    default: m.CreateClientModal,
  }))
);

const EditFileInfoModal = lazy(() =>
  import("./editFileInfoModal").then((m) => ({
    default: m.EditFileInfoModal,
  }))
);

export type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFileName"
  | "addClient";

// function renderView() {
//   switch (mode) {
//     case "addNote":
//       return <AddNoteModal />;
//     case "manageCategories":
//       return <ManageCategoriesModal />;
//     case "addFile":
//       return <UploadFileButton />;
//     case "warning":
//       return <Warning />;
//     case "editFileName":
//       return <EditFileInfoModal />;
//     case "addClient":
//       return <CreateClientModal />;
//     default:
//       return null;
//   }
// }

export const Modal = () => {
  const { isOpen, mode, closeModal } = useModal();

  if (!isOpen) return null;

  const renderView = () => {
    switch (mode) {
      case "addNote":
        return <AddNoteModal />;
      case "manageCategories":
        return <ManageCategoriesModal />;
      case "addFile":
        return <UploadFileButton />;
      case "warning":
        return <Warning />;
      case "editFileName":
        return <EditFileInfoModal />;
      case "addClient":
        return <CreateClientModal />;
      default:
        return null;
    }
  };

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <ModalHeader mode={mode || ""} toggleModal={closeModal} />
        <Suspense fallback={<div className={styles.spinner}>Loading...</div>}>
          {renderView()}
        </Suspense>
      </div>
      <div onClick={closeModal} className={styles.modalBg}></div>
    </div>,
    document.body
  );
};
