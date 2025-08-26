import { ChevronRight } from "lucide-react";
import styles from "./index.module.css";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Button } from "@/components/button/Button";

export const ProfileTab = () => {
  const { user } = useAuth();

  const openModal = () => {
    console.log("Hello, World");
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionContainer}>
        {/* General Section */}
        <div className={styles.section}>
          <SectionHeader title="General" desc="Basic account information" />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Display Name</h1>
              <p>{user?.name || "Not set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("name")}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Email</h1>
              <p>{user?.email}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("email")}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.section}>
          <SectionHeader title="Contact" desc="How we can reach you" />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Phone</h1>
              <p>{user?.phone || "Not set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("phone")}
            />
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Company</h1>
              <p>{user?.companyName || "Not set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("companyName")}
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className={styles.section}>
          <SectionHeader title="Profile Image" desc="Avatar for your account" />

          <div className={styles.infoRow}>
            <div className={styles.infoContainer}>
              <h1>Avatar</h1>
              <p>{user.profileImage ? "Custom Image" : "Not set"}</p>
            </div>
            <ChevronRight
              className={styles.rightIcon}
              onClick={() => openModal("profileImage")}
            />
          </div>
        </div>

        {/* Account Authorization */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader
              title="Account Authorization"
              desc="Manage login & security"
            />

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Password</h1>
                <p>••••••••</p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("password")}
              />
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Google</h1>
                <p>Connect to log in to Invii with your Google account</p>
              </div>
              <Button size="md" variant="outline">
                Connect
              </Button>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Github</h1>
                <p>Connect to log in to Invii with your Github account</p>
              </div>
              <Button size="md" variant="outline">
                Connect
              </Button>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <h1>Two-factor authentication</h1>
                <p></p>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("role")}
              />
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className={styles.section}>
          <div className="space-y-4">
            <SectionHeader title="Advanced" desc="" />

            <div className={styles.infoRow}>
              <div className={styles.infoContainer}>
                <div className={styles.infoContainer}>
                  <h1>Delete Account</h1>
                  <p>Remove all your data permanently</p>
                </div>
              </div>
              <ChevronRight
                className={styles.rightIcon}
                onClick={() => openModal("password")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
