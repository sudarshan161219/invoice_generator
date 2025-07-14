import { useState } from "react";
import styles from "./index.module.css";

type ReadMoreProps = {
  content: string;
  limit?: number; // optional character limit (default: 120)
};

export function ReadMore({ content, limit = 120 }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = content.length > limit;
  const displayText =
    !expanded && isLong ? content.slice(0, limit) + "..." : content;

  return (
    <div>
      <p className={styles.noteContent}>{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className={styles.readMore}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
