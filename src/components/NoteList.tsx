import type { Note } from "@/lib/notes";

type NoteListProps = {
  /** Notes to display (already filtered by the search query). */
  notes: Note[];
  /** Whether any notes exist at all (vs. the filter matching nothing). */
  hasNotes: boolean;
  query: string;
  activeId: string | null;
  onSelect: (id: string) => void;
  onQueryChange: (query: string) => void;
};

export default function NoteList({
  notes,
  hasNotes,
  query,
  activeId,
  onSelect,
  onQueryChange,
}: NoteListProps) {
  if (!hasNotes) {
    return <p className="empty">No notes yet. Click &ldquo;New Note&rdquo;.</p>;
  }

  return (
    <>
      <input
        className="search-input"
        type="search"
        placeholder="Search notes..."
        aria-label="Search notes"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      {notes.length === 0 ? (
        <p className="empty">No notes match &ldquo;{query}&rdquo;.</p>
      ) : (
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
      )}
    </>
  );
}