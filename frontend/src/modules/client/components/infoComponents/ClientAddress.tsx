import styles from "./index.module.css";

export const ClientAddress = ({ address }: { address: string }) => (
  <div className={styles.addressContainer}>
    <h3 className={styles.containerHeading}>Address</h3>
    <p className="mt-1">{address}</p>
  </div>
);
