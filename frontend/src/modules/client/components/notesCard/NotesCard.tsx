import React from "react";

interface Note {
  id: number;
  content: string;
  createdAt: string;
}

interface NotesCardProps {
  notes: Note[];
}

export const NotesCard: React.FC<NotesCardProps> = ({ notes }) => {
  if (!notes.length) {
    return (
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Client Notes</h2>
        <p className="text-sm text-gray-500">No notes available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Client Notes</h2>
      <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-gray-100 bg-gray-50 rounded-md p-3"
          >
            <div className="text-xs text-gray-400 mb-1">
              {new Date(note.createdAt).toLocaleString()}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
