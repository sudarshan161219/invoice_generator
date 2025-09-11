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

const GeneralName = lazy(() =>
  import("./client_editing_modals/General/name/Name").then((m) => ({
    default: m.General,
  }))
);

const GeneralEmail = lazy(() =>
  import("./client_editing_modals/General/email/Email").then((m) => ({
    default: m.General,
  }))
);

const Company = lazy(() =>
  import("./client_editing_modals/Contact/Company/Company").then((m) => ({
    default: m.Company,
  }))
);

const Phone = lazy(() =>
  import("./client_editing_modals/Contact/Phone/Phone").then((m) => ({
    default: m.Phone,
  }))
);

const Avatar = lazy(() =>
  import("./client_editing_modals/Profile_Image/Avatar/Avatar").then((m) => ({
    default: m.Avatar,
  }))
);

const TaxId = lazy(() =>
  import("./client_editing_modals/Business_Info/Tax_ID/TaxID").then((m) => ({
    default: m.TaxId,
  }))
);

const TaxIdType = lazy(() =>
  import("./client_editing_modals/Business_Info/Tax_ID_Type/TaxIDType").then(
    (m) => ({
      default: m.TaxIdType,
    })
  )
);

const Website = lazy(() =>
  import("./client_editing_modals/Business_Info/Website/Website").then((m) => ({
    default: m.Website,
  }))
);

const BillingAddress = lazy(() =>
  import("./client_editing_modals/Address/BillingAddress/BillingAddress").then(
    (m) => ({
      default: m.BillingAddress,
    })
  )
);

const ShippingAddress = lazy(() =>
  import(
    "./client_editing_modals/Address/ShippingAddress/ShippingAddress"
  ).then((m) => ({
    default: m.ShippingAddress,
  }))
);

const SocialLinks = lazy(() =>
  import("./client_editing_modals/Extra/Social_Links/SocialLinks").then(
    (m) => ({
      default: m.SocialLinks,
    })
  )
);

const Category = lazy(() =>
  import("./client_editing_modals/Extra/Category/Category").then((m) => ({
    default: m.Category,
  }))
);

const Status = lazy(() =>
  import("./client_editing_modals/Extra/Status/Status").then((m) => ({
    default: m.Status,
  }))
);

export type Mode =
  | "addNote"
  | "editNote"
  | "addFile"
  | "warning"
  | "manageCategories"
  | "editFileName"
  | "addClient"
  | "name"
  | "email"
  | "phone"
  | "companyName"
  | "profileImage"
  | "status"
  | "socialLinks"
  | "category"
  | "website"
  | "taxId"
  | "taxIdType"
  | "billingAddress"
  | "shippingAddress";

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

      // 🔹 General
      case "name":
        return <GeneralName />;
      case "email":
        return <GeneralEmail />;

      // 🔹 Contact
      case "phone":
        return <Phone />;
      case "companyName":
        return <Company />;

      // 🔹 Profile
      case "profileImage":
        return <Avatar />;

      // 🔹 Business Info
      case "website":
        return <Website />;
      case "taxId":
        return <TaxId />;
      case "taxIdType":
        return <TaxIdType />;

      // 🔹 Addresses
      case "billingAddress":
        return <BillingAddress />;
      case "shippingAddress":
        return <ShippingAddress />;

      // 🔹 Extra
      case "status":
        return <Status />;
      case "socialLinks":
        return <SocialLinks />;
      case "category":
        return <Category />;

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
