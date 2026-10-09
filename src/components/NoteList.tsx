import type { Note } from "@/lib/notes";

type NoteListProps = {
  notes: Note[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export default function NoteList({ notes, activeId, onSelect }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="empty">No notes yet. Click &ldquo;New Note&rdquo;.</p>;
  }

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li
          key={note.id}
          className={note.id === activeId ? "active" : undefined}
          onClick={() => onSelect(note.id)}
        >
          <div className="note-title">{note.title || "Untitled"}</div>
          <div className="note-date">
            {new Date(note.updatedAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}