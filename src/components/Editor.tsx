import type { Note } from "@/lib/notes";

type EditorProps = {
  note: Note | null;
  status: string;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

export default function Editor({
  note,
  status,
  onTitleChange,
  onBodyChange,
  onSave,
  onDelete,
}: EditorProps) {
  return (
    <section className="editor">
      <input
        className="title-input"
        type="text"
        placeholder={note ? "Title" : "Create a note to start"}
        value={note?.title ?? ""}
        disabled={!note}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <textarea
        className="body-input"
        placeholder={note ? "Take a note..." : ""}
        value={note?.body ?? ""}
        disabled={!note}
        onChange={(e) => onBodyChange(e.target.value)}
      />
      <div className="editor-actions">
        <span className="status">{status}</span>
        <div>
          <button className="primary" onClick={onSave}>
            Save
          </button>
          <button className="danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}