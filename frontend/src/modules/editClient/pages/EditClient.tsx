import { ChevronRight } from "lucide-react";
import styles from "./index.module.css";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import { useGetClient } from "@/hooks/client/useGetClient";
import { ModalType } from "@/types/ModalType";
import { useModal } from "@/hooks/useModal";
import { useClient } from "@/hooks/useClient";
import { useEffect } from "react";

export const EditClient = () => {
  const { openModal } = useModal();
  const clientId = usePersistentClientId();
  const { setClient } = useClient();
  const { data, isLoading, error } = useGetClient(clientId);

  const client = data?.data;
  useEffect(() => {
    if (client) {
      setClient(client);
    }
  }, [client, setClient]);

  return (
    <div className={styles.card}>
      <div className={styles.sectionContainer}>
        {/* General Section */}
        <div className={styles.section}>
          <SectionHeader
            title="General"
            desc="Basic details to identify this client."
          />

          <div
            className={styles.infoRow}
            onClick={() => openModal("name", ModalType.Name)}
          >
            <div className={styles.infoContainer}>
              <h1>Display Name</h1>
              <p>{client?.name || "Add the client's full name"}</p>
            </div>
            <div className={styles.iconContainer}>
              <ChevronRight
                size={20}
                className={styles.rightIcon}
                onClick={() => openModal("name", ModalType.Name)}
              />
            </div>
          </div>

          <div
            className={styles.infoRow}
            onClick={() => openModal("email", ModalType.Email)}
          >
            <div className={styles.infoContainer}>
              <h1>Email</h1>
              <p>{client?.email || "Add a valid email address"}</p>
            </div>

            <div className={styles.iconContainer}>
              <ChevronRight
                size={20}
                className={styles.rightIcon}
                onClick={() => openModal("email", ModalType.Email)}
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.section}>
          <SectionHeader
            title="Contact"
            desc="Ways to get in touch with this client."
          />

          <div
            className={styles.infoRow}
            onClick={() => openModal("phone", ModalType.Phone)}
          >
            <div className={styles.infoContainer}>
              <h1>Phone</h1>
              <p>{client?.phone || "Add a phone number"}</p>
            </div>
            <div className={styles.iconContainer}>
              <ChevronRight
                size={20}
                className={styles.rightIcon}
                onClick={() => openModal("phone", ModalType.Phone)}
              />
            </div>
          </div>

          <div
            className={styles.infoRow}
            onClick={() => openModal("companyName", ModalType.CompanyName)}
          >
            <div className={styles.infoContainer}>
              <h1>Company</h1>
              <p>{client?.company || "Add the company name (if any)"}</p>
            </div>
            <div className={styles.iconContainer}>
              <ChevronRight
                size={20}
                className={styles.rightIcon}
                onClick={() => openModal("companyName", ModalType.CompanyName)}
              />
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className={styles.section}>
          <SectionHeader
            title="Profile Image"
            desc="Upload a recognizable avatar for this client."
          />

          <div
            className={styles.infoRow}
            onClick={() => openModal("profileImage", ModalType.ProfileImage)}
          >
            <div className={styles.infoContainer}>
              <h1>Avatar</h1>
              <p>
                {client?.imageUrl
                  ? "Custom image uploaded"
                  : "Add a profile image"}
              </p>
            </div>
            <div className={styles.iconContainer}>
              <ChevronRight
                size={20}
                className={styles.rightIcon}
                onClick={() =>
                  openModal("profileImage", ModalType.ProfileImage)
                }
              />
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Business Info"
              desc="Key business-related details for this client."
            />

            <div
              className={styles.infoRow}
              onClick={() => openModal("website", ModalType.Website)}
            >
              <div className={styles.infoContainer}>
                <h1>Website</h1>
                <p>{client?.website || "Add the client's business website"}</p>
              </div>
              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() => openModal("website", ModalType.Website)}
                />
              </div>
            </div>

            <div
              className={styles.infoRow}
              onClick={() => openModal("taxId", ModalType.TaxId)}
            >
              <div className={styles.infoContainer}>
                <h1>Tax ID</h1>
                <p>{client?.taxId || "Enter the client's registered tax ID"}</p>
              </div>

              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() => openModal("taxId", ModalType.TaxId)}
                />
              </div>
            </div>

            <div
              className={styles.infoRow}
              onClick={() => openModal("taxIdType", ModalType.TaxIdType)}
            >
              <div className={styles.infoContainer}>
                <h1>Tax ID Type</h1>
                <p>
                  {client?.taxIdType || "Specify type (e.g., GST, VAT, PAN)"}
                </p>
              </div>
              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() => openModal("taxIdType", ModalType.TaxIdType)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Addresses"
              desc="Manage billing and shipping addresses for this client."
            />

            <div
              className={styles.infoRow}
              onClick={() =>
                openModal("billingAddress", ModalType.BillingAddress)
              }
            >
              <div className={styles.infoContainer}>
                <h1>Billing Address</h1>
                <p>{client?.website || "Add the client's Billing Address"}</p>
              </div>
              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() =>
                    openModal("billingAddress", ModalType.BillingAddress)
                  }
                />
              </div>
            </div>

            <div
              className={styles.infoRow}
              onClick={() =>
                openModal("shippingAddress", ModalType.ShippingAddress)
              }
            >
              <div className={styles.infoContainer}>
                <h1>Shipping Address</h1>
                <p>{client?.website || "Add the client's Shipping Address"}</p>
              </div>
              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() =>
                    openModal("shippingAddress", ModalType.ShippingAddress)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Section */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Extra"
              desc="Additional details to better organize this client."
            />

            <div
              className={styles.infoRow}
              onClick={() => openModal("status", ModalType.Status)}
            >
              <div className={styles.infoContainer}>
                <h1>Status</h1>
                <p>
                  {client?.status ||
                    "Set client status (Active, Inactive, etc.)"}
                </p>
              </div>

              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() => openModal("status", ModalType.Status)}
                />
              </div>
            </div>

            <div
              className={styles.infoRow}
              onClick={() => openModal("socialLinks", ModalType.SocialLinks)}
            >
              <div className={styles.infoContainer}>
                <h1>Social Links</h1>
                <p>
                  {client?.socialLinks?.length
                    ? "Social profiles added"
                    : "Add LinkedIn, Twitter, etc."}
                </p>
              </div>

              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() =>
                    openModal("socialLinks", ModalType.SocialLinks)
                  }
                />
              </div>
            </div>

            <div
              className={styles.infoRow}
              onClick={() => openModal("category", ModalType.Category)}
            >
              <div className={styles.infoContainer}>
                <h1>Category</h1>
                <p>
                  {client?.category ||
                    "Assign a category (e.g., Business, Personal, VIP)"}
                </p>
              </div>
              <div className={styles.iconContainer}>
                <ChevronRight
                  size={20}
                  className={styles.rightIcon}
                  onClick={() => openModal("category", ModalType.Category)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
