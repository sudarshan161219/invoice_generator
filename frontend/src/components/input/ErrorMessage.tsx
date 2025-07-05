import styles from "./Input.module.css";

export const ErrorMessage = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return <p className={styles.errorMsg}>{message}</p>;
};
