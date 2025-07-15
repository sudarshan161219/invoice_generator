import { useState } from "react";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";

export const AddNoteForm = () => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add note logic goes here
    console.warn("Define note submission logic");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write a note..."
        rows={3}
        className={styles.textArea}
      />
      <Button type="submit" variant="outline" size="md">
        Add Note
      </Button>
    </form>
  );
};
