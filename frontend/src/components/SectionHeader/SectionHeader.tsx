import styles from "./index.module.css";

export const SectionHeader = ({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
    </div>
  );
};
